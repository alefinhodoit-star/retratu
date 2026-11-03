import { useState } from "react";
import {
  Check,
  Image as ImageIcon,
  Megaphone,
  Package,
  Palette,
  PersonStanding,
  Plus,
  Shirt,
  Sparkles,
  Sun,
  Wand2,
} from "lucide-react";
import CampoTexto from "@/components/edicao/CampoTexto";
import { CATEGORIAS, SERVICO_PERSONALIZADO } from "@/lib/edicao/servicos";
import { cn } from "@/lib/utils";

const ICONES = { Sparkles, Shirt, ImageIcon, Wand2, Sun, PersonStanding, Palette, Package, Megaphone };

export default function ServiceSelector({
  valor,
  complementares,
  servicoPersonalizado,
  onEscolherPrincipal,
  onAlternarComplementar,
  onAlterarPersonalizado,
  erroServico,
  erroPersonalizado,
}) {
  const [categoriaAtiva, setCategoriaAtiva] = useState(CATEGORIAS[0].id);
  const categoria = CATEGORIAS.find((c) => c.id === categoriaAtiva) ?? CATEGORIAS[0];

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Categorias de serviço">
        {CATEGORIAS.map((item) => {
          const Icone = ICONES[item.icone] ?? Sparkles;
          const ativa = item.id === categoria.id;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={ativa}
              onClick={() => setCategoriaAtiva(item.id)}
              className={cn(
                "flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-[0.82rem] transition-colors",
                ativa
                  ? "border-foreground bg-secondary text-foreground"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              )}
            >
              <Icone className="h-4 w-4" aria-hidden="true" />
              {item.nome}
            </button>
          );
        })}
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categoria.servicos.map((servico) => {
          const principal = valor === servico.slug;
          const complementar = complementares.includes(servico.slug);
          return (
            <div
              key={servico.slug}
              className={cn(
                "rounded-[1.25rem] border bg-card p-5 transition-all",
                principal ? "border-foreground shadow-[0_18px_44px_-30px_rgba(0,0,0,0.5)]" : "border-border hover:border-foreground/40"
              )}
            >
              <button
                type="button"
                onClick={() => onEscolherPrincipal(servico.slug)}
                aria-pressed={principal}
                className="block w-full text-left"
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="font-display text-[1.05rem] leading-snug">{servico.nome}</span>
                  {principal && (
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground text-primary-foreground">
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  )}
                </span>
                <span className="mt-2 block text-[0.85rem] leading-relaxed text-muted-foreground">
                  {servico.descricao}
                </span>
              </button>

              {valor && !principal && (
                <button
                  type="button"
                  onClick={() => onAlternarComplementar(servico.slug)}
                  aria-pressed={complementar}
                  className={cn(
                    "mt-4 inline-flex min-h-11 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[0.76rem] transition-colors sm:min-h-0",
                    complementar
                      ? "border-foreground bg-secondary text-foreground"
                      : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                  )}
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                  {complementar ? "Complementar" : "Adicionar complementar"}
                </button>
              )}
            </div>
          );
        })}

        <div
          className={cn(
            "rounded-[1.25rem] border bg-card p-5 transition-all",
            valor === SERVICO_PERSONALIZADO
              ? "border-foreground shadow-[0_18px_44px_-30px_rgba(0,0,0,0.5)]"
              : "border-dashed border-border hover:border-foreground/40"
          )}
        >
          <button
            type="button"
            onClick={() => onEscolherPrincipal(SERVICO_PERSONALIZADO)}
            aria-pressed={valor === SERVICO_PERSONALIZADO}
            className="block w-full text-left"
          >
            <span className="flex items-start justify-between gap-3">
              <span className="font-display text-[1.05rem] leading-snug">
                Não encontro o que procuro
              </span>
              {valor === SERVICO_PERSONALIZADO && (
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground text-primary-foreground">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              )}
            </span>
            <span className="mt-2 block text-[0.85rem] leading-relaxed text-muted-foreground">
              Descreva o resultado que pretende e a equipa avalia o pedido.
            </span>
          </button>
        </div>
      </div>

      {valor === SERVICO_PERSONALIZADO && (
        <div className="mt-7">
          <CampoTexto
            id="servico-personalizado"
            label="O que pretende editar? *"
            rows={3}
            valor={servicoPersonalizado}
            onChange={onAlterarPersonalizado}
            placeholder="Descreva a edição que procura."
            erro={erroPersonalizado}
          />
        </div>
      )}

      {erroServico && (
        <p className="mt-4 text-[0.85rem] text-destructive" role="alert">
          {erroServico}
        </p>
      )}
    </div>
  );
}