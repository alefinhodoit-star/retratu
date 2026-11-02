import { Link } from "react-router-dom";
import { Check, Loader2, ShieldCheck, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { formatEUR } from "@/lib/pricing";
import { cn } from "@/lib/utils";

export default function Pricing({ pacotes, carregando }) {
  const { adicionar, abrir } = useCart();

  const adicionarPacote = (pacote) => {
    adicionar({
      slug: pacote.slug || pacote.id,
      nome: pacote.nome,
      preco: pacote.preco,
      tipo: "pacote",
    });
    abrir();
  };

  return (
    <section id="pacotes" className="scroll-mt-24 border-t border-border">
      <div className="section-shell">
        <div className="section-head">
          <span className="eyebrow">Pacotes</span>
          <h2 className="section-title">Escolha o pacote certo para o seu próximo passo</h2>
          <p className="section-lede">
            Todos os pacotes incluem seleção assistida das imagens finais. Preços finais ao
            consumidor, com IVA à taxa legal de 23% já incluído.
          </p>
        </div>

        {carregando ? (
          <div
            role="status"
            aria-live="polite"
            aria-busy="true"
            className="flex h-64 items-center justify-center"
          >
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-hidden="true" />
            <span className="sr-only">A carregar os pacotes…</span>
          </div>
        ) : pacotes.length === 0 ? (
          <div className="mt-14 rounded-[1.5rem] border border-dashed border-border bg-card p-9 text-center">
            <h3 className="font-display text-[1.5rem]">Pacotes temporariamente indisponíveis</h3>
            <p className="mx-auto mt-4 max-w-md text-muted-foreground">
              Estamos a atualizar a loja. Entretanto, diga-nos o que precisa e enviamos-lhe os valores
              e prazos por e-mail.
            </p>
            <Button asChild className="mt-8 rounded-full px-7">
              <Link to="/#contactos">Falar connosco</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {pacotes.map((pacote) => (
                <article
                  key={pacote.id}
                  className={cn(
                    "flex flex-col rounded-[1.5rem] border bg-card p-8 transition-all duration-300",
                    pacote.destaque
                      ? "border-accent/60 shadow-[0_30px_90px_-45px_hsl(var(--accent)/0.75)] ring-1 ring-accent/40"
                      : "border-border hover:border-foreground/25"
                  )}
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-display text-[1.6rem] leading-tight">{pacote.nome}</h3>
                    {pacote.tag && (
                      <span
                        className={cn(
                          "whitespace-nowrap rounded-full px-3 py-1 text-[0.65rem] uppercase tracking-[0.18em]",
                          pacote.destaque
                            ? "bg-accent text-accent-foreground"
                            : "bg-secondary text-muted-foreground"
                        )}
                      >
                        {pacote.tag}
                      </span>
                    )}
                  </div>

                  <div className="mt-8 flex items-end gap-3">
                    <span className="font-display text-[2.6rem] leading-none">
                      {formatEUR(pacote.preco)}
                    </span>
                    <span className="pb-1 text-[0.8rem] uppercase tracking-[0.14em] text-muted-foreground">
                      IVA incluído (23%)
                    </span>
                  </div>

                  <p className="mt-6 text-[0.98rem] text-muted-foreground">{pacote.descricao}</p>

                  <ul className="mt-8 flex-1 space-y-3 text-[0.96rem]">
                    {(pacote.inclui || []).map((item) => (
                      <li key={item} className="flex gap-3">
                        <Check className="mt-1 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => adicionarPacote(pacote)}
                    aria-label={`Adicionar ${pacote.nome} ao carrinho`}
                    className={cn(
                      "mt-10 h-14 rounded-full text-[0.98rem]",
                      !pacote.destaque && "bg-foreground text-background hover:bg-foreground/90"
                    )}
                    variant={pacote.destaque ? "default" : "secondary"}
                  >
                    Adicionar ao carrinho
                  </Button>
                  <p className="mt-3 text-center text-[0.75rem] text-muted-foreground">
                    Pagamento único · sem subscrição
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-border pt-8 text-[0.88rem] text-muted-foreground">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-accent" aria-hidden="true" /> Checkout seguro
              </span>
              <span className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-accent" aria-hidden="true" /> Pagamento único, sem
                créditos
              </span>
              <Link
                to="/#faq"
                className="underline decoration-accent decoration-1 underline-offset-4 transition-all hover:decoration-2"
              >
                Não sabe qual escolher? Tire as dúvidas
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
