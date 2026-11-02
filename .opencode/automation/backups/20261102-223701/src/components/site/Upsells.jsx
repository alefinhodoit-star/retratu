import { ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/lib/cart";
import { UPSELL_GRUPOS, formatEUR } from "@/lib/pricing";

export default function Upsells({ pacotePrincipal }) {
  const { adicionar, abrir } = useCart();
  const { toast } = useToast();

  const adicionarExtra = (opcao) => {
    adicionar({ slug: opcao.id, nome: opcao.nome, preco: opcao.preco, tipo: "extra" });
    toast({
      title: "Adicionado ao carrinho",
      description: `${opcao.nome} · ${formatEUR(opcao.preco)} com IVA`,
    });
  };

  const adicionarPacote = () => {
    adicionar({
      slug: pacotePrincipal.slug || pacotePrincipal.id,
      nome: pacotePrincipal.nome,
      preco: pacotePrincipal.preco,
      tipo: "pacote",
    });
    abrir();
  };

  return (
    <section id="extras" className="scroll-mt-24 border-t border-border bg-secondary/40">
      <div className="section-shell">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div className="max-w-xl">
            <span className="eyebrow">Opções adicionais</span>
            <h2 className="section-title">Acrescente só o que faz sentido para si</h2>
            <p className="section-lede">
              Adicione cada opção ao carrinho e continue a navegar. Pode ajustar quantidades ou
              remover artigos antes de finalizar. Sem subscrições e sem créditos: paga uma vez,
              recebe os ficheiros finais.
            </p>
          </div>
          {pacotePrincipal && (
            <Button onClick={adicionarPacote} className="h-14 rounded-full px-7 py-6">
              Adicionar {pacotePrincipal.nome} ao carrinho
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {UPSELL_GRUPOS.map((grupo) => {
            const precos = grupo.opcoes.map((o) => o.preco);
            const minimo = formatEUR(Math.min(...precos));
            const maximo = formatEUR(Math.max(...precos));
            return (
              <article key={grupo.id} className="border-t border-border pt-7">
                <h3 className="font-display text-[1.3rem] leading-tight">{grupo.titulo}</h3>
                <p className="mt-3 text-[0.95rem] text-muted-foreground">{grupo.descricao}</p>
                <p className="mt-6 text-[0.85rem] uppercase tracking-[0.14em] text-muted-foreground">
                  {minimo} – {maximo} · IVA incluído
                </p>
                <ul className="mt-5 space-y-3 text-[0.95rem]">
                  {grupo.opcoes.map((opcao) => (
                    <li key={opcao.id} className="flex items-center justify-between gap-4">
                      <span className="text-muted-foreground">{opcao.nome}</span>
                      <span className="flex items-center gap-3">
                        <span className="tabular-nums">{formatEUR(opcao.preco)}</span>
                        <button
                          type="button"
                          onClick={() => adicionarExtra(opcao)}
                          aria-label={`Adicionar ${opcao.nome} ao carrinho`}
                          className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-border px-3 py-1.5 text-[0.8rem] transition-colors hover:border-foreground/40 hover:bg-secondary"
                        >
                          <Plus className="h-3.5 w-3.5" /> Adicionar
                        </button>
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}