// API do Retratu: Express 5 + SQLite.
//
// Regras de acesso:
//   - catálogo (pacotes, blog, loja) é público para leitura
//   - leads, pedidos e pedidos de edição podem ser criados por qualquer visitante
//   - leitura de pedidos exige sessão e fica limitada aos do próprio utilizador
//   - alterações e listagens de leads/pedidos exigem perfil admin

import { randomBytes } from "node:crypto";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import cors from "cors";
import express from "express";
import multer from "multer";

import {
  criarToken,
  criarUtilizador,
  exigirAdmin,
  exigirSessao,
  lerToken,
  procurarPorEmail,
  utilizadorPublico,
  verificarPalavraPasse,
} from "./auth.js";
import { PASTA_UPLOADS, db } from "./db.js";
import {
  ENTIDADES,
  agregar,
  apagar,
  atualizar,
  atualizarMuitos,
  contar,
  criar,
  criarMuitos,
  listar,
  obter,
} from "./entities.js";

const aqui = dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors({ origin: process.env.APP_ORIGIN || true }));
app.use(express.json({ limit: "5mb" }));

const LEITURA_PUBLICA = new Set(["pacotes", "blog", "loja:categorias", "loja:produtos"]);
const ESCRITA_PUBLICA = new Set(["leads", "pedidos", "pedidos-edicao"]);

/** Utilizador do pedido, ou null. Nunca lança. */
function utilizadorDoPedido(req) {
  const cabecalho = req.headers.authorization || "";
  if (!cabecalho.startsWith("Bearer ")) return null;

  const carga = lerToken(cabecalho.slice(7));
  if (!carga) return null;

  return db.prepare("SELECT * FROM utilizadores WHERE id = ?").get(carga.sub) || null;
}

/** Envolve handlers síncronos para devolver sempre JSON de erro. */
const envolver = (fn) => (req, res) => {
  try {
    return fn(req, res);
  } catch (erro) {
    const status = erro.status || 500;
    if (status >= 500) console.error(erro);
    return res.status(status).json({ error: erro.message || "Erro interno." });
  }
};

// ------------------------------------------------------------------ saúde ---
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, entidades: Object.keys(ENTIDADES) });
});

// ------------------------------------------------------------------- auth ---
app.post(
  "/api/auth/register",
  envolver((req, res) => {
    const { email, password } = req.body || {};

    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(email))) {
      return res.status(400).json({ error: "E-mail inválido." });
    }
    if (!password || String(password).length < 8) {
      return res.status(400).json({ error: "A palavra-passe deve ter pelo menos 8 caracteres." });
    }
    if (procurarPorEmail(email)) {
      return res.status(409).json({ error: "Já existe uma conta com este e-mail." });
    }

    const utilizador = criarUtilizador({ email, palavraPasse: password });
    return res.status(201).json({
      ...utilizadorPublico(utilizador),
      access_token: criarToken(utilizador),
      sessaoIniciada: true,
    });
  })
);

app.post(
  "/api/auth/login",
  envolver((req, res) => {
    const { email, password } = req.body || {};
    const utilizador = procurarPorEmail(email);

    if (!utilizador || !verificarPalavraPasse(String(password || ""), utilizador)) {
      return res.status(401).json({ error: "E-mail ou palavra-passe incorretos." });
    }

    return res.json({ ...utilizadorPublico(utilizador), access_token: criarToken(utilizador) });
  })
);

app.get(
  "/api/auth/me",
  exigirSessao,
  envolver((req, res) => {
    res.json(utilizadorPublico(req.utilizador));
  })
);

app.post("/api/auth/logout", (_req, res) => {
  // O JWT é sem estado: o cliente descarta o token.
  res.json({ ok: true });
});

app.post("/api/auth/password-reset", (_req, res) => {
  res.status(501).json({
    error: "O envio de e-mail ainda não está configurado. Contacte contacto@retratu.pt.",
  });
});

// --------------------------------------------------------------- entidades ---
const entidades = express.Router();

entidades.param("entidade", (req, res, next, valor) => {
  const chave = ENTIDADES[valor];
  if (!chave) return res.status(404).json({ error: "Entidade desconhecida." });
  req.chave = chave;
  return next();
});

entidades.post(
  "/:entidade/query",
  envolver((req, res) => {
    const { filtro = {}, sort, limit } = req.body || {};
    const publica = LEITURA_PUBLICA.has(req.chave);
    const utilizador = utilizadorDoPedido(req);

    if (!publica && !utilizador) {
      return res.status(401).json({ error: "Sessão necessária." });
    }

    // Quem não é admin só vê os próprios registos, mesmo pedindo outro filtro.
    const filtroFinal =
      !publica && utilizador.role !== "admin"
        ? { ...filtro, created_by_id: utilizador.id }
        : filtro;

    return res.json({ items: listar(req.chave, { filtro: filtroFinal, sort, limit }) });
  })
);

