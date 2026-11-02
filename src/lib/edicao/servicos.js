// Configuração única do assistente de edição: categorias, serviços e perguntas condicionais.

export const SERVICO_PERSONALIZADO = "personalizado";

export const OPCOES_COMUNS = {
  intensidade: [
    { valor: "subtil", label: "Subtil" },
    { valor: "moderada", label: "Moderada" },
    { valor: "intensa", label: "Intensa" },
  ],
  realismo: [
    { valor: "natural", label: "Natural" },
    { valor: "editorial", label: "Editorial" },
    { valor: "artistico", label: "Artístico" },
  ],
  formato: [
    { valor: "original", label: "Manter o original" },
    { valor: "quadrado", label: "Quadrado 1:1" },
    { valor: "vertical", label: "Vertical 4:5" },
    { valor: "horizontal", label: "Horizontal 16:9" },
    { valor: "personalizado", label: "Personalizado" },
  ],
  resolucao: [
    { valor: "original", label: "Manter a do ficheiro" },
    { valor: "2048", label: "2K · 2048 px" },
    { valor: "4096", label: "4K · 4096 px" },
  ],
  variacoes: [
    { valor: "1", label: "1 variação" },
    { valor: "2", label: "2 variações" },
    { valor: "4", label: "4 variações" },
  ],
  referenciaTipo: [
    { valor: "estilo", label: "Estilo" },
    { valor: "roupa", label: "Roupa" },
    { valor: "cenario", label: "Cenário" },
    { valor: "iluminacao", label: "Iluminação" },
    { valor: "pose", label: "Pose" },
    { valor: "composicao", label: "Composição" },
    { valor: "outra", label: "Outra" },
  ],
};

