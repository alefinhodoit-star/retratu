import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const PASSOS = [
  "Serviço",
  "Preferências",
  "Imagem original",
  "Referência",
  "Revisão",
];

export default function Passos({ atual, onIr }) {
  return (
    <nav aria-label="Progresso do pedido">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-3">
        {PASSOS.map((nome, indice) => {
          const concluido = indice < atual;
          const ativo = indice === atual;
          return (
            <li key={nome} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onIr(indice)}
                disabled={indice > atual}
                aria-current={ativo ? "step" : undefined}
                className={cn(
                  "flex items-center gap-2 rounded-full px-3 py-1.5 text-[0.8rem] transition-colors",
                  ativo && "bg-foreground text-primary-foreground",
                  concluido && "text-foreground hover:bg-secondary",
                  !ativo && !concluido && "text-muted-foreground"
                )}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full border text-[0.7rem]",
                    ativo ? "border-primary-foreground/40" : "border-border"
                  )}
                  aria-hidden="true"
                >
                  {concluido ? <Check className="h-3 w-3" /> : indice + 1}
                </span>
                <span className="hidden sm:inline">{nome}</span>
              </button>
              {indice < PASSOS.length - 1 && (
                <span className="h-px w-4 bg-border" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}