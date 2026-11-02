export default function NavCategoriasLoja({ categorias = [] }) {
  if (categorias.length === 0) return null;

  return (
    <nav aria-label="Categorias da loja" className="flex flex-wrap gap-2.5">
      {categorias.map((categoria, indice) => {
        const total = categoria.grupos.reduce((soma, grupo) => soma + grupo.itens.length, 0);

        return (
          <a
            key={categoria.id}
            href={`#${categoria.id}`}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-[0.85rem] text-foreground/80 transition-colors hover:border-foreground/40 hover:bg-secondary/60 hover:text-foreground"
          >
            <span className="text-[0.7rem] tabular-nums text-muted-foreground">
              {String(indice + 1).padStart(2, "0")}
            </span>
            {categoria.curto}
            <span className="text-[0.72rem] tabular-nums text-muted-foreground">{total}</span>
          </a>
        );
      })}
    </nav>
  );
}