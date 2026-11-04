// Base de dados SQLite do Retratu.
//
// Modelo: uma tabela `registos` que guarda cada entidade como documento JSON.
// Evita migrações a cada campo novo e mantém o contrato que o frontend já usa.
// Utilizadores e ficheiros têm tabelas próprias por precisarem de índices e
// de dados que nunca devem sair como JSON livre.

import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { PACOTES_PADRAO } from "../src/lib/pacotes.js";

const aqui = dirname(fileURLToPath(import.meta.url));
export const PASTA_DADOS = join(aqui, "..", "data");
export const PASTA_UPLOADS = join(PASTA_DADOS, "uploads");

mkdirSync(PASTA_UPLOADS, { recursive: true });

export const db = new Database(join(PASTA_DADOS, "retratu.db"));
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS registos (
    id TEXT PRIMARY KEY,
    entidade TEXT NOT NULL,
    dados TEXT NOT NULL,
    created_date TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_registos_entidade ON registos(entidade);

  CREATE TABLE IF NOT EXISTS utilizadores (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'user',
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    created_date TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS ficheiros (
    id TEXT PRIMARY KEY,
    nome TEXT,
    mime TEXT,
    tamanho INTEGER,
    caminho TEXT NOT NULL,
    created_date TEXT NOT NULL
  );
`);

/** Semeia os pacotes a partir de `src/lib/pacotes.js` na primeira execução. */
function semearPacotes() {
  const existentes = db
    .prepare("SELECT COUNT(*) AS total FROM registos WHERE entidade = ?")
    .get("pacotes");

  if (existentes.total > 0) return;

  const inserir = db.prepare(
    "INSERT INTO registos (id, entidade, dados, created_date) VALUES (?, ?, ?, ?)"
  );
  const agora = new Date().toISOString();

  const transacao = db.transaction(() => {
    for (const pacote of PACOTES_PADRAO) {
      const { id, ...resto } = pacote;
      inserir.run(id, "pacotes", JSON.stringify(resto), agora);
    }
  });

  transacao();
}

semearPacotes();

export default db;
