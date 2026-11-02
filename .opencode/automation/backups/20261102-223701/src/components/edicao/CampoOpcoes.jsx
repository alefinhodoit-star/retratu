import { cn } from "@/lib/utils";

export default function CampoOpcoes({
  id,
  label,
  opcoes,
  valor,
  onChange,
  multiplo,
  obrigatorio,
  ajuda,
  erro,
}) {
  const selecionados = multiplo ? (Array.isArray(valor) ? valor : []) : [];
  const idErro = `${id}-erro`;

  const alternar = (opcao) => {
    if (!multiplo) {
      onChange(opcao);
      return;
    }
    onChange(
      selecionados.includes(opcao)
        ? selecionados.filter((item) => item !== opcao)
        : [...selecionados, opcao]
    );
  };

  return (
    <fieldset aria-describedby={erro ? idErro : ajuda ? `${id}-ajuda` : undefined}>
      <legend className="eyebrow">
        {label}
        {obrigatorio ? " *" : ""}
      </legend>
      {ajuda && (
        <p id={`${id}-ajuda`} className="mt-2 text-[0.85rem] text-muted-foreground">
          {ajuda}
        </p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        {opcoes.map((opcao) => {
          const ativo = multiplo ? selecionados.includes(opcao.valor) : valor === opcao.valor;
          return (
            <button
              key={opcao.valor}
              type="button"
              aria-pressed={ativo}
              onClick={() => alternar(opcao.valor)}
              className={cn(
                "rounded-full border px-4 py-2 text-[0.88rem] transition-colors",
                ativo
                  ? "border-foreground bg-foreground text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              )}
            >
              {opcao.label}
            </button>
          );
        })}
      </div>
      {erro && (
        <p id={idErro} className="mt-2 text-[0.85rem] text-destructive">
          {erro}
        </p>
      )}
    </fieldset>
  );
}