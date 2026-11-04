// Armazenamento local da aplicação, sem backend.
//
// Duas camadas:
//   - localStorage: registos em JSON (utilizadores, pedidos, leads, catálogo)
//   - IndexedDB: ficheiros binários (imagens carregadas no fluxo de edição)
//
// Esta camada é temporária: quando o backend Node + SQLite entrar, só os
// módulos de `src/lib/api/local/` são substituídos por chamadas HTTP.

const PREFIXO = "retratu:";

/** Lê um valor JSON do localStorage. Nunca lança: devolve o valor por omissão. */
export function lerJSON(chave, padrao) {
  try {
    const bruto = window.localStorage.getItem(PREFIXO + chave);
    if (!bruto) return padrao;
    const valor = JSON.parse(bruto);
    return valor ?? padrao;
  } catch {
    return padrao;
  }
}

/** Grava um valor JSON. Devolve `false` quando o armazenamento está cheio ou bloqueado. */
export function gravarJSON(chave, valor) {
  try {
    window.localStorage.setItem(PREFIXO + chave, JSON.stringify(valor));
    return true;
  } catch {
    return false;
  }
}

export function removerChave(chave) {
  try {
    window.localStorage.removeItem(PREFIXO + chave);
  } catch {
    // sem armazenamento disponível — nada a fazer
  }
}

export function novoId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

// ------------------------------------------------------------------ IndexedDB

const BD_NOME = "retratu-ficheiros";
const BD_LOJA = "blobs";

function abrirBD() {
  return new Promise((resolve, reject) => {
    const pedido = window.indexedDB.open(BD_NOME, 1);
    pedido.onupgradeneeded = () => {
      const bd = pedido.result;
      if (!bd.objectStoreNames.contains(BD_LOJA)) bd.createObjectStore(BD_LOJA);
    };
    pedido.onsuccess = () => resolve(pedido.result);
    pedido.onerror = () => reject(pedido.error);
  });
}

export async function guardarBlob(id, blob) {
  const bd = await abrirBD();
  try {
    await new Promise((resolve, reject) => {
      const transacao = bd.transaction(BD_LOJA, "readwrite");
      transacao.objectStore(BD_LOJA).put(blob, id);
      transacao.oncomplete = () => resolve(undefined);
      transacao.onerror = () => reject(transacao.error);
    });
  } finally {
    bd.close();
  }
}

export async function obterBlob(id) {
  const bd = await abrirBD();
  try {
    return await new Promise((resolve, reject) => {
      const transacao = bd.transaction(BD_LOJA, "readonly");
      const pedido = transacao.objectStore(BD_LOJA).get(id);
      pedido.onsuccess = () => resolve(pedido.result ?? null);
      pedido.onerror = () => reject(pedido.error);
    });
  } finally {
    bd.close();
  }
}
