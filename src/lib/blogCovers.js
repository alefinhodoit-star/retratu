// @ts-check

import { MEDIA } from "@/lib/media";

/** Capas dos artigos semeados — usadas quando o artigo ainda não tem imagem própria. */
/** @type {Record<string, string>} */
export const BLOG_COVERS = {
  "retrato-profissional-linkedin-guia": MEDIA.artigoLinkedin,
  "o-que-vestir-no-seu-retrato-profissional": MEDIA.artigoVestuario,
  "como-funciona-a-ia-do-retratu": MEDIA.lente,
  "retratos-de-equipa-consistentes-para-a-sua-empresa": MEDIA.equipa,
};

/**
 * @param {{ imagem?: string, slug?: string } | null | undefined} post
 * @returns {string} imagem do artigo, capa por slug, ou capa genérica
 */
export const coverDoArtigo = (post) => post?.imagem || BLOG_COVERS[post?.slug] || MEDIA.lente;
