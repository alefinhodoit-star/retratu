import { z } from "zod";

// Limites alinhados com os campos do backend; o servidor tem de os revalidar.
const LIMITE_NOME = 120;
const LIMITE_EMPRESA = 120;
const LIMITE_EMAIL = 254;
const LIMITE_MENSAGEM = 2000;

const nome = z
  .string({ required_error: "Indique o seu nome." })
  .trim()
  .min(2, "Indique o seu nome.")
  .max(LIMITE_NOME, `O nome não pode exceder ${LIMITE_NOME} caracteres.`);

const email = z
  .string({ required_error: "Indique o seu e-mail." })
  .trim()
  .min(1, "Indique o seu e-mail.")
  .max(LIMITE_EMAIL, `O e-mail não pode exceder ${LIMITE_EMAIL} caracteres.`)
  .email("Indique um e-mail válido.");

const empresa = z
  .string({ required_error: "Indique o nome da empresa." })
  .trim()
  .min(2, "Indique o nome da empresa.")
  .max(LIMITE_EMPRESA, `O nome da empresa não pode exceder ${LIMITE_EMPRESA} caracteres.`);

const mensagem = z
  .string({ required_error: "Escreva a sua mensagem." })
  .trim()
  .min(10, "Escreva uma mensagem com pelo menos 10 caracteres.")
  .max(LIMITE_MENSAGEM, `A mensagem não pode exceder ${LIMITE_MENSAGEM} caracteres.`);

const colaboradores = z
  .string({ required_error: "Indique o número de colaboradores." })
  .trim()
  .min(1, "Indique o número de colaboradores.")
  .regex(/^\d{1,6}$/, "Indique o número de colaboradores apenas com dígitos.")
  .refine((valor) => Number(valor) > 0, "Indique um número de colaboradores superior a 0.");

/** Formulário de contacto (`Contact.jsx`). */
export function esquemaContacto() {
  return z.object({ nome, email, mensagem });
}

/** Formulário B2B (`B2B.jsx`). */
export function esquemaEmpresa() {
  return z.object({ empresa, colaboradores, email, nome });
}