export const CATEGORIAS = [
  {
    id: "retratos",
    nome: "Retratos e beleza",
    icone: "Sparkles",
    servicos: [
      { slug: "retoque-facial", nome: "Retoque facial", descricao: "Correção global do rosto com resultado natural.", perfil: "retoque" },
      { slug: "remocao-acne", nome: "Remoção de acne", descricao: "Borbulhas, marcas e vermelhidão atenuadas.", perfil: "retoque" },
      { slug: "suavizacao-pele", nome: "Suavização da pele", descricao: "Pele uniforme sem perder textura.", perfil: "retoque" },
      { slug: "correcao-olheiras", nome: "Correção de olheiras", descricao: "Olhar descansado e luminoso.", perfil: "retoque" },
      { slug: "branqueamento-dentario", nome: "Branqueamento dentário", descricao: "Dentes mais claros e uniformes.", perfil: "retoque" },
      { slug: "maquilhagem-virtual", nome: "Maquilhagem virtual", descricao: "Maquilhagem discreta ou editorial.", perfil: "retoque" },
      { slug: "cabelo-penteado", nome: "Cabelo e penteado", descricao: "Novo corte, cor ou penteado.", perfil: "retoque" },
      { slug: "selfie-profissional", nome: "Foto profissional a partir de selfie", descricao: "Selfie transformada em retrato de estúdio.", perfil: "profissional" },
      { slug: "cv-linkedin", nome: "Foto para CV e LinkedIn", descricao: "Retrato pronto para candidaturas.", perfil: "profissional" },
      { slug: "retrato-corporativo", nome: "Retrato corporativo", descricao: "Imagem alinhada com a empresa.", perfil: "profissional" },
      { slug: "marca-pessoal", nome: "Fotografia de marca pessoal", descricao: "Retrato consistente para a sua marca.", perfil: "profissional" },
    ],
  },
  {
    id: "roupa",
    nome: "Roupa e aparência",
    icone: "Shirt",
    servicos: [
      { slug: "troca-roupa", nome: "Troca de roupa", descricao: "Substitui a roupa por outra à sua escolha.", perfil: "roupa" },
      { slug: "roupa-profissional", nome: "Roupa profissional", descricao: "Visual de trabalho credível.", perfil: "roupa" },
      { slug: "vestuario-formal", nome: "Vestuário formal", descricao: "Traje formal para ocasiões oficiais.", perfil: "roupa" },
      { slug: "vestidos-moda", nome: "Vestidos e moda", descricao: "Looks de moda e vestidos.", perfil: "roupa" },
      { slug: "cor-roupa", nome: "Alterar cor da roupa", descricao: "Nova cor na peça que está a usar.", perfil: "roupa" },
      { slug: "experimentar-estilos", nome: "Experimentar estilos", descricao: "Vários estilos na mesma pessoa.", perfil: "roupa" },
      { slug: "acessorios", nome: "Adicionar ou remover acessórios", descricao: "Óculos, joias, cintos ou chapéus.", perfil: "roupa" },
    ],
  },
  {
    id: "fundos",
    nome: "Fundos e cenários",
    icone: "ImageIcon",
    servicos: [
      { slug: "remocao-fundo", nome: "Remoção de fundo", descricao: "Fundo liso ou transparente.", perfil: "fundo" },
      { slug: "fundo-branco", nome: "Fundo branco de estúdio", descricao: "Base limpa para documentos e loja.", perfil: "fundo" },
      { slug: "fundo-profissional", nome: "Fundo profissional", descricao: "Fundo neutro para uso corporativo.", perfil: "fundo" },
      { slug: "escritorio-moderno", nome: "Escritório moderno", descricao: "Interior de escritório contemporâneo.", perfil: "fundo" },
      { slug: "praia-cidade-natureza", nome: "Praia, cidade ou natureza", descricao: "Cenário exterior à sua escolha.", perfil: "fundo" },
      { slug: "cenario-luxo", nome: "Cenário de luxo", descricao: "Ambiente sofisticado e premium.", perfil: "fundo" },
      { slug: "fundo-desfocado", nome: "Fundo desfocado", descricao: "Profundidade de campo suave.", perfil: "fundo" },
      { slug: "remocao-objetos", nome: "Remoção de objetos", descricao: "Retira elementos indesejados.", perfil: "fundo" },
      { slug: "expansao-enquadramento", nome: "Expansão do enquadramento", descricao: "Amplia a imagem mantendo o realismo.", perfil: "fundo" },
    ],
  },
  {
    id: "qualidade",
    nome: "Qualidade e restauro",
    icone: "Wand2",
    servicos: [
      { slug: "aumentar-resolucao", nome: "Aumento da resolução", descricao: "Mais píxeis sem perder detalhe.", perfil: "restauro" },
      { slug: "melhorar-nitidez", nome: "Melhorar a nitidez", descricao: "Contornos e detalhes mais definidos.", perfil: "restauro" },
      { slug: "reduzir-ruido", nome: "Redução de ruído", descricao: "Menos grão em fotos com pouca luz.", perfil: "restauro" },
      { slug: "recuperar-antigas", nome: "Recuperar fotos antigas", descricao: "Danos, riscos e desgaste atenuados.", perfil: "restauro" },
      { slug: "colorizar-pb", nome: "Colorização a preto e branco", descricao: "Cor realista em fotografias antigas.", perfil: "restauro" },
      { slug: "corrigir-desfocadas", nome: "Corrigir imagens desfocadas", descricao: "Reduz o desfoque de movimento.", perfil: "restauro" },
      { slug: "recuperar-detalhes", nome: "Recuperar detalhes", descricao: "Devolve detalhes perdidos.", perfil: "restauro" },
    ],
  },
  {
    id: "luz",
    nome: "Iluminação e cor",
    icone: "Sun",
    servicos: [
      { slug: "exposicao", nome: "Correção de exposição", descricao: "Fotos escuras ou estouradas corrigidas.", perfil: "luz" },
      { slug: "luz-estudio", nome: "Iluminação de estúdio", descricao: "Luz controlada de estúdio.", perfil: "luz" },
      { slug: "luz-natural", nome: "Luz natural", descricao: "Luz suave de janela.", perfil: "luz" },
      { slug: "hora-dourada", nome: "Hora dourada", descricao: "Tom quente de fim de tarde.", perfil: "luz" },
      { slug: "cinematografico", nome: "Estilo cinematográfico", descricao: "Contraste e cor de cinema.", perfil: "luz" },
      { slug: "correcao-cores", nome: "Correção de cores", descricao: "Balanço de brancos e saturação.", perfil: "luz" },
      { slug: "tons-quentes-frios", nome: "Tons quentes ou frios", descricao: "Ajuste de temperatura de cor.", perfil: "luz" },
    ],
  },
  {
    id: "corpo",
    nome: "Edição corporal e pose",
    icone: "PersonStanding",
    servicos: [
      { slug: "postura", nome: "Correção de postura", descricao: "Postura direita sem alterar o corpo.", perfil: "corpo" },
      { slug: "enquadramento-corporal", nome: "Ajuste do enquadramento", descricao: "Corpo ajustado ao enquadramento.", perfil: "corpo" },
      { slug: "alterar-pose", nome: "Alteração de pose", descricao: "Nova pose mantendo a identidade.", perfil: "corpo" },
      { slug: "maos-dedos", nome: "Correção de mãos e dedos", descricao: "Mãos e dedos naturais.", perfil: "corpo" },
      { slug: "corpo-inteiro", nome: "Expansão para corpo inteiro", descricao: "Do meio corpo ao corpo inteiro.", perfil: "corpo" },
      { slug: "silhueta", nome: "Ajustes subtis de silhueta", descricao: "Silhueta equilibrada e discreta.", perfil: "corpo" },
    ],
  },
  {
    id: "artistico",
    nome: "Estilos artísticos",
    icone: "Palette",
    servicos: [
      { slug: "anime", nome: "Anime", descricao: "Retrato em estilo anime.", perfil: "artistico" },
      { slug: "cartoon", nome: "Cartoon", descricao: "Ilustração tipo cartoon.", perfil: "artistico" },
      { slug: "pintura-digital", nome: "Pintura digital", descricao: "Pintura digital com pinceladas.", perfil: "artistico" },
      { slug: "cyberpunk", nome: "Cyberpunk", descricao: "Estética futurista e neon.", perfil: "artistico" },
      { slug: "fantasia", nome: "Fantasia", descricao: "Personagem de fantasia.", perfil: "artistico" },
      { slug: "retrato-editorial", nome: "Retrato editorial", descricao: "Retrato com tratamento de revista.", perfil: "artistico" },
      { slug: "foto-cinematografica", nome: "Fotografia cinematográfica", descricao: "Luz e cor de cinema.", perfil: "artistico" },
      { slug: "estilo-personalizado", nome: "Estilo artístico personalizado", descricao: "Estilo descrito por si.", perfil: "artistico" },
    ],
  },
  {
    id: "produtos",
    nome: "Produtos e publicidade",
    icone: "Package",
    servicos: [
      { slug: "produto-fundo", nome: "Remoção de fundo de produto", descricao: "Produto isolado e limpo.", perfil: "produto" },
      { slug: "foto-loja-online", nome: "Fotografia para loja online", descricao: "Imagem pronta para e-commerce.", perfil: "produto" },
      { slug: "fundos-comerciais", nome: "Fundos comerciais", descricao: "Cenários para catálogo.", perfil: "produto" },
      { slug: "foto-publicitaria", nome: "Fotografia publicitária", descricao: "Imagem de campanha.", perfil: "produto" },
      { slug: "catalogo", nome: "Melhoria de catálogo", descricao: "Fotos de catálogo padronizadas.", perfil: "produto" },
      { slug: "imagens-anuncios", nome: "Imagens para anúncios", descricao: "Criativos para anúncios pagos.", perfil: "produto" },
      { slug: "produto-em-uso", nome: "Produto em utilização", descricao: "Simula o produto a ser usado.", perfil: "produto" },
    ],
  },
  {
    id: "social",
    nome: "Redes sociais e marketing",
    icone: "Megaphone",
    servicos: [
      { slug: "instagram", nome: "Fotografia para Instagram", descricao: "Imagem pensada para o feed.", perfil: "social" },
      { slug: "tiktok", nome: "Fotografia para TikTok", descricao: "Composição vertical.", perfil: "social" },
      { slug: "linkedin-social", nome: "Fotografia para LinkedIn", descricao: "Conteúdo para publicações.", perfil: "social" },
      { slug: "imagem-perfil", nome: "Imagem de perfil", descricao: "Avatar legível em tamanho pequeno.", perfil: "social" },
      { slug: "marca-pessoal-social", nome: "Marca pessoal nas redes", descricao: "Imagem consistente nas redes.", perfil: "social" },
      { slug: "criativos-publicitarios", nome: "Criativos publicitários", descricao: "Peças para campanhas pagas.", perfil: "social" },
      { slug: "miniaturas-video", nome: "Miniaturas para vídeos", descricao: "Miniaturas com boa leitura.", perfil: "social" },
      { slug: "paginas-vendas", nome: "Imagens para páginas de vendas", descricao: "Imagens para páginas de venda.", perfil: "social" },
    ],
  },
];

