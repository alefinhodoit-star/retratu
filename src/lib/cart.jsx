import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { roundEUR } from "@/lib/pricing";

const CHAVE = "retratu-carrinho";

const CartContext = createContext(null);

const lerGuardado = () => {
  try {
    const bruto = window.localStorage.getItem(CHAVE);
    const itens = bruto ? JSON.parse(bruto) : [];
    return Array.isArray(itens) ? itens : [];
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
      const existente = atual.find((i) => i.slug === item.slug);
      if (existente) {
        return atual.map((i) =>
          i.slug === item.slug ? { ...i, quantidade: i.quantidade + 1 } : i
        );
      }
      return [...atual, { ...item, quantidade: 1 }];
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