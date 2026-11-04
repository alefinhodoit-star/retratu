import { db } from "@/lib/api";

import { useEffect, useState } from "react";
import { Loader2, Store } from "lucide-react";

import { Button } from "@/components/ui/button";
import CategoriaDialogo from "@/components/admin/CategoriaDialogo";
import LojaCategoriaCard from "@/components/admin/LojaCategoriaCard";
import ProdutoDialogo from "@/components/admin/ProdutoDialogo";
import ProdutoMiniatura from "@/components/admin/ProdutoMiniatura";

export default function Loja() {
  const [categorias, setCategorias] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const carregar = async () => {
    const [listaCategorias, listaProdutos] = await Promise.all([
      db.entities.CategoriaLoja.list({ sort: "ordem", limit: 50 }),
      db.entities.ProdutoLoja.list({ sort: "ordem", limit: 200 }),
    ]);
    setCategorias(listaCategorias.items);
    setProdutos(listaProdutos.items);
    setCarregando(false);
  };

  useEffect(() => {
    carregar();
  }, []);

  const semCategoria = produtos.filter(
    (produto) => !categorias.some((categoria) => categoria.slug === produto.categoria_slug)
  );

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <span className="eyebrow">Administração</span>
          <h1 className="mt-4 font-display text-[2.2rem] leading-tight">Loja</h1>
          <p className="mt-4 text-muted-foreground">
            Organize as categorias da loja e edite os produtos, grupos e preços. Tudo o que alterar
            fica visível na página da loja.
          </p>
        </div>
        <CategoriaDialogo categoria={null} aoGuardar={carregar}>
          <Button type="button" className="rounded-full px-6">
            Nova categoria
          </Button>
        </CategoriaDialogo>
      </header>

      {carregando ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="mt-10 space-y-5">
          {categorias.length === 0 && (
            <div className="rounded-[1.25rem] border border-border bg-card p-10 text-center">
              <Store className="mx-auto h-6 w-6 text-muted-foreground" />
              <h2 className="mt-5 font-display text-[1.4rem]">Ainda sem categorias</h2>
              <p className="mx-auto mt-3 max-w-md text-muted-foreground">
                Crie a primeira categoria para começar a organizar os produtos da loja.
              </p>
            </div>
          )}

          {categorias.map((categoria) => (
            <LojaCategoriaCard
              key={categoria.id}
              categoria={categoria}
              produtos={produtos}
              categorias={categorias}
              aoAlterar={carregar}
            />
          ))}

          {semCategoria.length > 0 && (
            <section className="rounded-[1.25rem] border border-dashed border-border bg-card p-6">
              <h2 className="font-display text-[1.35rem] leading-none">Produtos sem categoria</h2>
              <p className="mt-2 text-[0.85rem] text-muted-foreground">
                Estes produtos não aparecem na loja até lhes atribuir uma categoria existente.
              </p>
              <ul className="mt-5 divide-y divide-border border-t border-border">
                {semCategoria.map((produto) => (
                  <li
                    key={produto.id}
                    className="flex flex-wrap items-center justify-between gap-3 py-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <ProdutoMiniatura produto={produto} />
                      <div>
                        <p className="text-[0.95rem]">{produto.nome}</p>
                        <p className="mt-0.5 text-[0.82rem] text-muted-foreground">
                          categoria: {produto.categoria_slug || "—"}
                        </p>
                      </div>
                    </div>
                    <ProdutoDialogo produto={produto} categorias={categorias} aoGuardar={carregar}>
                      <Button type="button" variant="outline" size="sm" className="rounded-full">
                        Atribuir categoria
                      </Button>
                    </ProdutoDialogo>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}