export const IVA_TAXA = 23;

export const formatEUR = (valor) =>
  new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(
    Number(valor) || 0
  );

/** Opções adicionais mostradas no painel de checkout (slide-over). */
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

export const descreverOpcao = (id) =>
  TODAS_AS_OPCOES.find((o) => o.id === id)?.nome ?? id;

export const precoOpcao = (id) => TODAS_AS_OPCOES.find((o) => o.id === id)?.preco ?? 0;

export const calcularExtras = (opcaoIds = []) =>
  opcaoIds.reduce((soma, id) => soma + precoOpcao(id), 0);

export const roundEUR = (valor) => Math.round(valor * 100) / 100;