import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { Image } from "@/components/ui/image";
import { coverDoArtigo } from "@/lib/blogCovers";
import { cn } from "@/lib/utils";

const formatarData = (valor) => {
  if (!valor) return "";
  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) return "";
  return new Intl.DateTimeFormat("pt-PT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(data);
};

export default function BlogCard({ post, destaque = false }) {
  if (!post) return null;

  const data = formatarData(post.data);

  return (
    <article
      className={cn(
        "group overflow-hidden rounded-[1.5rem] border border-border bg-card transition-colors hover:border-foreground/25",
        destaque && "grid md:grid-cols-2"
      )}
    >
      <Link
        to={`/blog/${post.slug}`}
        className={cn("block overflow-hidden bg-secondary", destaque ? "md:h-full" : "aspect-[16/10]")}
        aria-label={post.titulo}
      >
        <Image
          src={coverDoArtigo(post)}
          alt={post.titulo}
          fittingType="fill"
          className={cn(
            "h-full w-full transition-transform duration-500 group-hover:scale-[1.03]",
            destaque ? "aspect-[16/10] md:aspect-auto" : "aspect-[16/10]"
          )}
        />
      </Link>

      <div className={cn("flex flex-col p-7", destaque && "md:justify-center md:p-10")}>
        <div className="flex flex-wrap items-center gap-3 text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground">
          {post.categoria && <span>{post.categoria}</span>}
          {data && <span>· {data}</span>}
          {post.tempo_leitura && <span>· {post.tempo_leitura}</span>}
        </div>

        <h2
          className={cn(
            "mt-4 text-balance font-display leading-tight",
            destaque ? "text-[1.9rem] sm:text-[2.3rem]" : "text-[1.35rem]"
          )}
        >
          <Link to={`/blog/${post.slug}`} className="transition-colors hover:text-accent">
            {post.titulo}
          </Link>
        </h2>

        {post.resumo && (
          <p className="mt-4 line-clamp-3 text-[0.95rem] leading-relaxed text-muted-foreground">
            {post.resumo}
          </p>
        )}

        <Link
          to={`/blog/${post.slug}`}
          className="mt-6 inline-flex items-center gap-2 text-[0.85rem] font-medium underline-offset-4 hover:underline"
        >
          Ler artigo <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
