import { useState } from "react";
import { Image } from "@/components/ui/image";
import { cn } from "@/lib/utils";

/** Comparador «antes / depois» com máscara de abertura — deslize para revelar o retrato. */
export default function BeforeAfter({ antes, depois, legenda, className }) {
  const [pos, setPos] = useState(55);

  return (
    <figure className={cn("w-full", className)}>
      <div className="relative overflow-hidden rounded-[1.75rem] border border-border bg-secondary shadow-[0_30px_80px_-50px_rgba(26,26,27,0.45)]">
        <div className="group relative aspect-[4/5] w-full select-none">
          <Image
            src={depois}
            alt={`${legenda} — retrato final gerado com IA`}
            fittingType="fill"
            className="absolute inset-0 h-full w-full"
          />
          <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
            <Image
              src={antes}
              alt={`${legenda} — fotografia original`}
              fittingType="fill"
              className="h-full w-full"
            />
          </div>

          <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-background/85 px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-muted-foreground backdrop-blur">
            Antes
          </span>
          <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-foreground/85 px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-background backdrop-blur">
            Retratu
          </span>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 w-px bg-background/90"
            style={{ left: `${pos}%` }}
          >
            {/* O input é invisível; o anel de foco no puxador é o indicador visível de teclado. */}
            <span className="absolute top-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-background/70 bg-background/95 text-[0.6rem] font-medium uppercase tracking-[0.12em] text-foreground shadow-lg transition-shadow group-focus-within:ring-2 group-focus-within:ring-ring group-focus-within:ring-offset-2 group-focus-within:ring-offset-background">
              ⇆
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={100}
            value={pos}
            onChange={(e) => setPos(Number(e.target.value))}
            aria-label={`Comparar antes e depois — ${legenda}`}
            aria-valuetext={`${pos}% da fotografia original visível`}
            className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
          />
        </div>
      </div>
      <figcaption className="mt-4 text-sm text-muted-foreground">
        {legenda} · deslize para comparar a fotografia original com o retrato final
      </figcaption>
    </figure>
  );
}
