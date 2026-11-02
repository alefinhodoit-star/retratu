import ProdutoCard from "@/components/loja/ProdutoCard";

export default function CategoriaLoja({ categoria, numero }) {
  const alternado = Number(numero) % 2 === 0;
  const total = categoria.grupos.reduce((soma, grupo) => soma + grupo.itens.length, 0);

  return (
    <section
      id={categoria.id}
      className={`scroll-mt-28 border-t border-border ${alternado ? "bg-secondary/30" : ""}`}
    >
      <div className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <div className="max-w-2xl">
            <span className="eyebrow">Loja · {numero}</span>
            <h2 className="mt-5 text-balance font-display text-[2.1rem] leading-[1.08] sm:text-[2.5rem]">
              {categoria.nome}
            </h2>
            <p className="mt-5 text-muted-foreground">{categoria.resumo}</p>
          </div>
          <span className="eyebrow whitespace-nowrap">
            {total} {total === 1 ? "opção" : "opções"}
          </span>
        </div>

        <div className="mt-12 space-y-14">
          {categoria.grupos.map((grupo) => (
            <div key={grupo.titulo}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-b border-border pb-4">
                <h3 className="font-display text-[1.28rem] leading-tight">{grupo.titulo}</h3>
                {grupo.nota && (
                  <p className="max-w-md text-[0.85rem] text-muted-foreground">{grupo.nota}</p>
                )}
              </div>

              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {grupo.itens.map((item) => (
                  <ProdutoCard key={item.id} produto={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}