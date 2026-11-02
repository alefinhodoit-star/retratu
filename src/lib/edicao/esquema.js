import { z } from "zod";
import { camposDoServico } from "./servicos";

export { validar } from "../validacao";

const mensagemCampo = (label) => `Indique: ${label.replace(/\?$/, "")}.`;

function campoCondicional(campo) {
  const mensagem = mensagemCampo(campo.label);
  if (campo.tipo === "opcoes" && campo.multiplo) {
    return campo.obrigatorio
      ? z.array(z.string(), { required_error: mensagem }).min(1, mensagem)
      : z.array(z.string()).optional();
  }
  return campo.obrigatorio
    ? z.string({ required_error: mensagem }).trim().min(1, mensagem)
    : z.string().trim().optional();
}

export function esquemaServico() {
  return z
    .object({
      servicoPrincipal: z.string().min(1, "Escolha o serviço principal."),
      servicoPersonalizado: z.string().optional(),
    })
    .superRefine((dados, ctx) => {
      if (dados.servicoPrincipal !== "personalizado") return;
      if ((dados.servicoPersonalizado ?? "").trim().length < 15) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["servicoPersonalizado"],
          message: "Descreva o resultado desejado com pelo menos 15 caracteres.",
        });
      }
    });
}

export function esquemaPreferencias(servicoSlug) {
  const respostas = {};
  for (const campo of camposDoServico(servicoSlug)) {
    respostas[campo.id] = campoCondicional(campo);
  }

  return z
    .object({
      nomePedido: z.string().trim().min(3, "Dê um nome ao pedido com pelo menos 3 caracteres."),
      objetivo: z.string().trim().min(3, "Indique o objetivo da edição."),
      descricao: z
        .string()
        .trim()
        .min(15, "Descreva o resultado pretendido com um pouco mais de detalhe."),
      estiloVisual: z.string().optional(),
      intensidade: z.string().min(1, "Escolha a intensidade da edição."),
      realismo: z.string().min(1, "Escolha o nível de realismo."),
      formato: z.string().min(1, "Escolha o formato final."),
      formatoPersonalizado: z.string().optional(),
      resolucao: z.string().min(1, "Escolha a resolução pretendida."),
      variacoes: z.string().min(1, "Escolha o número de variações."),
      observacoes: z.string().optional(),
      respostas: z.object(respostas),
      nomeCliente: z.string().trim().min(3, "Indique o seu nome."),
      emailCliente: z.string().trim().email("Indique um e-mail válido."),
    })
    .superRefine((dados, ctx) => {
      if (dados.formato !== "personalizado") return;
      if ((dados.formatoPersonalizado ?? "").trim().length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["formatoPersonalizado"],
          message: "Descreva o formato pretendido.",
        });
      }
    });
}

export function esquemaAutorizacao() {
  return z.object({
    autorizacao: z.boolean().refine((valor) => valor === true, {
      message: "Confirme que tem autorização para utilizar as imagens enviadas.",
    }),
  });
}

