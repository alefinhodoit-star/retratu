import { db } from "@/lib/api";

import { useState } from "react";
import { Building2, Loader2, Mail, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ESTADOS_LEAD, formatarDataHora, labelLead } from "@/lib/admin";
import { cn } from "@/lib/utils";

export default function LeadCard({ lead, aoAlterar }) {
  const [notas, setNotas] = useState(lead.notas_internas || "");
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [erro, setErro] = useState("");

  const atualizar = async (dados) => {
    setErro("");
    try {
      await db.entities.Lead.update(lead.id, dados);
      aoAlterar();
    } catch (e) {
      setErro("Não foi possível atualizar o contacto.");
    }
  };

  const guardarNota = async () => {
    setGuardando(true);
    setGuardado(false);
    await atualizar({ notas_internas: notas });
    setGuardando(false);
    setGuardado(true);
  };

  return (
    <li className="rounded-[1.25rem] border border-border bg-card p-6 lg:p-7">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <h2 className="font-display text-[1.25rem] leading-none">{lead.nome}</h2>
          <p className="mt-2 text-[0.82rem] uppercase tracking-[0.12em] text-muted-foreground">
            {lead.origem === "empresa" ? "Empresa" : "Contacto"} · {formatarDataHora(lead.created_date)}
          </p>
        </div>
        <span className="rounded-full border border-border px-3 py-1 text-[0.7rem] uppercase tracking-[0.12em] text-muted-foreground">
          {labelLead(lead.estado || "novo")}
        </span>
      </div>

      <div className="mt-5 space-y-2 text-[0.92rem]">
        <p className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <a href={`mailto:${lead.email}`} className="underline-offset-4 hover:underline">
            {lead.email}
          </a>
        </p>
        {lead.telefone && (
          <p className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <a href={`tel:${lead.telefone}`} className="underline-offset-4 hover:underline">
              {lead.telefone}
            </a>
          </p>
        )}
        {lead.empresa && (
          <p className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            {lead.empresa}
            {lead.colaboradores ? ` · ${lead.colaboradores} colaboradores` : ""}
          </p>
        )}
      </div>

      {lead.mensagem && (
        <p className="mt-5 border-l-2 border-accent/50 pl-4 text-[0.95rem] text-muted-foreground">
          {lead.mensagem}
        </p>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        {ESTADOS_LEAD.map((estado) => (
          <button
            key={estado.valor}
            type="button"
            onClick={() => atualizar({ estado: estado.valor })}
            className={cn(
              "rounded-full border px-4 py-2 text-[0.82rem] transition-colors",
              (lead.estado || "novo") === estado.valor
                ? "border-transparent bg-foreground text-background"
                : "border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {estado.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <label htmlFor={`notas-${lead.id}`} className="eyebrow">
          Notas internas
        </label>
        <Textarea
          id={`notas-${lead.id}`}
          rows={2}
          value={notas}
          onChange={(evento) => {
            setNotas(evento.target.value);
            setGuardado(false);
          }}
          placeholder="Registe aqui o seguimento: chamadas, propostas, prazos…"
          className="mt-3 rounded-none border-0 border-b border-border bg-transparent px-0 focus-visible:border-foreground focus-visible:ring-0"
        />
        <div className="mt-3 flex items-center gap-4">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={guardando}
            onClick={guardarNota}
            className="rounded-full"
          >
            {guardando ? <Loader2 className="h-4 w-4 animate-spin" /> : "Guardar nota"}
          </Button>
          {guardado && <span className="text-[0.85rem] text-muted-foreground">Nota guardada</span>}
          {erro && <span className="text-[0.85rem] text-destructive">{erro}</span>}
        </div>
      </div>
    </li>
  );
}