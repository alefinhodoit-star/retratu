// Entidades locais. Cada "tabela" vive no localStorage sob o prefixo `retratu:`.
//
// A forma de cada entidade é a que o backend Node + SQLite irá devolver, para
// que os componentes não mudem quando a API entrar. Os pacotes são semeados a
// partir de `src/lib/pacotes.js` na primeira utilização e passam a ser dados
// editáveis — o mesmo que acontecerá no SQLite.

import { PACOTES_PADRAO } from "@/lib/pacotes";
import { gravarJSON, lerJSON, novoId } from "./storage";

function ordenar(itens, sort) {
  if (!sort) return itens;
  const descendente = sort.startsWith("-");
  const campo = descendente ? sort.slice(1) : sort;

  return [...itens].sort((a, b) => {
    const va = a?.[campo];
    const vb = b?.[campo];
    if (va === vb) return 0;
    if (va === undefined || va === null) return 1;
    if (vb === undefined || vb === null) return -1;
    const comparacao = va < vb ? -1 : 1;
    return descendente ? -comparacao : comparacao;
  });
}

function corresponde(item, filtro) {
  return Object.entries(filtro || {}).every(([campo, valor]) => item?.[campo] === valor);
}

function paginar(itens, opcoes) {
  const limite = Number(opcoes?.limit) || 1000;
  return { items: ordenar(itens, opcoes?.sort).slice(0, limite) };
}

/**
 * Tabela genérica sobre o localStorage.
 * @param {string} chave
 * @param {object[]} [semente] aplicada uma única vez, quando a tabela não existe
 */
function criarTabela(chave, semente) {
  if (semente && lerJSON(chave, null) === null) {
    gravarJSON(chave, semente);
  }

  return {
    async list(opcoes = {}) {
      return paginar(lerJSON(chave, []), opcoes);
    },

    async filter(filtro = {}, opcoes = {}) {
      const itens = lerJSON(chave, []).filter((item) => corresponde(item, filtro));
      return paginar(itens, opcoes);
    },

    async count(filtro = {}) {
      return lerJSON(chave, []).filter((item) => corresponde(item, filtro)).length;
    },

    /** Resumo agrupado: `{ rows: [{ [groupBy]: valor, count, ...somas }] }`. */
    async aggregate({ groupBy, sum = [] } = {}) {
      const itens = lerJSON(chave, []);
      const grupos = new Map();

      for (const item of itens) {
        const valorGrupo = item?.[groupBy] ?? "";
        const linha = grupos.get(valorGrupo) ?? { [groupBy]: valorGrupo, count: 0 };
        linha.count += 1;
        for (const campo of sum) {
          linha[campo] = (linha[campo] ?? 0) + (Number(item?.[campo]) || 0);
        }
        grupos.set(valorGrupo, linha);
      }

      return { rows: [...grupos.values()] };
    },

    async create(dados) {
      const itens = lerJSON(chave, []);
      const registo = {
        ...dados,
        id: novoId(),
        created_date: new Date().toISOString(),
      };
      itens.push(registo);
      if (!gravarJSON(chave, itens)) {
        throw new Error("Armazenamento local cheio. Liberte espaço neste navegador.");
      }
      return registo;
    },

    async bulkCreate(lista) {
      const itens = lerJSON(chave, []);
      const criados = (lista || []).map((dados) => ({
        ...dados,
        id: novoId(),
        created_date: new Date().toISOString(),
      }));
      if (!gravarJSON(chave, itens.concat(criados))) {
        throw new Error("Armazenamento local cheio. Liberte espaço neste navegador.");
      }
      return criados;
    },

    async update(id, dados) {
      const itens = lerJSON(chave, []);
      const indice = itens.findIndex((item) => item.id === id);
      if (indice === -1) throw new Error("Registo não encontrado.");
      itens[indice] = { ...itens[indice], ...dados, id };
      gravarJSON(chave, itens);
      return itens[indice];
    },

    async bulkUpdate(alteracoes) {
      const itens = lerJSON(chave, []);
      for (const alteracao of alteracoes || []) {
        const indice = itens.findIndex((item) => item.id === alteracao.id);
        if (indice !== -1) itens[indice] = { ...itens[indice], ...alteracao };
      }
      gravarJSON(chave, itens);
      return itens;
    },

    async delete(id) {
      const itens = lerJSON(chave, []).filter((item) => item.id !== id);
      gravarJSON(chave, itens);
      return true;
    },

    async get(id) {
      return lerJSON(chave, []).find((item) => item.id === id) ?? null;
    },
  };
}

export const entities = {
  Package: criarTabela("pacotes", PACOTES_PADRAO),
  BlogPost: criarTabela("blog"),
  CategoriaLoja: criarTabela("loja:categorias"),
  ProdutoLoja: criarTabela("loja:produtos"),
  Order: criarTabela("pedidos"),
  Lead: criarTabela("leads"),
  PedidoEdicao: criarTabela("pedidos-edicao"),
};

export default entities;
