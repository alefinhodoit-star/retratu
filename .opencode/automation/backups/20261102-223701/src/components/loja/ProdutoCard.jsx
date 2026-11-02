import { Image } from "@/components/ui/image";
import { formatEUR } from "@/lib/pricing";

export default function ProdutoCard({ produto }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-foreground/25 hover:shadow-[0_22px_45px_-28px_rgba(23,22,20,0.45)]">
      <div className="overflow-hidden border-b border-border bg-secondary">
        {produto.imagem ? (
          <Image
            src={produto.imagem}
            alt={produto.nome}
            fittingType="fill"
            className="aspect-[4/3] w-full transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex aspect-[4/3] w-full items-center justify-center text-[0.68rem] uppercase tracking-[0.24em] text-muted-foreground">
            Sem imagem
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h4 className="font-display text-[1.08rem] leading-snug">{produto.nome}</h4>
        {produto.detalhe && (
          <p className="mt-2 text-[0.85rem] leading-relaxed text-muted-foreground">
            {produto.detalhe}
          </p>
        )}
        <p className="mt-auto border-t border-border pt-4 text-[0.82rem] text-muted-foreground">
          {produto.preco ? (
            <>
              desde{" "}
              <span className="font-medium text-foreground">{formatEUR(produto.preco)}</span> · IVA
              incl.
            </>
          ) : (
            "Orçamento à medida"
          )}
        </p>
      </div>
    </article>
  );
}