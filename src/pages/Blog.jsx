import { db } from "@/lib/api";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

import BlogCard from "@/components/site/BlogCard";
import { Button } from "@/components/ui/button";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    let ativo = true;
    db.entities.BlogPost.filter({ publicado: true }, { sort: "-data", limit: 24 })
      .then((res) => ativo && setPosts(res.items))
      .catch(() => ativo && setErro(true))
      .finally(() => ativo && setCarregando(false));
    return () => {
      ativo = false;
    };
  }, []);

  const [primeiro, ...restantes] = posts;

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-16 lg:pt-24" aria-busy={carregando}>
      <div className="max-w-3xl">
        <span className="eyebrow">Blog Retratu</span>
        <h1 className="mt-6 text-balance font-display text-[2.4rem] leading-[1.06] sm:text-[3.1rem]">
          Ideias para uma imagem profissional que abre portas
        </h1>
        <p className="mt-6 text-pretty text-muted-foreground">
          Artigos práticos para quem quer melhorar a presença digital, preparar uma sessão de retratos
          ou padronizar a imagem de uma equipa inteira. Escritos por quem faz isto todos os dias.
        </p>
        <p className="mt-4 text-[0.85rem] text-muted-foreground">
          Publicamos com regularidade — sem spam e sem promessas vazias.
        </p>
      </div>

      {carregando ? (
        <div role="status" className="flex h-64 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-hidden="true" />
          <span className="sr-only">A carregar os artigos…</span>
        </div>
      ) : erro ? (
        <div
          role="alert"
          className="mt-16 rounded-[1.5rem] border border-dashed border-border bg-card p-9 text-center"
        >
          <h2 className="font-display text-[1.5rem]">Não conseguimos carregar os artigos</h2>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            Foi um problema passageiro do nosso lado. Tente recarregar a página ou fale connosco.
          </p>
          <Button asChild className="mt-8 rounded-full px-7">
            <Link to="/#contactos">Falar connosco</Link>
          </Button>
        </div>
      ) : posts.length === 0 ? (
        <div className="mt-16 rounded-[1.5rem] border border-dashed border-border bg-card p-9 text-center">
          <h2 className="font-display text-[1.5rem]">Ainda estamos a preparar os primeiros artigos</h2>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            Entretanto, pode ver os exemplos de retratos ou escolher já o seu pacote. Se tiver uma
            dúvida concreta, respondemos por e-mail.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild className="rounded-full px-7">
              <Link to="/#pacotes">Ver pacotes</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full px-7">
              <Link to="/#contactos">Falar connosco</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-16 space-y-10">
          <BlogCard post={primeiro} destaque />
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {restantes.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
