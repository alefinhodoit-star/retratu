import { db } from "@/api/base44Client";

import { Suspense, lazy, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { useCart } from "@/lib/cart";

// O carrinho arrasta o framer-motion (~120 kB) para o bundle de entrada e só é
// usado depois de o visitante o abrir. Depois da primeira abertura fica montado
// para as animações de saída (AnimatePresence) continuarem a funcionar.
const CartDrawer = lazy(() => import("@/components/cart/CartDrawer"));

export default function SiteLayout() {
  const [user, setUser] = useState(null);
  const { aberto } = useCart();
  const [carrinhoMontado, setCarrinhoMontado] = useState(false);

  useEffect(() => {
    if (aberto) setCarrinhoMontado(true);
  }, [aberto]);

  useEffect(() => {
    let ativo = true;
    db.auth
      .me()
      .then((u) => ativo && setUser(u))
      .catch(() => ativo && setUser(null));
    return () => {
      ativo = false;
    };
  }, []);

  return (
    <div className="grain flex min-h-screen flex-col bg-background">
      <Header user={user} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {(aberto || carrinhoMontado) && (
        <Suspense fallback={null}>
          <CartDrawer />
        </Suspense>
      )}
    </div>
  );
}