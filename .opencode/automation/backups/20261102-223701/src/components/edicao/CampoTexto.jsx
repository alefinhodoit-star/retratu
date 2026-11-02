import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const CAMPO =
  "mt-3 rounded-none border-0 border-b border-border bg-transparent px-0 focus-visible:border-foreground focus-visible:ring-0";

export default function CampoTexto({
  id,
  label,
  valor,
  onChange,
  erro,
  ajuda,
  placeholder,
  rows,
  type = "text",
  autoComplete,
}) {
  const idAjuda = `${id}-ajuda`;
  const idErro = `${id}-erro`;

  return (
    <div>
      <label htmlFor={id} className="eyebrow">
        {label}
      </label>
      {rows ? (
        <Textarea
          id={id}
          rows={rows}
          value={valor ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-invalid={Boolean(erro)}
          aria-describedby={erro ? idErro : ajuda ? idAjuda : undefined}
          className={CAMPO}
        />
      ) : (
        <Input
          id={id}
          type={type}
          value={valor ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={Boolean(erro)}
          aria-describedby={erro ? idErro : ajuda ? idAjuda : undefined}
          className={CAMPO}
        />
      )}
      {ajuda && !erro && (
        <p id={idAjuda} className="mt-2 text-[0.85rem] text-muted-foreground">
          {ajuda}
        </p>
      )}
      {erro && (
        <p id={idErro} className="mt-2 text-[0.85rem] text-destructive">
          {erro}
        </p>
      )}
    </div>
  );
}