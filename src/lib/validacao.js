/**
 * Converte as issues do Zod num mapa { campo: primeira mensagem }.
 * Os campos de `respostas` são achatados para o id do campo condicional.
 * @param {import("zod").ZodError} erro
 * @returns {Record<string, string>}
 */
function mapearErros(erro) {
  /** @type {Record<string, string>} */
  const erros = {};
  for (const problema of erro.issues) {
    const caminho = problema.path.join(".");
    const chave = caminho.startsWith("respostas.") ? caminho.slice("respostas.".length) : caminho;
    if (!erros[chave]) erros[chave] = problema.message;
  }
  return erros;
}

/**
 * Valida e devolve também os dados normalizados (trim aplicado pelos esquemas).
 * `dados` é `null` quando a validação falha.
 * @param {import("zod").ZodTypeAny} esquema
 * @param {unknown} valores
 * @returns {{ erros: Record<string, string>, dados: unknown | null }}
 */
export function validarFormulario(esquema, valores) {
  const resultado = esquema.safeParse(valores);
  if (resultado.success) return { erros: {}, dados: resultado.data };
  return { erros: mapearErros(resultado.error), dados: null };
}

/**
 * Valida e devolve apenas o mapa de erros (vazio se for válido).
 * @param {import("zod").ZodTypeAny} esquema
 * @param {unknown} valores
 * @returns {Record<string, string>}
 */
export function validar(esquema, valores) {
  return validarFormulario(esquema, valores).erros;
}