const OPC = (valores) => valores.map((v) => ({ valor: v, label: v }));

export const PERFIS = {
  retoque: {
    titulo: "Detalhes do retoque",
    instrucoes:
      "Recomendamos uma fotografia nítida, com o rosto visível de frente e iluminação uniforme. Evite filtros pesados na foto de origem.",
    campos: [
      { id: "elementos", label: "Que elementos pretende corrigir?", tipo: "opcoes", multiplo: true, obrigatorio: true, opcoes: OPC(["Acne e borbulhas", "Manchas e vermelhidão", "Olheiras", "Linhas de expressão", "Brilho da pele", "Dentes", "Cabelo", "Sobrancelhas"]) },
      { id: "textura", label: "Pretende preservar completamente a textura natural da pele?", tipo: "sim_nao", obrigatorio: true },
      { id: "resultado", label: "Deseja um resultado natural ou de beleza editorial?", tipo: "opcoes", obrigatorio: true, opcoes: OPC(["Natural", "Beleza editorial"]) },
      { id: "nao_alterar", label: "Existem elementos do rosto que não devem ser alterados?", tipo: "texto_longo", placeholder: "Ex.: manter a forma do nariz e as sardas." },
    ],
  },
  profissional: {
    titulo: "Detalhes do retrato",
    instrucoes:
      "Envie uma selfie nítida, com o rosto bem iluminado e sem óculos escuros. Uma fotografia de origem recente melhora a semelhança do resultado.",
    campos: [
      { id: "finalidade", label: "Qual é a finalidade?", tipo: "opcoes", obrigatorio: true, opcoes: OPC(["CV", "LinkedIn", "Empresa", "Redes sociais", "Uso pessoal"]) },
      { id: "vestuario", label: "Qual é o vestuário pretendido?", tipo: "opcoes", opcoes: OPC(["Fato", "Camisa ou blusa", "Business casual", "Casual", "Bata ou uniforme", "Definir com a equipa"]) },
      { id: "fundo", label: "Que tipo de fundo prefere?", tipo: "opcoes", opcoes: OPC(["Estúdio neutro", "Escritório moderno", "Fundo branco", "Exterior urbano", "Cor da marca"]) },
      { id: "enquadramento", label: "Qual é o enquadramento?", tipo: "opcoes", obrigatorio: true, opcoes: OPC(["Rosto", "Meio corpo", "Corpo inteiro"]) },
      { id: "estilo", label: "Qual é o estilo?", tipo: "opcoes", obrigatorio: true, opcoes: OPC(["Corporativo", "Executivo", "Criativo", "Casual"]) },
    ],
  },
  roupa: {
    titulo: "Detalhes da roupa",
    instrucoes:
      "Uma fotografia de corpo inteiro ou meio corpo, com a roupa atual bem visível, permite substituições mais realistas.",
    campos: [
      { id: "tipo_roupa", label: "Qual é o tipo de roupa?", tipo: "opcoes", opcoes: OPC(["Fato completo", "Camisa e blazer", "Vestido", "Camisola", "Casaco", "Outro"]) },
      { id: "cor_roupa", label: "Qual é a cor pretendida?", tipo: "texto", obrigatorio: true, placeholder: "Ex.: azul-marinho" },
      { id: "estilo_roupa", label: "Qual é o estilo?", tipo: "opcoes", obrigatorio: true, opcoes: OPC(["Casual", "Formal", "Profissional", "Elegante", "Desportivo"]) },
      { id: "manter_pose", label: "Pretende manter a pose e o fundo originais?", tipo: "sim_nao", obrigatorio: true },
    ],
  },
  fundo: {
    titulo: "Detalhes do fundo",
    instrucoes:
      "Fotografe a pessoa com o contorno bem definido e sem elementos a tapar o corpo. Fundos simples tornam a substituição mais limpa.",
    campos: [
      { id: "cenario", label: "Qual é o cenário pretendido?", tipo: "opcoes", obrigatorio: true, opcoes: OPC(["Escritório moderno", "Estúdio neutro", "Cidade", "Praia", "Natureza", "Interior de luxo", "Fundo abstrato"]) },
      { id: "cor_dominante", label: "Qual é a cor dominante?", tipo: "texto", placeholder: "Ex.: bege areia" },
      { id: "tipo_fundo", label: "Prefere um fundo realista, minimalista ou artístico?", tipo: "opcoes", obrigatorio: true, opcoes: OPC(["Realista", "Minimalista", "Artístico"]) },
      { id: "preservar_pessoa", label: "Pretende preservar integralmente a pessoa original?", tipo: "sim_nao", obrigatorio: true },
    ],
  },
  restauro: {
    titulo: "Detalhes do restauro",
    instrucoes:
      "Carregue a melhor versão existente da fotografia, mesmo que esteja danificada. A digitalização com a maior resolução possível ajuda a recuperar detalhe.",
    campos: [
      { id: "problema", label: "Qual é o problema principal da imagem?", tipo: "opcoes", multiplo: true, obrigatorio: true, opcoes: OPC(["Baixa resolução", "Desfoque", "Ruído ou grão", "Cores desvanecidas", "Danos e riscos", "Rosto pouco definido"]) },
      { id: "recuperar_cores", label: "Pretende recuperar as cores originais?", tipo: "sim_nao", obrigatorio: true },
      { id: "preservar_historico", label: "Deseja preservar o aspeto histórico da fotografia?", tipo: "sim_nao", obrigatorio: true },
      { id: "utilizacao", label: "Qual é a utilização final?", tipo: "opcoes", obrigatorio: true, opcoes: OPC(["Digital", "Redes sociais", "Impressão"]) },
    ],
  },
  luz: {
    titulo: "Detalhes da iluminação",
    instrucoes:
      "Envie a fotografia no formato original, sem compressão adicional. Se a imagem estiver muito escura, envie também uma segunda versão mais clara como referência.",
    campos: [
      { id: "estilo_luz", label: "Qual é o estilo de iluminação?", tipo: "opcoes", obrigatorio: true, opcoes: OPC(["Estúdio", "Natural", "Hora dourada", "Cinematográfica", "Comercial", "Suave"]) },
      { id: "temperatura", label: "Qual é a temperatura de cor desejada?", tipo: "opcoes", opcoes: OPC(["Quente", "Neutra", "Fria"]) },
      { id: "resultado_luz", label: "Prefere um resultado natural, comercial ou cinematográfico?", tipo: "opcoes", obrigatorio: true, opcoes: OPC(["Natural", "Comercial", "Cinematográfico"]) },
    ],
  },
  corpo: {
    titulo: "Detalhes da pose",
    instrucoes:
      "Uma fotografia com o corpo inteiro visível permite ajustes de pose e enquadramento mais fiéis. Evite roupa demasiado solta.",
    campos: [
      { id: "alteracao", label: "Que alteração pretende realizar?", tipo: "opcoes", multiplo: true, obrigatorio: true, opcoes: OPC(["Postura", "Enquadramento corporal", "Pose", "Mãos e dedos", "Silhueta", "Corpo inteiro"]) },
      { id: "enquadramento_corpo", label: "Qual é o enquadramento desejado?", tipo: "opcoes", opcoes: OPC(["Rosto", "Meio corpo", "Corpo inteiro"]) },
      { id: "manter_inalterado", label: "Que elementos devem permanecer inalterados?", tipo: "texto_longo", placeholder: "Ex.: manter a expressão e o rosto exatamente iguais." },
    ],
  },
  artistico: {
    titulo: "Detalhes do estilo",
    instrucoes:
      "Use uma fotografia com o rosto bem visível. Quanto mais claro for o rosto na origem, mais fiel será a transformação artística.",
    campos: [
      { id: "estilo_artistico", label: "Qual é o estilo artístico?", tipo: "opcoes", obrigatorio: true, opcoes: OPC(["Anime", "Cartoon", "Pintura digital", "Cyberpunk", "Fantasia", "Editorial", "Cinematográfico", "Personalizado"]) },
      { id: "nivel_transformacao", label: "Qual é o nível de transformação?", tipo: "opcoes", obrigatorio: true, opcoes: OPC(["Ligeira", "Moderada", "Total"]) },
      { id: "preservar_identidade", label: "Pretende preservar a identidade e os traços reconhecíveis da pessoa?", tipo: "sim_nao", obrigatorio: true },
    ],
  },
  produto: {
    titulo: "Detalhes do produto",
    instrucoes:
      "Fotografe o produto com boa luz e o mais nítido possível. Uma imagem limpa facilita a criação de fundos e cenários comerciais.",
    campos: [
      { id: "tipo_produto", label: "Qual é o tipo de produto?", tipo: "texto", obrigatorio: true, placeholder: "Ex.: garrafa de vinho, sapatilhas" },
      { id: "onde_utilizar", label: "Onde será utilizado?", tipo: "opcoes", multiplo: true, obrigatorio: true, opcoes: OPC(["Loja online", "Catálogo", "Anúncio", "Redes sociais"]) },
      { id: "cenario_comercial", label: "Qual é o cenário comercial pretendido?", tipo: "opcoes", opcoes: OPC(["Fundo branco", "Superfície neutra", "Cenário lifestyle", "Ambiente de marca", "Exterior"]) },
      { id: "preservar_detalhes", label: "Que cores, logótipos, textos ou detalhes devem ser preservados?", tipo: "texto_longo", placeholder: "Ex.: manter o rótulo e as cores exatas da embalagem." },
    ],
  },
  social: {
    titulo: "Detalhes de marketing",
    instrucoes:
      "Envie uma imagem nítida e com espaço em volta do sujeito. Isso permite recortes verticais e quadrados sem perder o enquadramento.",
    campos: [
      { id: "plataforma", label: "Qual é a plataforma de destino?", tipo: "opcoes", multiplo: true, obrigatorio: true, opcoes: OPC(["Instagram", "TikTok", "LinkedIn", "Facebook", "Site"]) },
      { id: "publico", label: "Qual é o público-alvo?", tipo: "texto", placeholder: "Ex.: decisores de RH em PME" },
      { id: "identidade_marca", label: "Qual é a identidade visual da marca?", tipo: "texto_longo", placeholder: "Cores, tom, referências visuais." },
      { id: "espaco_texto", label: "Pretende espaço para texto publicitário?", tipo: "sim_nao", obrigatorio: true },
    ],
  },
};

