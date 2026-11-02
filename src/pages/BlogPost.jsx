import { db } from "@/api/base44Client";

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Loader2 } from "lucide-react";

import { Image } from "@/components/ui/image";
import { coverDoArtigo } from "@/lib/blogCovers";

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;
    setCarregando(true);
    db.entities.BlogPost.filter({ slug }, { limit: 1 })
      .then((res) => ativo && setPost(res.items[0] || null))
      .finally(() => ativo && setCarregando(false));
    return () => {
      ativo = false;
    };
  }, [slug]);

  if (carregando) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="font-display text-[2rem]">Artigo não encontrado</h1>
        <p className="mt-4 text-muted-foreground">
          O artigo que procura pode ter sido removido ou o endereço está incorreto.
        </p>
        <Link
          to="/blog"
          className="mt-8 inline-flex items-center gap-2 text-[0.95rem] underline underline-offset-4"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar ao blog
        </Link>
      </div>
    );
  }

  return (
    <article className="pb-24 pt-12 lg:pt-20">
      <div className="mx-auto max-w-3xl px-6">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-[0.85rem] text-muted-foreground underline-offset-4 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Blog Retratu
        </Link>
        <div className="mt-8 flex items-center gap-3 text-[0.72rem] uppercase tracking-[0.18em] text-muted-foreground">
          {post.categoria && <span>{post.categoria}</span>}
          {post.tempo_leitura && <span>· {post.tempo_leitura}</span>}
          {post.autor && <span>· {post.autor}</span>}
        </div>
        <h1 className="mt-6 text-balance font-display text-[2.3rem] leading-[1.08] sm:text-[2.9rem]">
          {post.titulo}
        </h1>
        {post.resumo && <p className="mt-7 text-muted-foreground">{post.resumo}</p>}
      </div>

      <div className="mx-auto mt-12 max-w-4xl px-6">
        <div className="overflow-hidden rounded-[1.75rem] border border-border">
          <Image
            src={coverDoArtigo(post)}
            alt={post.titulo}
            fittingType="fill"
            className="aspect-[16/9] w-full"
          />
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-3xl px-6">
        <ReactMarkdown
          components={{
            h2: ({ node, ...props }) => (
              <h2 className="mt-14 font-display text-[1.75rem] leading-tight" {...props} />
            ),
            h3: ({ node, ...props }) => (
              <h3 className="mt-10 font-display text-[1.35rem] leading-tight" {...props} />
            ),
            p: ({ node, ...props }) => (
              <p className="mt-5 text-muted-foreground" {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul className="mt-6 list-disc space-y-2 pl-6 text-muted-foreground" {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol className="mt-6 list-decimal space-y-2 pl-6 text-muted-foreground" {...props} />
            ),
            li: ({ node, ...props }) => <li className="pl-1" {...props} />,
            strong: ({ node, ...props }) => (
              <strong className="font-medium text-foreground" {...props} />
            ),
            blockquote: ({ node, ...props }) => (
              <blockquote
                className="mt-8 border-l-2 border-accent pl-6 font-display text-[1.2rem] leading-relaxed text-foreground"
                {...props}
              />
            ),
          }}
        >
          {post.conteudo || ""}
        </ReactMarkdown>

        <div className="mt-16 border-t border-border pt-8">
          <p className="font-display text-[1.4rem] leading-tight">Gostou deste artigo?</p>
          <p className="mt-3 max-w-md text-[0.95rem] text-muted-foreground">
            Se quiser ver o resultado aplicado às suas fotografias, escolha um pacote. Se preferir
            falar primeiro, escreva-nos — respondemos no mesmo dia útil.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              to="/#pacotes"
              className="inline-flex h-12 items-center rounded-full bg-foreground px-6 text-[0.95rem] text-background transition-colors hover:bg-foreground/90"
            >
              Ver pacotes de retratos
            </Link>
            <Link to="/#contactos" className="link-quiet">
              Falar connosco
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}