import { Button } from "@/components/ui/button";
import CategoriaDialogo from "@/components/admin/CategoriaDialogo";
import ProdutoMiniatura from "@/components/admin/ProdutoMiniatura";
import ProdutoDialogo from "@/components/admin/ProdutoDialogo";
import { formatEUR } from "@/lib/pricing";

export default function LojaCategoriaCard({ categoria, produtos, categorias, aoAlterar }) {
  const itens = produtos.filter((produto) => produto.categoria_slug === categoria.slug);
  const semImagem = itens.filter((produto) => !produto.imagem).length;

  return (
    <section className="rounded-[1.25rem] border border-border bg-card p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-display text-[1.35rem] leading-none">{categoria.nome}</h2>
            {categoria.ativo === false && (
              <span className="rounded-full border border-border px-3 py-1 text-[0.7rem] uppercase tracking-[0.12em] text-muted-foreground">
                Oculta
              </span>
            )}
          </div>
          <p className="mt-2 text-[0.85rem] text-muted-foreground">
            #{categoria.slug} · ordem {categoria.ordem ?? 0} · {itens.length}{" "}
            {itens.length === 1 ? "produto" : "produtos"}
            {semImagem > 0 && ` · ${semImagem} sem imagem`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <CategoriaDialogo categoria={categoria} aoGuardar={aoAlterar}>
            <Button type="button" variant="outline" size="sm" className="rounded-full">
              Editar categoria
            </Button>
          </CategoriaDialogo>
          <ProdutoDialogo
            produto={null}
            categoriaInicial={categoria.slug}
            categorias={categorias}
            aoGuardar={aoAlterar}
          >
            <Button type="button" size="sm" className="rounded-full">
              Novo produto
            </Button>
          </ProdutoDialogo>
        </div>
      </div>

      {itens.length === 0 ? (
        <p className="mt-5 text-[0.9rem] text-muted-foreground">
          Ainda sem produtos nesta categoria.
        </p>
      ) : (
        <ul className="mt-5 divide-y divide-border border-t border-border">
          {itens.map((produto) => (
            <li
              key={produto.id}
              className="flex flex-wrap items-center justify-between gap-3 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <ProdutoMiniatura produto={produto} />
                <div>
                  <p className="text-[0.95rem]">
                    {produto.nome}
                    {produto.ativo === false && (
                      <span className="ml-2 text-[0.75rem] uppercase tracking-[0.12em] text-muted-foreground">
                        oculto
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 text-[0.82rem] text-muted-foreground">
                    {[produto.grupo, produto.detalhe].filter(Boolean).join(" · ") || "sem grupo"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[0.9rem] tabular-nums">
                  {produto.preco ? formatEUR(produto.preco) : "orçamento"}
                </span>
                <ProdutoDialogo
                  produto={produto}
                  categorias={categorias}
                  aoGuardar={aoAlterar}
                >
                  <Button type="button" variant="ghost" size="sm" className="rounded-full">
                    Editar
                  </Button>
                </ProdutoDialogo>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}