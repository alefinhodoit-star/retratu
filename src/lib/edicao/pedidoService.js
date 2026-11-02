import { db } from "@/api/base44Client";

// Camada isolada de submissão de pedidos de edição: validação de ficheiros,
// carregamento seguro e criação do pedido no backend.

import { camposDoServico, obterServico, OPCOES_COMUNS, rotuloOpcao } from "./servicos";

export const TIPOS_ACEITES = ["image/jpeg", "image/png", "image/webp"];
export const TAMANHO_MAX = 10 * 1024 * 1024;
export const DIMENSAO_MIN = 400;
export const DIMENSAO_MAX = 10000;

const CHAVE_INTERVALO = "retratu:edicao:ultimoPedido";
const INTERVALO_MINIMO_MS = 30000;

export function formatarTamanho(bytes) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} MB`;
}

async function confirmarAssinatura(file) {
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const jpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const png = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  const webp =
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50;
  if (!jpeg && !png && !webp) {
    throw new Error("O ficheiro não é uma imagem JPEG, PNG ou WebP válida.");
  }
}

async function medirImagem(file) {
  const url = URL.createObjectURL(file);
  try {
    const elemento = await new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Não foi possível ler a imagem."));
      img.src = url;
    });
    return { largura: elemento.naturalWidth, altura: elemento.naturalHeight };
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function validarImagem(file) {
  if (!TIPOS_ACEITES.includes(file.type)) {
    throw new Error("Formato não suportado. Utilize JPEG, PNG ou WebP.");
  }
  if (file.size > TAMANHO_MAX) {
    throw new Error(`A imagem não pode exceder ${formatarTamanho(TAMANHO_MAX)}.`);
  }
  await confirmarAssinatura(file);
  const { largura, altura } = await medirImagem(file);
  if (Math.min(largura, altura) < DIMENSAO_MIN) {
    throw new Error(`A imagem deve ter pelo menos ${DIMENSAO_MIN} px no lado mais curto.`);
  }
  if (Math.max(largura, altura) > DIMENSAO_MAX) {
    throw new Error(`A imagem não pode exceder ${DIMENSAO_MAX} px no lado maior.`);
  }
  return { largura, altura };
}

export async function carregarImagem(file) {
  await validarImagem(file);
  const resposta = await db.integrations.Core.UploadPrivateFile({ file });
  if (!resposta?.file_uri) {
    throw new Error("Não foi possível carregar a imagem. Tente novamente.");
  }
  return resposta.file_uri;
}

export function gerarReferencia() {
  const alfabeto = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const numeros = crypto.getRandomValues(new Uint32Array(6));
  let codigo = "";
  for (const numero of numeros) codigo += alfabeto[numero % alfabeto.length];
  return `RE-${new Date().getFullYear()}-${codigo}`;
}

export function podeEnviarAgora() {
  const anterior = Number(localStorage.getItem(CHAVE_INTERVALO) ?? 0);
  return Date.now() - anterior > INTERVALO_MINIMO_MS;
}

function formatarResposta(campo, valor) {
  if (Array.isArray(valor)) return valor.join(", ");
  if (valor === "sim") return "Sim";
  if (valor === "nao") return "Não";
  return valor ?? "";
}

export async function criarPedido(dados) {
  if (!podeEnviarAgora()) {
    throw new Error(
      "Enviou um pedido há instantes. Aguarde cerca de 30 segundos antes de enviar outro."
    );
  }

  const servico = obterServico(dados.servicoPrincipal);
  const respostas = camposDoServico(dados.servicoPrincipal)
    .map((campo) => {
      const valor = formatarResposta(campo, dados.respostas?.[campo.id]);
      return valor ? `${campo.label.replace(/\?$/, "")}: ${valor}` : "";
    })
    .filter(Boolean);

  const formato =
    dados.formato === "personalizado"
      ? `Personalizado — ${dados.formatoPersonalizado}`
      : rotuloOpcao(OPCOES_COMUNS.formato, dados.formato);

  const registo = {
    referencia: gerarReferencia(),
    servico_principal: dados.servicoPrincipal,
    servico_nome: servico?.nome ?? "Edição personalizada",
    servicos_complementares: (dados.servicosComplementares ?? []).map(
      (slug) => obterServico(slug)?.nome ?? slug
    ),
    servico_personalizado: dados.servicoPersonalizado ?? "",
    nome_pedido: dados.nomePedido,
    objetivo: dados.objetivo,
    descricao: dados.descricao,
    estilo_visual: dados.estiloVisual ?? "",
    intensidade: rotuloOpcao(OPCOES_COMUNS.intensidade, dados.intensidade),
    realismo: rotuloOpcao(OPCOES_COMUNS.realismo, dados.realismo),
    formato_final: formato,
    resolucao: rotuloOpcao(OPCOES_COMUNS.resolucao, dados.resolucao),
    variacoes: Number(dados.variacoes) || 1,
    observacoes: dados.observacoes ?? "",
    respostas,
    imagem_original_uri: dados.imagemOriginal?.fileUri ?? "",
    imagem_referencia_uri: dados.referencia?.fileUri ?? "",
    referencia_tipo: dados.referencia ? rotuloOpcao(OPCOES_COMUNS.referenciaTipo, dados.referenciaTipo) : "",
    referencia_notas: dados.referenciaNotas ?? "",
    nome_cliente: dados.nomeCliente,
    email_cliente: dados.emailCliente,
    autorizacao_imagens: true,
    novidades: Boolean(dados.novidades),
    estado: "recebido",
  };

  const pedido = await db.entities.PedidoEdicao.create(registo);
  localStorage.setItem(CHAVE_INTERVALO, String(Date.now()));
  return pedido;
}

export async function obterPedido(id) {
  return db.entities.PedidoEdicao.get(id);
}

export const ESTADOS_PEDIDO = {
  recebido: "Pedido registado",
  em_analise: "Em validação",
  em_producao: "Em produção",
  concluido: "Concluído",
  cancelado: "Cancelado",
};