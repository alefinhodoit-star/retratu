import { MEDIA } from "@/lib/media";

/** Capas dos artigos semeados — usadas quando o artigo ainda não tem imagem própria. */
export const BLOG_COVERS = {
  "retrato-profissional-linkedin-guia": MEDIA.artigoLinkedin,
  "o-que-vestir-no-seu-retrato-profissional": MEDIA.artigoVestuario,
  "como-funciona-a-ia-do-retratu": MEDIA.lente,
  "retratos-de-equipa-consistentes-para-a-sua-empresa": MEDIA.equipa,
};

export const coverDoArtigo = (post) => post?.imagem || BLOG_COVERS[post?.slug] || MEDIA.lente;