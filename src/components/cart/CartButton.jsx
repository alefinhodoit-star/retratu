import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";

export default function CartButton({ className }) {
  const { quantidadeTotal, abrir } = useCart();

  return (
    <button
      type="button"
      onClick={abrir}
      aria-label={`Abrir carrinho (${quantidadeTotal} artigos)`}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-secondary",
        className
      )}
    >
      <ShoppingBag className="h-4 w-4" />
      {quantidadeTotal > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-accent px-1 text-[0.7rem] font-medium tabular-nums text-accent-foreground">
          {quantidadeTotal}
        </span>
      )}
    </button>
  );
}