import { db } from "@/api/base44Client";

import { useEffect, useState } from "react";
import { Loader2, Tag } from "lucide-react";

import { Button } from "@/components/ui/button";
import PacoteDialogo from "@/components/admin/PacoteDialogo";
import { formatEUR } from "@/lib/pricing";

export default function Pacotes() {
  const [pacotes, setPacotes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const carregar = async () => {
    const resposta = await db.entities.Package.list({ sort: "ordem", limit: 50 });
    setPacotes(resposta.items);
    setCarregando(false);
  };

  useEffect(() => {
    carregar();
  }, []);

  const alternarVisivel = async (pacote) => {
    await db.entities.Package.update(pacote.id, { ativo: pacote.ativo === false });
    carregar();
  };

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <span className="eyebrow">Administração</span>
          <h1 className="mt-4 font-display text-[2.2rem] leading-tight">Pacotes</h1>
          <p className="mt-4 text-muted-foreground">
            Edite nomes, preços finais, descrições e o que cada pacote inclui. As alterações
            aparecem logo na página inicial.
          </p>
        </div>
        <PacoteDialogo pacote={null} aoGuardar={carregar}>
          <Button type="button" className="rounded-full px-6">
            Novo pacote
          </Button>
        </PacoteDialogo>
      </header>

      {carregando ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : pacotes.length === 0 ? (
        <div className="mt-10 rounded-[1.25rem] border border-border bg-card p-10 text-center">
          <Tag className="mx-auto h-6 w-6 text-muted-foreground" />
          <h2 className="mt-5 font-display text-[1.4rem]">Ainda sem pacotes</h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Crie o primeiro pacote para voltar a apresentar preços na página inicial.
          </p>
        </div>
      ) : (
        <ul className="mt-10 space-y-5">
          {pacotes.map((pacote) => (
            <li
              key={pacote.id}
              className="flex flex-wrap items-start justify-between gap-6 rounded-[1.25rem] border border-border bg-card p-6"
            >
              <div className="max-w-xl">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-display text-[1.35rem] leading-none">{pacote.nome}</h2>
                  {pacote.tag && (
                    <span className="rounded-full bg-secondary px-3 py-1 text-[0.7rem] uppercase tracking-[0.12em] text-muted-foreground">
                      {pacote.tag}
                    </span>
                  )}
                  {pacote.destaque && (
                    <span className="rounded-full bg-accent/20 px-3 py-1 text-[0.7rem] uppercase tracking-[0.12em]">
                      Destaque
                    </span>
                  )}
                  {pacote.ativo === false && (
                    <span className="rounded-full border border-border px-3 py-1 text-[0.7rem] uppercase tracking-[0.12em] text-muted-foreground">
                      Oculto
                    </span>
                  )}
                </div>
                <p className="mt-3 text-[0.92rem] text-muted-foreground">{pacote.descricao}</p>
                <p className="mt-2 text-[0.82rem] text-muted-foreground">
                  #{(pacote.slug || pacote.id).toString()} · ordem {pacote.ordem ?? 0} ·{" "}
                  {(pacote.inclui || []).length} itens incluídos
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-5">
                <span className="font-display text-[1.5rem] leading-none">
                  {formatEUR(pacote.preco)}
                </span>
                <span className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => alternarVisivel(pacote)}
                    className="rounded-full"
                  >
                    {pacote.ativo === false ? "Mostrar no site" : "Ocultar no site"}
                  </Button>
                  <PacoteDialogo pacote={pacote} aoGuardar={carregar}>
                    <Button type="button" variant="outline" size="sm" className="rounded-full">
                      Editar
                    </Button>
                  </PacoteDialogo>
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}