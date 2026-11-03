// @ts-check

export const IVA_TAXA = 23;

/**
 * Preços chegam de sítios heterogéneos (entidades Base44, carrinho guardado,
 * cálculo local), por isso aceita-se o valor em bruto e normaliza-se aqui.
 * @param {number | string | null | undefined} valor
 * @returns {string} valor formatado em euros (PT-PT)
 */
export const formatEUR = (valor) =>
  new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(
    Number(valor) || 0
  );

/**
 * @typedef {Object} OpcaoUpsell
 * @property {string} id
 * @property {string} nome
 * @property {number} preco preço final com IVA
 */

/**
 * @typedef {Object} GrupoUpsell
 * @property {string} id
 * @property {string} titulo
 * @property {string} descricao
 * @property {OpcaoUpsell[]} opcoes
 */

/** Opções adicionais mostradas no painel de checkout (slide-over). */
/** @type {GrupoUpsell[]} */
export const UPSELL_GRUPOS = [
  {
    id: "imagens",
    titulo: "Imagens Adicionais Extra",
    descricao: "Mais retratos finais aprovados, no mesmo estilo e qualidade.",
    opcoes: [
      { id: "imagens_4", nome: "+4 imagens finais", preco: 7.9 },
      { id: "imagens_10", nome: "+10 imagens finais", preco: 15.9 },
    ],
  },
  {
    id: "entrega",
    titulo: "Entrega Prioritária",
    descricao: "A sua galeria passa para a frente da fila de produção.",
    opcoes: [
      { id: "entrega_prioritaria", nome: "Prioritária — 6 horas", preco: 4.9 },
      { id: "entrega_expresso", nome: "Expresso — 90 minutos", preco: 7.9 },
    ],
  },
  {
    id: "revisao",
    titulo: "Revisão Humana Premium",
    descricao: "Um retocador profissional revê e afina cada imagem final.",
    opcoes: [
      { id: "revisao_simples", nome: "Revisão das imagens finais", preco: 6.9 },
      { id: "revisao_completa", nome: "Revisão + retoque de pele e fundo", preco: 14.9 },
    ],
  },
];

const TODAS_AS_OPCOES = UPSELL_GRUPOS.flatMap((g) => g.opcoes);

/**
 * @param {string} id
 * @returns {string} nome legível, ou o próprio id se a opção não existir
 */
export const descreverOpcao = (id) =>
  TODAS_AS_OPCOES.find((o) => o.id === id)?.nome ?? id;

/**
 * @param {string} id
 * @returns {number} preço da opção, ou 0 se o id não existir
 */
export const precoOpcao = (id) => TODAS_AS_OPCOES.find((o) => o.id === id)?.preco ?? 0;

/**
 * @param {string[]} [opcaoIds]
 * @returns {number} soma dos preços das opções indicadas
 */
export const calcularExtras = (opcaoIds = []) =>
  opcaoIds.reduce((soma, id) => soma + precoOpcao(id), 0);

/**
 * @param {number} valor
 * @returns {number} valor arredondado a cêntimos
 */
export const roundEUR = (valor) => Math.round(valor * 100) / 100;