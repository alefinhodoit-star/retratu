import { db } from "@/api/base44Client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, ArrowRight, Check, Inbox, Loader2, Mail, Package } from "lucide-react";

import EstadoBadge from "@/components/admin/EstadoBadge";
import { agruparEncomendas, formatarDataHora } from "@/lib/admin";
import { formatEUR } from "@/lib/pricing";

const CARTOES = [
  { chave: "pendente_pagamento", label: "Por aprovar", Icone: AlertCircle, rota: "/admin/pedidos" },
  { chave: "em_producao", label: "Em produção", Icone: Package, rota: "/admin/pedidos" },
  { chave: "concluido", label: "Concluídos", Icone: Check, rota: "/admin/pedidos" },
];

export default function Painel() {
  const [dados, setDados] = useState(null);
  const [ultimos, setUltimos] = useState([]);

  useEffect(() => {
    (async () => {
      const [resumo, pedidos, leadsNovos] = await Promise.all([
        db.entities.Order.aggregate({ groupBy: "estado", sum: ["total"] }),
        db.entities.Order.list({ sort: "-created_date", limit: 8 }),
        db.entities.Lead.count({ estado: "novo" }),
      ]);
      setDados({ porEstado: resumo.rows || [], leadsNovos });
      setUltimos(agruparEncomendas(pedidos.items || []));
    })();
  }, []);

  if (!dados) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const porEstado = Object.fromEntries(dados.porEstado.map((linha) => [linha.estado, linha]));
  const faturacao = ["pago", "em_producao", "concluido"].reduce(
    (soma, estado) => soma + (porEstado[estado]?.sum_total || 0),
    0
  );

  return (
    <div>
      <header>
        <span className="eyebrow">Administração</span>
        <h1 className="mt-4 font-display text-[2.2rem] leading-tight">Painel</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Resumo do movimento da loja: pedidos a aguardar aprovação, produção em curso e contactos
          novos por responder.
        </p>
      </header>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {CARTOES.map(({ chave, label, Icone, rota }) => (
          <Link
            key={chave}
            to={rota}
            className="rounded-[1.25rem] border border-border bg-card p-6 transition-colors hover:border-foreground/30"
          >
            <Icone className="h-5 w-5 text-accent" />
            <p className="mt-5 font-display text-[2.2rem] leading-none">
              {porEstado[chave]?.count || 0}
            </p>
            <p className="mt-2 text-[0.9rem] text-muted-foreground">{label}</p>
          </Link>
        ))}

        <Link
          to="/admin/contactos"
          className="rounded-[1.25rem] border border-border bg-card p-6 transition-colors hover:border-foreground/30"
        >
          <Mail className="h-5 w-5 text-accent" />
          <p className="mt-5 font-display text-[2.2rem] leading-none">{dados.leadsNovos}</p>
          <p className="mt-2 text-[0.9rem] text-muted-foreground">Contactos novos</p>
        </Link>
      </div>

      <div className="mt-6 rounded-[1.25rem] border border-border bg-card p-6">
        <p className="eyebrow">Faturação confirmada</p>
        <p className="mt-3 font-display text-[2rem] leading-none">{formatEUR(faturacao)}</p>
        <p className="mt-2 text-[0.88rem] text-muted-foreground">
          Pedidos pagos, em produção e concluídos. Valores finais, com IVA a 23% incluído.
        </p>
      </div>

      <section className="mt-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-display text-[1.5rem]">Pedidos recentes</h2>
          <Link
            to="/admin/pedidos"
            className="inline-flex items-center text-[0.9rem] text-muted-foreground transition-colors hover:text-foreground"
          >
            Ver todos os pedidos <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        {ultimos.length === 0 ? (
          <div className="mt-6 rounded-[1.25rem] border border-border bg-card p-8 text-center">
            <Inbox className="mx-auto h-6 w-6 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">
              Ainda não existem pedidos registados na loja.
            </p>
          </div>
        ) : (
          <ul className="mt-6 divide-y divide-border rounded-[1.25rem] border border-border bg-card">
            {ultimos.map((encomenda) => (
              <li
                key={encomenda.referencia}
                className="flex flex-wrap items-center justify-between gap-4 px-6 py-4"
              >
                <div>
                  <p className="text-[0.95rem] font-medium">{encomenda.referencia}</p>
                  <p className="mt-1 text-[0.82rem] text-muted-foreground">
                    {encomenda.cliente || "Cliente sem nome"} ·{" "}
                    {formatarDataHora(encomenda.data)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <EstadoBadge estado={encomenda.estado} />
                  <span className="font-display text-[1.1rem]">{formatEUR(encomenda.total)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}