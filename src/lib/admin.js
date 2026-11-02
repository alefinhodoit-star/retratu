import { roundEUR } from "@/lib/pricing";

export const ESTADOS_PEDIDO = {
  pendente_pagamento: {
    label: "Pendente de pagamento",
    badge: "border-accent/60 bg-accent/10 text-foreground",
    acao: "Aprovar pedido",
    proximo: "pago",
  },
  pago: {
    label: "Pago",
    badge: "border-foreground/20 bg-secondary text-foreground",
    acao: "Iniciar produção",
    proximo: "em_producao",
  },
  em_producao: {
    label: "Em produção",
    badge: "border-transparent bg-accent/20 text-foreground",
    acao: "Marcar como concluído",
    proximo: "concluido",
  },
  concluido: {
    label: "Concluído",
    badge: "border-transparent bg-foreground text-background",
  },
  cancelado: {
    label: "Cancelado",
    badge: "border-border bg-transparent text-muted-foreground",
  },
};

export const FILTROS_PEDIDO = [
  { valor: "todos", label: "Todos" },
  { valor: "pendente_pagamento", label: "Por aprovar" },
  { valor: "pago", label: "Pagos" },
  { valor: "em_producao", label: "Em produção" },
  { valor: "concluido", label: "Concluídos" },
  { valor: "cancelado", label: "Cancelados" },
];

export const ESTADOS_LEAD = [
  { valor: "novo", label: "Novo" },
  { valor: "contactado", label: "Contactado" },
  { valor: "convertido", label: "Convertido" },
  { valor: "perdido", label: "Perdido" },
];

export const labelLead = (valor) =>
  ESTADOS_LEAD.find((estado) => estado.valor === valor)?.label || valor;

export const formatarDataHora = (valor) =>
  valor
    ? new Date(valor).toLocaleString("pt-PT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

export const entradaHistorico = (de, para, quem) =>
  `${formatarDataHora(new Date().toISOString())} · ${ESTADOS_PEDIDO[de]?.label || de} → ${
    ESTADOS_PEDIDO[para]?.label || para
  } · ${quem}`;

const referenciaDe = (pedido) =>
  pedido.referencia ||
  pedido.notas?.match(/Encomenda\s+([A-Z0-9-]+)/i)?.[1] ||
  `#${String(pedido.id).slice(-6).toUpperCase()}`;

export const quantidadeItem = (item) =>
  item.quantidade || Number(item.notas?.match(/Quantidade:\s*(\d+)/i)?.[1] || 1);

export const agruparEncomendas = (pedidos) => {
  const mapa = new Map();

  pedidos.forEach((pedido) => {
    const chave = referenciaDe(pedido);
    const grupo =
      mapa.get(chave) || {
        referencia: chave,
        itens: [],
        cliente: pedido.nome_cliente || "",
        email: pedido.email_cliente || "",
        estado: pedido.estado,
        data: pedido.created_date,
        total: 0,
        historico: [],
      };
    grupo.itens.push(pedido);
    grupo.total = roundEUR(grupo.total + (pedido.total || 0));
    grupo.historico = grupo.historico.concat(pedido.historico || []);
    if (pedido.created_date < grupo.data) grupo.data = pedido.created_date;
    mapa.set(chave, grupo);
  });

  return Array.from(mapa.values());
};