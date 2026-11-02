import { db } from "@/api/base44Client";

import { useEffect, useState } from "react";
import { Inbox, Loader2, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PedidoCard from "@/components/admin/PedidoCard";
import { FILTROS_PEDIDO, agruparEncomendas } from "@/lib/admin";
import { cn } from "@/lib/utils";

const POR_PAGINA = 20;

export default function Pedidos() {
  const [filtro, setFiltro] = useState("todos");
  const [termo, setTermo] = useState("");
  const [pedidos, setPedidos] = useState([]);
  const [contagens, setContagens] = useState({});
  const [cursor, setCursor] = useState(null);
  const [temMais, setTemMais] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [aCarregarMais, setACarregarMais] = useState(false);

  const carregar = async ({ acumular = false } = {}) => {
    if (acumular) setACarregarMais(true);
    else setCarregando(true);

    const query = {};
    if (filtro !== "todos") query.estado = filtro;
    const texto = termo.trim();
    if (texto) {
      query.$or = [
        { referencia: { $regex: texto, $options: "i" } },
        { nome_cliente: { $regex: texto, $options: "i" } },
        { email_cliente: { $regex: texto, $options: "i" } },
        { notas: { $regex: texto, $options: "i" } },
      ];
    }

    const pagina = await db.entities.Order.filter(query, {
      sort: "-created_date",
      limit: POR_PAGINA,
      ...(acumular && cursor ? { cursor } : {}),
    });

    setPedidos((atual) => (acumular ? [...atual, ...pagina.items] : pagina.items));
    setCursor(pagina.next_cursor);
    setTemMais(Boolean(pagina.has_more));

    if (acumular) setACarregarMais(false);
    else setCarregando(false);

    const resumo = await db.entities.Order.aggregate({ groupBy: "estado" });
    setContagens(
      Object.fromEntries((resumo.rows || []).map((linha) => [linha.estado, linha.count]))
    );
  };

  useEffect(() => {
    const temporizador = setTimeout(() => carregar(), 250);
    return () => clearTimeout(temporizador);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtro, termo]);

  const encomendas = agruparEncomendas(pedidos);

  return (
    <div>
      <header>
        <span className="eyebrow">Administração</span>
        <h1 className="mt-4 font-display text-[2.2rem] leading-tight">Pedidos</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Aprove os pedidos recebidos, avance o estado da produção e consulte o histórico de cada
          encomenda.
        </p>
      </header>

      <div className="mt-8 flex flex-wrap gap-2">
        {FILTROS_PEDIDO.map((opcao) => (
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
          placeholder="Procurar por referência, nome ou e-mail"
          className="h-12 rounded-none border-0 border-b border-border bg-transparent pl-7 focus-visible:border-foreground focus-visible:ring-0"
        />
      </div>

      {carregando ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : encomendas.length === 0 ? (
        <div className="mt-8 rounded-[1.25rem] border border-border bg-card p-10 text-center">
          <Inbox className="mx-auto h-6 w-6 text-muted-foreground" />
          <h2 className="mt-5 font-display text-[1.4rem]">Nenhum pedido encontrado</h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Não há pedidos com estes filtros. Experimente outro estado ou limpe a pesquisa.
          </p>
        </div>
      ) : (
        <>
          <ul className="mt-8 space-y-5">
            {encomendas.map((encomenda) => (
              <PedidoCard
                key={encomenda.referencia}
                encomenda={encomenda}
                aoAlterar={() => carregar()}
              />
            ))}
          </ul>

          {temMais && (
            <div className="mt-8 flex justify-center">
              <Button
                type="button"
                variant="outline"
                disabled={aCarregarMais}
                onClick={() => carregar({ acumular: true })}
                className="rounded-full px-7"
              >
                {aCarregarMais ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Carregar mais pedidos"
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}