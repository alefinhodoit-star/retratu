import { db } from "@/lib/api";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2, Lock, ShoppingBag, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CartItemRow from "@/components/cart/CartItemRow";
import { IVA_TAXA, formatEUR, roundEUR } from "@/lib/pricing";
import { useCart } from "@/lib/cart";
import { useSectionNav } from "@/lib/useSectionNav";

const novaReferencia = () => `RET-${Date.now().toString(36).slice(-6).toUpperCase()}`;

const TITULOS = {
  carrinho: "O seu carrinho",
  dados: "Onde enviamos a sua galeria?",
  concluido: "Obrigado pela sua encomenda",
};

const ETIQUETAS = {
  carrinho: "Carrinho",
  dados: "Finalizar compra",
  concluido: "Encomenda registada",
};

export default function CartDrawer() {
  const { itens, quantidadeTotal, subtotal, aberto, fechar, limpar } = useCart();
  const irPara = useSectionNav();
  const [etapa, setEtapa] = useState("carrinho");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [referencia, setReferencia] = useState("");

  useEffect(() => {
    if (aberto) {
      setEtapa("carrinho");
      setErro("");
      setReferencia("");
    }
  }, [aberto]);

  useEffect(() => {
    document.body.style.overflow = aberto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [aberto]);

  const confirmar = async (evento) => {
    evento.preventDefault();
    setEnviando(true);
    setErro("");
    try {
      const codigo = novaReferencia();
      await db.entities.Order.bulkCreate(
        itens.map((item) => ({
          referencia: codigo,
          pacote_slug: item.slug,
          pacote_nome: item.nome,
          preco_base: item.preco,
          quantidade: item.quantidade,
          extras: [],
          extras_total: 0,
          total: roundEUR(item.preco * item.quantidade),
          iva_taxa: IVA_TAXA,
          nome_cliente: nome,
          email_cliente: email,
          estado: "pendente_pagamento",
          notas: `Quantidade: ${item.quantidade} · Encomenda ${codigo}`,
        }))
      );
      setReferencia(codigo);
      setEtapa("concluido");
      limpar();
    } catch (e) {
      setErro("Não foi possível registar a encomenda. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  };

  const verPacotes = () => {
    fechar();
    irPara("pacotes");
  };

  return (
    <AnimatePresence>
      {aberto && (
        <div className="fixed inset-0 z-[70] flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={fechar}
            className="absolute inset-0 bg-foreground/45 backdrop-blur-sm"
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="relative flex h-full w-full max-w-lg flex-col border-l border-border bg-background"
          >
            <header className="flex items-start justify-between gap-6 border-b border-border px-7 py-6">
              <div>
                <span className="eyebrow">{ETIQUETAS[etapa]}</span>
                <h3 className="mt-2 font-display text-[1.5rem] leading-tight">{TITULOS[etapa]}</h3>
                {etapa !== "concluido" && itens.length > 0 && (
                  <p className="mt-1 text-[0.9rem] text-muted-foreground">
                    {quantidadeTotal} {quantidadeTotal === 1 ? "artigo" : "artigos"} ·{" "}
                    {formatEUR(subtotal)} com IVA
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={fechar}
                aria-label="Fechar carrinho"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-7 py-7">
              {etapa === "carrinho" &&
                (itens.length === 0 ? (
                  <div className="flex h-full flex-col items-start justify-center py-10">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
                      <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                    </span>
                    <h4 className="mt-6 font-display text-[1.4rem] leading-tight">
                      O seu carrinho está vazio
                    </h4>
                    <p className="mt-4 text-muted-foreground">
                      Escolha um pacote ou uma opção adicional e adicione ao carrinho.
                    </p>
                    <Button onClick={verPacotes} className="mt-8 rounded-full px-7">
                      Ver pacotes e opções
                    </Button>
                  </div>
                ) : (
                  <>
                    <h4 className="font-display text-[1.15rem]">Artigos escolhidos</h4>
                    <p className="mt-2 text-[0.92rem] text-muted-foreground">
                      Ajuste as quantidades ou remova artigos. Os preços são finais, com IVA
                      à taxa legal de 23% já incluído.
                    </p>
                    <ul className="mt-8 space-y-5">
                      {itens.map((item) => (
                        <CartItemRow key={item.slug} item={item} />
                      ))}
                    </ul>
                  </>
                ))}

              {etapa === "dados" && (
                <form id="carrinho-form" onSubmit={confirmar} className="space-y-6">
                  <h4 className="font-display text-[1.15rem]">Dados de contacto</h4>
                  <div>
                    <Label htmlFor="carrinho-nome" className="eyebrow">
                      Nome completo
                    </Label>
                    <Input
                      id="carrinho-nome"
                      required
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Ana Ribeiro"
                      className="mt-3 h-12 rounded-none border-0 border-b border-border bg-transparent px-0 focus-visible:border-foreground focus-visible:ring-0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="carrinho-email" className="eyebrow">
                      E-mail
                    </Label>
                    <Input
                      id="carrinho-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ana@empresa.pt"
                      className="mt-3 h-12 rounded-none border-0 border-b border-border bg-transparent px-0 focus-visible:border-foreground focus-visible:ring-0"
                    />
                  </div>

                  <div className="rounded-2xl border border-border bg-secondary/40 p-5 text-[0.9rem] text-muted-foreground">
                    <p className="flex items-center gap-2 text-foreground">
                      <Lock className="h-4 w-4 text-accent" /> Pagamento seguro
                    </p>
                    <p className="mt-2">
                      Ao confirmar, a sua encomenda fica registada e recebe por e-mail o link de
                      pagamento de todos os artigos escolhidos, com IVA incluído.
                    </p>
                  </div>

                  {erro && <p className="text-[0.9rem] text-destructive">{erro}</p>}
                </form>
              )}

              {etapa === "concluido" && (
                <div className="flex h-full flex-col items-start justify-center py-10">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/15">
                    <Check className="h-6 w-6 text-accent" />
                  </span>
                  <h4 className="mt-6 font-display text-[1.6rem] leading-tight">
                    Encomenda {referencia} registada
                  </h4>
                  <p className="mt-4 text-muted-foreground">
                    Enviámos os próximos passos para{" "}
                    <strong className="font-medium text-foreground">{email}</strong>. Assim que o
                    pagamento estiver concluído, recebe o link para carregar as suas fotos e
                    começar a geração dos retratos.
                  </p>
                  <Button onClick={fechar} variant="outline" className="mt-8 rounded-full">
                    Voltar ao site
                  </Button>
                </div>
              )}
            </div>

            {etapa !== "concluido" && itens.length > 0 && (
              <footer className="border-t border-border bg-background px-7 py-6">
                <dl className="space-y-2 text-[0.9rem]">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">
                      Subtotal ({quantidadeTotal} {quantidadeTotal === 1 ? "artigo" : "artigos"})
                    </dt>
                    <dd>{formatEUR(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">IVA incluído (23%)</dt>
                    <dd>{formatEUR(roundEUR(subtotal - subtotal / (1 + IVA_TAXA / 100)))}</dd>
                  </div>
                  <div className="flex items-baseline justify-between border-t border-border pt-3">
                    <dt className="font-medium">Total com IVA</dt>
                    <dd className="font-display text-[1.6rem]">{formatEUR(subtotal)}</dd>
                  </div>
                </dl>

                {etapa === "carrinho" ? (
                  <Button
                    onClick={() => setEtapa("dados")}
                    className="mt-5 h-14 w-full rounded-full py-6 text-[1rem]"
                  >
                    Finalizar compra
                  </Button>
                ) : (
                  <div className="mt-5 space-y-3">
                    <Button
                      type="submit"
                      form="carrinho-form"
                      disabled={enviando}
                      className="h-14 w-full rounded-full py-6 text-[1rem]"
                    >
                      {enviando ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> A registar…
                        </>
                      ) : (
                        `Confirmar encomenda · ${formatEUR(subtotal)}`
                      )}
                    </Button>
                    <button
                      type="button"
                      onClick={() => setEtapa("carrinho")}
                      className="w-full text-[0.85rem] text-muted-foreground underline-offset-4 hover:underline"
                    >
                      Voltar ao carrinho
                    </button>
                  </div>
                )}
              </footer>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}