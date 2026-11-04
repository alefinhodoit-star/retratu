// Autenticação do servidor: PBKDF2-SHA256 + JWT.
//
// O segredo do JWT vem de `JWT_SECRET` ou, na sua ausência, de um ficheiro
// gerado em `data/.jwt-secret` — assim os tokens sobrevivem a reinícios sem
// obrigar a configurar nada.

import { randomBytes, pbkdf2Sync, timingSafeEqual } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import jwt from "jsonwebtoken";

import { db, PASTA_DADOS } from "./db.js";

const ITERACOES = 120000;
const TAMANHO_CHAVE = 32;
const VALIDADE = "30d";

function obterSegredo() {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;

  const caminho = join(PASTA_DADOS, ".jwt-secret");
  if (existsSync(caminho)) return readFileSync(caminho, "utf8").trim();

  const segredo = randomBytes(48).toString("hex");
  writeFileSync(caminho, segredo, { mode: 0o600 });
  return segredo;
}

const SEGREDO = obterSegredo();

export const normalizarEmail = (email) => String(email || "").trim().toLowerCase();

export function derivarHash(palavraPasse, saltHex) {
  return pbkdf2Sync(palavraPasse, Buffer.from(saltHex, "hex"), ITERACOES, TAMANHO_CHAVE, "sha256").toString(
    "hex"
  );
}

export function verificarPalavraPasse(palavraPasse, utilizador) {
  const esperado = Buffer.from(utilizador.password_hash, "hex");
  const obtido = Buffer.from(derivarHash(palavraPasse, utilizador.salt), "hex");
  if (esperado.length !== obtido.length) return false;
  return timingSafeEqual(esperado, obtido);
}

export const utilizadorPublico = (utilizador) =>
  utilizador
    ? {
        id: utilizador.id,
        email: utilizador.email,
        full_name: utilizador.full_name,
        role: utilizador.role,
        created_date: utilizador.created_date,
      }
    : null;

export function criarToken(utilizador) {
  return jwt.sign(
    { sub: utilizador.id, email: utilizador.email, role: utilizador.role },
    SEGREDO,
    { expiresIn: VALIDADE }
  );
}

export function lerToken(token) {
  try {
    return jwt.verify(token, SEGREDO);
  } catch {
    return null;
  }
}

/** Middleware: exige `Authorization: Bearer <token>` válido. */
export function exigirSessao(req, res, next) {
  const cabecalho = req.headers.authorization || "";
  const token = cabecalho.startsWith("Bearer ") ? cabecalho.slice(7) : "";
  const carga = token ? lerToken(token) : null;

  if (!carga) return res.status(401).json({ error: "Sessão inválida ou expirada." });

  const utilizador = db.prepare("SELECT * FROM utilizadores WHERE id = ?").get(carga.sub);
  if (!utilizador) return res.status(401).json({ error: "Sessão inválida." });

  req.utilizador = utilizador;
  next();
}

/** Middleware: exige perfil `admin`. */
export function exigirAdmin(req, res, next) {
  if (req.utilizador?.role !== "admin") {
    return res.status(403).json({ error: "Acesso restrito a administradores." });
  }
  next();
}

/** Cria o utilizador. O primeiro registo da instância fica como admin. */
export function criarUtilizador({ email, palavraPasse, nome }) {
  const alvo = normalizarEmail(email);
  const total = db.prepare("SELECT COUNT(*) AS total FROM utilizadores").get().total;
  const salt = randomBytes(16).toString("hex");

  const utilizador = {
    id: randomBytes(16).toString("hex"),
    email: alvo,
    full_name: nome || alvo.split("@")[0],
    role: total === 0 ? "admin" : "user",
    password_hash: derivarHash(palavraPasse, salt),
    salt,
    created_date: new Date().toISOString(),
  };

  db.prepare(
    `INSERT INTO utilizadores (id, email, full_name, role, password_hash, salt, created_date)
     VALUES (@id, @email, @full_name, @role, @password_hash, @salt, @created_date)`
  ).run(utilizador);

  return utilizador;
}

export function procurarPorEmail(email) {
  return db.prepare("SELECT * FROM utilizadores WHERE email = ?").get(normalizarEmail(email));
}
