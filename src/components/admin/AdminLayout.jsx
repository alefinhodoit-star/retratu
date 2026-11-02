import { db } from "@/api/base44Client";

import { Link, NavLink, Outlet } from "react-router-dom";
import { ArrowLeft, Inbox, LayoutDashboard, Mail, Store, Tag } from "lucide-react";

import { useAuth } from "@/lib/AuthContext";
import { cn } from "@/lib/utils";

const LINKS = [
  { para: "/admin", label: "Painel", Icone: LayoutDashboard, fim: true },
  { para: "/admin/pedidos", label: "Pedidos", Icone: Inbox },
  { para: "/admin/contactos", label: "Contactos", Icone: Mail },
  { para: "/admin/pacotes", label: "Pacotes", Icone: Tag },
  { para: "/admin/loja", label: "Loja", Icone: Store },
];

export default function AdminLayout() {
  const { user } = useAuth();

  const terminarSessao = async () => {
    await db.auth.logout();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-secondary/30 lg:flex">
      <aside className="border-b border-border bg-background lg:min-h-screen lg:w-72 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-4 px-6 py-5 lg:block lg:py-8">
          <div>
            <span className="eyebrow">Retratu</span>
            <p className="mt-2 font-display text-[1.4rem] leading-none">Administração</p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center text-[0.85rem] text-muted-foreground transition-colors hover:text-foreground lg:mt-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Site
          </Link>
        </div>

        <nav className="flex gap-2 overflow-x-auto px-6 pb-5 lg:mt-2 lg:flex-col lg:gap-1 lg:overflow-visible">
          {LINKS.map(({ para, label, Icone, fim }) => (
            <NavLink
              key={para}
              to={para}
              end={fim}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 whitespace-nowrap rounded-full px-4 py-2.5 text-[0.95rem] transition-colors lg:rounded-xl",
                  isActive
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )
              }
            >
              <Icone className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1 px-6 py-10 lg:px-12 lg:py-12">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-wrap items-center justify-between gap-3 text-[0.85rem] text-muted-foreground">
            <span>{user?.email}</span>
            <button
              type="button"
              onClick={terminarSessao}
              className="transition-colors hover:text-foreground"
            >
              Terminar sessão
            </button>
          </div>
          <div className="mt-10">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}