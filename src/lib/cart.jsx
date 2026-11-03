import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { roundEUR } from "@/lib/pricing";

const CHAVE = "retratu-carrinho";
const MAX_ITENS = 50;

const CartContext = createContext(null);

// O carrinho vem do localStorage e é editável pelo utilizador. Validar a forma
// antes de usar evita totais NaN (ex.: preco textual) e quantidades fora dos
// limites do checkout. Os preços continuam a ter de ser recalculados no backend.
const numeroGuardado = z.preprocess(
  (valor) => (typeof valor === "string" && valor.trim() !== "" ? Number(valor) : valor),
  z.number().finite()
);

const itemCarrinho = z.object({
  slug: z.string().trim().min(1).max(120),
  nome: z.string().trim().min(1).max(200),
  preco: numeroGuardado.pipe(z.number().positive().max(100000)),
  tipo: z.enum(["pacote", "extra"]),
  quantidade: numeroGuardado.pipe(z.number().int().min(1).max(10)),
});

const lerGuardado = () => {
  try {
    const bruto = window.localStorage.getItem(CHAVE);
    if (!bruto) return [];
    const dados = JSON.parse(bruto);
    if (!Array.isArray(dados)) return [];
    // Itens inválidos são descartados individualmente, sem perder o resto.
    return dados.slice(0, MAX_ITENS).flatMap((item) => {
      const resultado = itemCarrinho.safeParse(item);
      return resultado.success ? [resultado.data] : [];
    });
  } catch {
    return [];
  }
};

export function CartProvider({ children }) {
  const [itens, setItens] = useState(lerGuardado);
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(CHAVE, JSON.stringify(itens));
  }, [itens]);

  const adicionar = (item) =>
    setItens((atual) => {
      // Só entra no carrinho o que respeitar o mesmo contrato usado na leitura,
      // incluindo preços que cheguem do backend como string numérica.
      const valido = itemCarrinho.omit({ quantidade: true }).safeParse(item);
      if (!valido.success) return atual;
      const novo = { ...valido.data, quantidade: 1 };
      const existente = atual.find((i) => i.slug === novo.slug);
      if (existente) {
        return atual.map((i) =>
          i.slug === novo.slug
            ? { ...i, quantidade: Math.min(10, i.quantidade + 1) }
            : i
        );
      }
      return [...atual, novo];
    });

  const alterarQuantidade = (slug, quantidade) =>
    setItens((atual) =>
      atual.map((i) =>
        i.slug === slug ? { ...i, quantidade: Math.max(1, Math.min(10, quantidade)) } : i
      )
    );

  const remover = (slug) => setItens((atual) => atual.filter((i) => i.slug !== slug));

  const limpar = () => setItens([]);

  const quantidadeTotal = itens.reduce((soma, i) => soma + i.quantidade, 0);
  const subtotal = roundEUR(itens.reduce((soma, i) => soma + i.preco * i.quantidade, 0));

  const valor = useMemo(
    () => ({
      itens,
      adicionar,
      alterarQuantidade,
      remover,
      limpar,
      quantidadeTotal,
      subtotal,
      aberto,
      abrir: () => setAberto(true),
      fechar: () => setAberto(false),
    }),
    [itens, quantidadeTotal, subtotal, aberto]
  );

  return <CartContext.Provider value={valor}>{children}</CartContext.Provider>;
}

export function useCart() {
  const contexto = useContext(CartContext);
  if (!contexto) throw new Error("useCart tem de ser usado dentro de CartProvider");
  return contexto;
}