entidades.post(
  "/:entidade/count",
  envolver((req, res) => {
    const utilizador = utilizadorDoPedido(req);
    if (!LEITURA_PUBLICA.has(req.chave) && !utilizador) {
      return res.status(401).json({ error: "Sessão necessária." });
    }
    if (!LEITURA_PUBLICA.has(req.chave) && utilizador.role !== "admin") {
      return res.status(403).json({ error: "Acesso restrito a administradores." });
    }
    return res.json({ total: contar(req.chave, req.body?.filtro || {}) });
  })
);

entidades.post(
  "/:entidade/aggregate",
  envolver((req, res) => {
    const utilizador = utilizadorDoPedido(req);
    if (!LEITURA_PUBLICA.has(req.chave) && !utilizador) {
      return res.status(401).json({ error: "Sessão necessária." });
    }
    if (!LEITURA_PUBLICA.has(req.chave) && utilizador.role !== "admin") {
      return res.status(403).json({ error: "Acesso restrito a administradores." });
    }
    return res.json({ rows: agregar(req.chave, req.body || {}) });
  })
);

entidades.post(
  "/:entidade",
  envolver((req, res) => {
    const utilizador = utilizadorDoPedido(req);

    if (!ESCRITA_PUBLICA.has(req.chave)) {
      if (!utilizador) return res.status(401).json({ error: "Sessão necessária." });
      if (utilizador.role !== "admin") {
        return res.status(403).json({ error: "Acesso restrito a administradores." });
      }
    }

    return res.status(201).json(criar(req.chave, req.body || {}, utilizador?.id));
  })
);

entidades.post(
  "/:entidade/bulk",
  exigirSessao,
  exigirAdmin,
  envolver((req, res) => {
    res.status(201).json(criarMuitos(req.chave, req.body?.items || [], req.utilizador.id));
  })
);

entidades.post(
  "/:entidade/bulk-update",
  exigirSessao,
  exigirAdmin,
  envolver((req, res) => {
    res.json(atualizarMuitos(req.chave, req.body?.items || []));
  })
);

entidades.get(
  "/:entidade/:id",
  envolver((req, res) => {
    const registo = obter(req.chave, req.params.id);
    if (!registo) return res.status(404).json({ error: "Registo não encontrado." });

    const publica = LEITURA_PUBLICA.has(req.chave);
    if (!publica) {
      const utilizador = utilizadorDoPedido(req);
      if (!utilizador) return res.status(401).json({ error: "Sessão necessária." });
      if (utilizador.role !== "admin" && registo.created_by_id !== utilizador.id) {
        return res.status(403).json({ error: "Sem acesso a este registo." });
      }
    }

    return res.json(registo);
  })
);

entidades.patch(
  "/:entidade/:id",
  exigirSessao,
  exigirAdmin,
  envolver((req, res) => {
    res.json(atualizar(req.chave, req.params.id, req.body || {}));
  })
);

entidades.delete(
  "/:entidade/:id",
  exigirSessao,
  exigirAdmin,
  envolver((req, res) => {
    res.json({ ok: apagar(req.chave, req.params.id) });
  })
);

app.use("/api/entities", entidades);

// ---------------------------------------------------------------- ficheiros ---
const carregamento = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, PASTA_UPLOADS),
    filename: (_req, file, cb) => {
      const extensao = (file.originalname.match(/\.[a-zA-Z0-9]+$/) || [""])[0].toLowerCase();
      cb(null, `${randomBytes(16).toString("hex")}${extensao}`);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    const aceites = ["image/jpeg", "image/png", "image/webp"];
    cb(null, aceites.includes(file.mimetype));
  },
});

app.post("/api/files", carregamento.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Ficheiro inválido ou demasiado grande." });

  const id = randomBytes(16).toString("hex");
  db.prepare(
    "INSERT INTO ficheiros (id, nome, mime, tamanho, caminho, created_date) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(
    id,
    req.file.originalname,
    req.file.mimetype,
    req.file.size,
    req.file.filename,
    new Date().toISOString()
  );

  return res.status(201).json({ file_uri: `/api/files/${id}` });
});

app.get("/api/files/:id", exigirSessao, (req, res) => {
  const ficheiro = db.prepare("SELECT * FROM ficheiros WHERE id = ?").get(req.params.id);
  if (!ficheiro) return res.status(404).json({ error: "Ficheiro não encontrado." });
  return res.type(ficheiro.mime).sendFile(join(PASTA_UPLOADS, ficheiro.caminho));
});

// ------------------------------------------------------- frontend estático ---
// Em produção o mesmo processo serve o build do Vite.
const pastaDist = join(aqui, "..", "dist");
if (existsSync(pastaDist)) {
  app.use(express.static(pastaDist));
  app.use((req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    return res.sendFile(join(pastaDist, "index.html"));
  });
}

app.use((_req, res) => res.status(404).json({ error: "Rota não encontrada." }));

const porta = Number(process.env.PORT) || 3001;
app.listen(porta, () => {
  console.log(`Retratu API em http://localhost:${porta}`);
});
