import { useState } from "react";
import { History } from "lucide-react";
import EstadoBadge from "@/components/admin/EstadoBadge";
import PedidoAcoes from "@/components/admin/PedidoAcoes";
import { formatarDataHora, quantidadeItem } from "@/lib/admin";
import { formatEUR } from "@/lib/pricing";

export default function PedidoCard({ encomenda, aoAlterar }) {
  const [verHistorico, setVerHistorico] = useState(false);
  const aprovadoPor = encomenda.itens.find((item) => item.aprovado_por)?.aprovado_por;

  return (
    <li className="rounded-[1.25rem] border border-border bg-card p-6 lg:p-7">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-display text-[1.3rem] leading-none">{encomenda.referencia}</h2>
            <EstadoBadge estado={encomenda.estado} />
          </div>
          <p className="mt-3 text-[0.92rem]">
            {encomenda.cliente || "Cliente sem nome"}
            {encomenda.email && (
              <>
                {" · "}
                <a
                  href={`mailto:${encomenda.email}`}
                  className="text-muted-foreground underline-offset-4 hover:underline"
                >
                  {encomenda.email}
                </a>
              </>
            )}
          </p>
          <p className="mt-1 text-[0.85rem] text-muted-foreground">
            {formatarDataHora(encomenda.data)}
            {aprovadoPor ? ` · aprovado por ${aprovadoPor}` : ""}
          </p>
        </div>

        <div className="text-right">
          <div className="font-display text-[1.5rem] leading-none">
            {formatEUR(encomenda.total)}
          </div>
          <p className="mt-1 text-[0.82rem] text-muted-foreground">
            {encomenda.itens.length} {encomenda.itens.length === 1 ? "artigo" : "artigos"}
          </p>
        </div>
      </div>

      <ul className="mt-5 divide-y divide-border border-y border-border">
        {encomenda.itens.map((item) => (
          <li
            key={item.id}
            className="flex flex-wrap items-baseline justify-between gap-3 py-3 text-[0.95rem]"
          >
            <span>
              {item.pacote_nome}
              <span className="text-muted-foreground"> · {quantidadeItem(item)} un.</span>
            </span>
            <span className="font-medium">{formatEUR(item.total)}</span>
          </li>
        ))}
      </ul>

      {encomenda.historico.length > 0 && (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setVerHistorico((atual) => !atual)}
            className="inline-flex items-center gap-2 text-[0.85rem] text-muted-foreground transition-colors hover:text-foreground"
          >
            <History className="h-4 w-4" />
            {verHistorico ? "Ocultar histórico" : `Histórico (${encomenda.historico.length})`}
          </button>
          {verHistorico && (
            <ul className="mt-3 space-y-1.5 text-[0.85rem] text-muted-foreground">
              {encomenda.historico.map((entrada, indice) => (
                <li key={`${entrada}-${indice}`}>{entrada}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <PedidoAcoes encomenda={encomenda} aoAlterar={aoAlterar} />
    </li>
  );
}