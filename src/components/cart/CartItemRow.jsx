import { Minus, Plus, Trash2 } from "lucide-react";
import { formatEUR } from "@/lib/pricing";
import { useCart } from "@/lib/cart";

const ETIQUETA_TIPO = {
  pacote: "Pacote",
  extra: "Opção adicional",
};

export default function CartItemRow({ item }) {
  const { alterarQuantidade, remover } = useCart();

  return (
    <li className="flex items-start justify-between gap-5 border-b border-border pb-5">
      <div className="min-w-0">
        <p className="font-medium leading-snug">{item.nome}</p>
        <p className="mt-1 text-[0.85rem] text-muted-foreground">
          {ETIQUETA_TIPO[item.tipo] || "Serviço"} · {formatEUR(item.preco)} c/ IVA
        </p>
        <button
          type="button"
          onClick={() => remover(item.slug)}
          className="mt-3 inline-flex items-center gap-1.5 text-[0.82rem] text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
        >
          <Trash2 className="h-3.5 w-3.5" /> Remover
        </button>
      </div>

      <div className="flex flex-col items-end gap-3">
        <div className="flex items-center gap-1 rounded-full border border-border px-1.5 py-1">
          <button
            type="button"
            aria-label={`Diminuir quantidade de ${item.nome}`}
            onClick={() => alterarQuantidade(item.slug, item.quantidade - 1)}
            className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-6 text-center text-[0.9rem] tabular-nums">{item.quantidade}</span>
          <button
            type="button"
            aria-label={`Aumentar quantidade de ${item.nome}`}
            onClick={() => alterarQuantidade(item.slug, item.quantidade + 1)}
            className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        <span className="font-medium tabular-nums">
          {formatEUR(item.preco * item.quantidade)}
        </span>
      </div>
    </li>
  );
}