export const SERVICOS = CATEGORIAS.flatMap((categoria) =>
  categoria.servicos.map((servico) => ({ ...servico, categoria: categoria.nome, categoriaId: categoria.id }))
);

export function obterServico(slug) {
  if (!slug) return null;
  if (slug === SERVICO_PERSONALIZADO) {
    return {
      slug,
      nome: "Edição personalizada",
      descricao: "Descreva o resultado que procura.",
      perfil: null,
      categoria: "Personalizado",
      requerOriginal: false,
    };
  }
  const encontrado = SERVICOS.find((s) => s.slug === slug);
  return encontrado ? { ...encontrado, requerOriginal: true } : null;
}

export function camposDoServico(slug) {
  const servico = obterServico(slug);
  if (!servico?.perfil) return [];
  return PERFIS[servico.perfil]?.campos ?? [];
}

export function instrucoesDoServico(slug) {
  const servico = obterServico(slug);
  return PERFIS[servico?.perfil]?.instrucoes ?? "Envie a imagem que pretende editar, no formato original e com a melhor qualidade disponível.";
}

export function rotuloOpcao(opcoes, valor) {
  if (Array.isArray(valor)) return valor.map((v) => rotuloOpcao(opcoes, v)).join(", ");
  if (!valor) return "";
  return opcoes.find((o) => o.valor === valor)?.label ?? valor;
}