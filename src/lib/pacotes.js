// @ts-check

/**
 * @typedef {Object} Pacote
 * @property {string} id
 * @property {string} nome
 * @property {string} slug
 * @property {number} preco preço final com IVA
 * @property {string} [tag]
 * @property {string} [descricao]
 * @property {string[]} inclui
 * @property {boolean} destaque
 * @property {number} ordem
 * @property {boolean} ativo
 */

/**
 * Catálogo padrão de pacotes de retratos profissionais.
 *
 * Serve de fallback quando a app Base44 ainda não tem pacotes criados (ou quando
 * o backend não está configurado). Assim que existirem pacotes ativos na base de
 * dados, esses passam a ser os apresentados no site — este ficheiro deixa de ser
 * usado. Os preços são finais ao consumidor, com IVA a 23% incluído.
 */
/** @type {Pacote[]} */
export const PACOTES_PADRAO = [
  {
    id: "padrao-essencial",
    nome: "Essencial",
    slug: "essencial",
    preco: 24.9,
    tag: "Para começar",
    descricao: "Para atualizar o LinkedIn e o currículo com uma imagem cuidada, sem complicações.",
    inclui: [
      "10 retratos finais em alta resolução",
      "2 fundos de estúdio à escolha",
      "1 conjunto de vestuário",
      "Entrega em até 24 horas",
      "Licença pessoal e comercial",
    ],
    destaque: false,
    ordem: 1,
    ativo: true,
  },
  {
    id: "padrao-profissional",
    nome: "Profissional",
    slug: "profissional",
    preco: 39.9,
    tag: "Mais popular",
    descricao: "Para quem usa a imagem profissional todos os dias — site, propostas e redes sociais.",
    inclui: [
      "25 retratos finais em alta resolução",
      "3 fundos de estúdio à escolha",
      "2 conjuntos de vestuário",
      "Entrega em até 12 horas",
      "Revisão de qualidade incluída",
      "Licença pessoal e comercial",
    ],
    destaque: true,
    ordem: 2,
    ativo: true,
  },
  {
    id: "padrao-executivo",
    nome: "Executivo",
    slug: "executivo",
    preco: 59.9,
    tag: "Gestão e vendas",
    descricao: "Presença forte em apresentações, propostas comerciais e página da empresa.",
    inclui: [
      "50 retratos finais em alta resolução",
      "4 fundos de estúdio à escolha",
      "3 conjuntos de vestuário",
      "Entrega em até 12 horas",
      "Revisão humana dedicada",
      "Formatos otimizados para LinkedIn e site",
    ],
    destaque: false,
    ordem: 3,
    ativo: true,
  },
  {
    id: "padrao-premium",
    nome: "Premium",
    slug: "premium",
    preco: 89.9,
    tag: "Máxima qualidade",
    descricao: "Para marca pessoal, imprensa e palco — com o cuidado de um retocador profissional.",
    inclui: [
      "100 retratos finais em alta resolução",
      "6 fundos de estúdio à escolha",
      "5 conjuntos de vestuário",
      "Entrega prioritária em 6 horas",
      "Revisão humana premium e retoque de pele",
      "Formatos para impressão e redes sociais",
    ],
    destaque: false,
    ordem: 4,
    ativo: true,
  },
  {
    id: "padrao-equipa",
    nome: "Equipa",
    slug: "equipa",
    preco: 149.9,
    tag: "Empresas",
    descricao: "Padronize a imagem de uma equipa inteira, sem tirar ninguém do trabalho.",
    inclui: [
      "Até 10 colaboradores incluídos",
      "Padronização de luz, fundo e vestuário",
      "Gestor de conta dedicado",
      "Fatura com IVA e condições de volume",
      "Entrega faseada combinada consigo",
      "Licença comercial para toda a empresa",
    ],
    destaque: false,
    ordem: 5,
    ativo: true,
  },
];
