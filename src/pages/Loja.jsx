import { Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import CategoriaLoja from "@/components/loja/CategoriaLoja";
import NavCategoriasLoja from "@/components/loja/NavCategoriasLoja";
import { useCatalogo } from "@/lib/loja";

const ETAPAS = [
  {
    numero: "01",
    titulo: "Escolha a peça",
    texto: "Explore as categorias e identifique o que quer produzir com as suas fotografias.",
  },
  {
    numero: "02",
    titulo: "Peça orçamento",
    texto: "Diga-nos quantidades e prazos. Confirmamos valores e portes por e-mail.",
  },
  {
    numero: "03",
    titulo: "Produzimos à medida",
    texto: "Aprovamos a arte consigo e só avançamos quando estiver tudo certo.",
  },
];

export default function Loja() {
  const { categorias, carregando } = useCatalogo();

  return (
    <>
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 pb-16 pt-16 lg:pb-20 lg:pt-24">
          <span className="eyebrow">Loja Retratu</span>
          <h1 className="mt-6 max-w-3xl text-balance font-display text-[2.4rem] leading-[1.05] sm:text-[3.1rem]">
            As suas fotografias em objetos que ficam
          </h1>
          <p className="mt-7 max-w-2xl text-pretty text-muted-foreground">
            Álbuns, revelações, decoração, presentes, calendários e papelaria, produzidos à medida a
            partir das suas imagens. Escolha uma categoria e veja todas as opções disponíveis — sem
            pressa e sem compromisso.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-5">
            <Button asChild className="h-14 rounded-full px-7 py-6">
              <Link to="/#contactos">
                Pedir orçamento <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <p className="max-w-sm text-[0.88rem] text-muted-foreground">
              Cada peça é orçamentada à medida. Confirmamos valores, prazos e portes por e-mail —
              normalmente no mesmo dia útil.
            </p>
          </div>

          <div className="mt-12">
            <NavCategoriasLoja categorias={categorias} />
          </div>
        </div>
      </section>

      {carregando ? (
        <section className="border-t border-border">
          <div role="status" className="flex items-center justify-center py-24">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-hidden="true" />
            <span className="sr-only">A carregar o catálogo…</span>
          </div>
        </section>
      ) : categorias.length === 0 ? (
        <section className="border-t border-border">
          <div className="mx-auto max-w-3xl px-6 py-20 text-center">
            <h2 className="font-display text-[1.6rem]">Catálogo em atualização</h2>
            <p className="mx-auto mt-4 max-w-md text-muted-foreground">
              Estamos a preparar novas peças. Entretanto, diga-nos o que procura e preparamos uma
              proposta à medida.
            </p>
            <Button asChild className="mt-8 rounded-full px-7">
              <Link to="/#contactos">Falar connosco</Link>
            </Button>
          </div>
        </section>
      ) : (
        categorias.map((categoria, indice) => (
          <CategoriaLoja
            key={categoria.id}
            categoria={categoria}
            numero={String(indice + 1).padStart(2, "0")}
          />
        ))
      )}

      <section className="border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
          <div className="max-w-2xl">
            <span className="eyebrow">Como funciona</span>
            <h2 className="section-title">Do orçamento à peça na sua mão</h2>
            <p className="section-lede">
              Sem surpresas no valor final: cada etapa é confirmada consigo antes de avançar.
            </p>
          </div>
          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {ETAPAS.map((etapa) => (
              <li key={etapa.numero} className="border-t border-border pt-6">
                <span className="font-display text-[0.9rem] tracking-[0.2em] text-accent">
                  {etapa.numero}
                </span>
                <h3 className="mt-3 font-display text-[1.3rem] leading-tight">{etapa.titulo}</h3>
                <p className="mt-3 text-[0.95rem] text-muted-foreground">{etapa.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-8 px-6 py-16 lg:py-20">
          <div className="max-w-xl">
            <h2 className="font-display text-[1.8rem] leading-tight">
              Não encontrou o que procura?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Fazemos projetos especiais: quantidades grandes, brindes de empresa, azulejos e peças
              únicas. Diga-nos o que precisa e preparamos uma proposta.
            </p>
          </div>
          <Button asChild variant="outline" className="h-14 rounded-full px-7 py-6">
            <Link to="/#contactos">Falar com o estúdio</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
