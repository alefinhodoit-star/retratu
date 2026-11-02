import { db } from "@/api/base44Client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2, LogOut, Mail, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatEUR } from "@/lib/pricing";
import { cn } from "@/lib/utils";

const ESTADOS = {
  pendente_pagamento: "Pendente de pagamento",
  pago: "Pago",
  em_producao: "Em produção",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

const CORES_ESTADO = {
  pendente_pagamento: "bg-accent/15 text-foreground",
  pago: "bg-secondary text-foreground",
  em_producao: "bg-foreground text-background",
  concluido: "bg-accent/20 text-foreground",
  cancelado: "bg-destructive/10 text-destructive",
};

const formatarData = (valor) =>
  valor ? new Date(valor).toLocaleDateString("pt-PT", { day: "2-digit", month: "short", year: "numeric" }) : "";

export default function Conta() {
  const [user, setUser] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const atual = await db.auth.me();
        setUser(atual);
        const res = await db.entities.Order.filter(
          { created_by_id: atual.id },
          { sort: "-created_date", limit: 50 }
        );
        setPedidos(res.items);
      } finally {
        setCarregando(false);
      }
    })();
  }, []);

  const terminarSessao = async () => {
    await db.auth.logout();
    window.location.href = "/";
  };

  return (
    <div className="mx-auto max-w-4xl px-6 pb-24 pt-16 lg:pt-20">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <span className="eyebrow">Minha conta</span>
          <h1 className="mt-5 font-display text-[2.2rem] leading-tight">
            {user?.full_name ? `Olá, ${user.full_name.split(" ")[0]}` : "Bem-vindo de volta"}
          </h1>
          <p className="mt-4 text-muted-foreground">
            Consulte aqui os seus pedidos de retratos e as opções contratadas. Qualquer dúvida,
            estamos a um e-mail de distância.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {user?.role === "admin" && (
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/admin">
                <ShieldCheck className="mr-2 h-4 w-4" /> Área de administração
              </Link>
            </Button>
          )}
          <Button variant="ghost" onClick={terminarSessao} className="rounded-full">
            <LogOut className="mr-2 h-4 w-4" /> Terminar sessão
          </Button>
        </div>
      </div>

      <div className="mt-14">
        {carregando ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : pedidos.length === 0 ? (
          <div className="rounded-[1.5rem] border border-border bg-card p-9 text-center">
            <h2 className="font-display text-[1.5rem]">Ainda não tem pedidos</h2>
            <p className="mx-auto mt-4 max-w-md text-muted-foreground">
              Escolha um pacote e comece a gerar os seus retratos profissionais. A partir de 24,90 €
              com IVA incluído — e sem subscrição.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild className="rounded-full px-7">
                <Link to="/#pacotes">
                  Escolher pacote <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full px-7">
                <Link to="/#contactos">Falar connosco</Link>
              </Button>
            </div>
          </div>
        ) : (
          <ul className="space-y-5">
            {pedidos.map((pedido) => (
              <li
                key={pedido.id}
                className="flex flex-wrap items-center justify-between gap-6 rounded-[1.25rem] border border-border bg-card p-6"
              >
                <div>
                  <h2 className="font-display text-[1.25rem]">{pedido.pacote_nome}</h2>
                  <p className="mt-1 text-[0.85rem] text-muted-foreground">
                    {formatarData(pedido.created_date)}
                    {pedido.extras?.length > 0
                      ? ` · ${pedido.extras.length} opções adicionais`
                      : ""}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-display text-[1.4rem]">{formatEUR(pedido.total)}</div>
                  <span
                    className={cn(
                      "mt-1 inline-block rounded-full px-2.5 py-0.5 text-[0.7rem] uppercase tracking-[0.12em]",
                      CORES_ESTADO[pedido.estado] || "bg-secondary text-muted-foreground"
                    )}
                  >
                    {ESTADOS[pedido.estado] || pedido.estado}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-[1.25rem] border border-border bg-secondary/40 p-6 text-[0.9rem] text-muted-foreground">
        <span className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-accent" />
          Precisa de ajuda com um pedido?
        </span>
        <a
          href="mailto:ola@retratu.pt"
          className="font-medium text-foreground underline decoration-accent decoration-1 underline-offset-4 hover:decoration-2"
        >
          ola@retratu.pt
        </a>
      </div>
    </div>
  );
}
