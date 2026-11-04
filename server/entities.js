// CRUD genérico sobre a tabela `registos`.
//
// Cada entidade é um documento JSON. Os filtros, a ordenação e o agrupamento
// são traduzidos para `json_extract`, com validação estrita dos nomes de campo
// para nunca interpolar texto vindo do cliente no SQL.

import { randomBytes } from "node:crypto";

import { db } from "./db.js";

/** Nome público (frontend) → chave interna. */
export const ENTIDADES = {
  Package: "pacotes",
  BlogPost: "blog",
  CategoriaLoja: "loja:categorias",
  ProdutoLoja: "loja:produtos",
  Order: "pedidos",
  Lead: "leads",
  PedidoEdicao: "pedidos-edicao",
};

const CAMPO_VALIDO = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

function campo(nome) {
  if (!CAMPO_VALIDO.test(String(nome))) {
    throw Object.assign(new Error(`Campo inválido: ${nome}`), { status: 400 });
  }
  return nome;
}

const paraRegisto = (linha) => ({ id: linha.id, ...JSON.parse(linha.dados) });

function construirFiltro(filtro) {
  const partes = [];
  const valores = [];

  for (const [nome, valor] of Object.entries(filtro || {})) {
    partes.push(`json_extract(dados, '$.${campo(nome)}') = ?`);
    valores.push(typeof valor === "boolean" ? (valor ? 1 : 0) : valor);
  }

  return {
    sql: partes.length ? ` AND ${partes.join(" AND ")}` : "",
    valores,
  };
}

function construirOrdem(sort) {
  if (!sort) return "";
  const descendente = String(sort).startsWith("-");
  const nome = descendente ? String(sort).slice(1) : String(sort);
  return ` ORDER BY json_extract(dados, '$.${campo(nome)}') ${descendente ? "DESC" : "ASC"}`;
}

export function listar(chave, { filtro, sort, limit } = {}) {
  const { sql, valores } = construirFiltro(filtro);
  const limite = Math.min(Number(limit) || 1000, 5000);

  const linhas = db
    .prepare(
      `SELECT id, dados FROM registos WHERE entidade = ?${sql}${construirOrdem(sort)} LIMIT ?`
    )
    .all(chave, ...valores, limite);

  return linhas.map(paraRegisto);
}

export function contar(chave, filtro = {}) {
  const { sql, valores } = construirFiltro(filtro);
  return db
    .prepare(`SELECT COUNT(*) AS total FROM registos WHERE entidade = ?${sql}`)
    .get(chave, ...valores).total;
}

export function agregar(chave, { filtro, groupBy, sum = [] } = {}) {
  const campoGrupo = campo(groupBy);
  const { sql, valores } = construirFiltro(filtro);

  const somas = (sum || [])
    .map((nome) => `, SUM(json_extract(dados, '$.${campo(nome)}')) AS ${campo(nome)}`)
    .join("");

  const linhas = db
    .prepare(
      `SELECT json_extract(dados, '$.${campoGrupo}') AS grupo, COUNT(*) AS count${somas}
       FROM registos WHERE entidade = ?${sql}
       GROUP BY grupo`
    )
    .all(chave, ...valores);

  return linhas.map(({ grupo, ...resto }) => ({ [campoGrupo]: grupo, ...resto }));
}

export function obter(chave, id) {
  const linha = db
    .prepare("SELECT id, dados FROM registos WHERE entidade = ? AND id = ?")
    .get(chave, id);
  return linha ? paraRegisto(linha) : null;
}

export function criar(chave, dados, autorId) {
  const id = randomBytes(16).toString("hex");
  const agora = new Date().toISOString();
  const registo = { ...dados };
  delete registo.id;

  if (autorId && registo.created_by_id === undefined) {
    registo.created_by_id = autorId;
  }

  db.prepare("INSERT INTO registos (id, entidade, dados, created_date) VALUES (?, ?, ?, ?)").run(
    id,
    chave,
    JSON.stringify(registo),
    agora
  );

  return { id, ...registo, created_date: agora };
}

export function criarMuitos(chave, lista, autorId) {
  const inserir = db.prepare(
    "INSERT INTO registos (id, entidade, dados, created_date) VALUES (?, ?, ?, ?)"
  );
  const agora = new Date().toISOString();

  const transacao = db.transaction(() =>
    (lista || []).map((dados) => {
      const id = randomBytes(16).toString("hex");
      const registo = { ...dados };
      delete registo.id;
      if (autorId && registo.created_by_id === undefined) registo.created_by_id = autorId;
      inserir.run(id, chave, JSON.stringify(registo), agora);
      return { id, ...registo, created_date: agora };
    })
  );

  return transacao();
}

export function atualizar(chave, id, dados) {
  const atual = obter(chave, id);
  if (!atual) throw Object.assign(new Error("Registo não encontrado."), { status: 404 });

  const { id: _ignorado, created_date, ...resto } = atual;
  const atualizado = { ...resto, ...dados };
  delete atualizado.id;

  db.prepare("UPDATE registos SET dados = ? WHERE entidade = ? AND id = ?").run(
    JSON.stringify(atualizado),
    chave,
    id
  );

  return { id, ...atualizado, created_date };
}

export function atualizarMuitos(chave, alteracoes) {
  const transacao = db.transaction(() =>
    (alteracoes || []).map((alteracao) => {
      const { id, ...dados } = alteracao;
      try {
        return atualizar(chave, id, dados);
      } catch {
        return null;
      }
    })
  );

  return transacao().filter(Boolean);
}

export function apagar(chave, id) {
  db.prepare("DELETE FROM registos WHERE entidade = ? AND id = ?").run(chave, id);
  return true;
}

export function apagarMuitos(chave, filtro = {}) {
  const { sql, valores } = construirFiltro(filtro);
  const resultado = db
    .prepare(`DELETE FROM registos WHERE entidade = ?${sql}`)
    .run(chave, ...valores);
  return resultado.changes;
}
