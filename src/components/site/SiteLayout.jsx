import { db } from "@/api/base44Client";

import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import CartDrawer from "@/components/cart/CartDrawer";

export default function SiteLayout() {
  const [user, setUser] = useState(null);

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
      <CartDrawer />
    </div>
  );
}