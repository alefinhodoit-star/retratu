import { ESTADOS_PEDIDO } from "@/lib/admin";
import { cn } from "@/lib/utils";

export default function EstadoBadge({ estado }) {
  const info = ESTADOS_PEDIDO[estado] || {
    label: estado,
    badge: "border-border text-muted-foreground",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-[0.7rem] uppercase tracking-[0.12em]",
        info.badge
      )}
    >
      {info.label}
    </span>
  );
}