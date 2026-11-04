import { db } from "@/lib/api";

import { useEffect, useState } from "react";
import { Loader2, Mail, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import LeadCard from "@/components/admin/LeadCard";
import { ESTADOS_LEAD } from "@/lib/admin";
import { cn } from "@/lib/utils";

const FILTROS = [{ valor: "todos", label: "Todos" }, ...ESTADOS_LEAD];

export default function Contactos() {
  const [filtro, setFiltro] = useState("todos");
  const [termo, setTermo] = useState("");
  const [leads, setLeads] = useState([]);
  const [contagens, setContagens] = useState({});
  const [carregando, setCarregando] = useState(true);

  const carregar = async () => {
    const query = {};
    if (filtro !== "todos") query.estado = filtro;
    const texto = termo.trim();
    if (texto) {
      query.$or = [
        { nome: { $regex: texto, $options: "i" } },
        { email: { $regex: texto, $options: "i" } },
        { empresa: { $regex: texto, $options: "i" } },
      ];
    }

    const pagina = await db.entities.Lead.filter(query, {
      sort: "-created_date",
      limit: 50,
    });
    setLeads(pagina.items);

    const resumo = await db.entities.Lead.aggregate({ groupBy: "estado" });
    setContagens(
      Object.fromEntries((resumo.rows || []).map((linha) => [linha.estado, linha.count]))
    );
    setCarregando(false);
  };

  useEffect(() => {
    const temporizador = setTimeout(() => carregar(), 250);
    return () => clearTimeout(temporizador);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtro, termo]);

  return (
    <div>
      <header>
        <span className="eyebrow">Administração</span>
        <h1 className="mt-4 font-display text-[2.2rem] leading-tight">Contactos</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Pedidos de informação de particulares e empresas. Marque o estado do seguimento e guarde
          notas internas para a equipa.
        </p>
      </header>

      <div className="mt-8 flex flex-wrap gap-2">
        {FILTROS.map((opcao) => (
          <button
            key={opcao.valor}
            type="button"
            onClick={() => setFiltro(opcao.valor)}
            className={cn(
              "rounded-full border px-4 py-2 text-[0.85rem] transition-colors",
              filtro === opcao.valor
                ? "border-transparent bg-foreground text-background"
                : "border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {opcao.label}
            {opcao.valor !== "todos" && contagens[opcao.valor] != null && (
              <span className="ml-2 opacity-70">{contagens[opcao.valor]}</span>
            )}
          </button>
        ))}
      </div>

      <div className="relative mt-6 max-w-sm">
        <Search className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={termo}
          onChange={(evento) => setTermo(evento.target.value)}
          placeholder="Procurar por nome, e-mail ou empresa"
          className="h-12 rounded-none border-0 border-b border-border bg-transparent pl-7 focus-visible:border-foreground focus-visible:ring-0"
        />
      </div>

      {carregando ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : leads.length === 0 ? (
        <div className="mt-8 rounded-[1.25rem] border border-border bg-card p-10 text-center">
          <Mail className="mx-auto h-6 w-6 text-muted-foreground" />
          <h2 className="mt-5 font-display text-[1.4rem]">Sem contactos para mostrar</h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Quando alguém preencher o formulário do site, o pedido aparece aqui.
          </p>
        </div>
      ) : (
        <ul className="mt-8 space-y-5">
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} aoAlterar={carregar} />
          ))}
        </ul>
      )}
    </div>
  );
}