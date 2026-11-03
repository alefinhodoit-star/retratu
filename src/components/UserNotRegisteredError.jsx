import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ShieldAlert } from "lucide-react";

const UserNotRegisteredError = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-16">
      <div className="w-full max-w-md text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-border bg-secondary">
          <ShieldAlert className="h-6 w-6 text-foreground" strokeWidth={1.6} aria-hidden="true" />
        </span>

        <h1 className="mt-6 font-display text-[2rem] leading-tight">Acesso restrito</h1>
        <p className="mt-4 text-pretty text-muted-foreground">
          A sua conta ainda não tem acesso a esta aplicação. Peça ao administrador para o adicionar —
          normalmente resolve-se em minutos.
        </p>

        <div className="mt-8 rounded-[1.25rem] border border-border bg-card p-6 text-left">
          <p className="text-[0.85rem] font-medium text-foreground">Se acha que é um engano:</p>
          <ul className="mt-3 space-y-2 text-[0.88rem] text-muted-foreground">
            <li>· Confirme que iniciou sessão com a conta correta.</li>
            <li>· Peça acesso ao administrador da aplicação.</li>
            <li>· Termine sessão e volte a entrar.</li>
          </ul>
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex h-11 items-center justify-center rounded-full border border-border px-6 text-[0.9rem] font-medium transition-colors hover:bg-secondary"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao site
          </Link>
          <a
            href="mailto:contacto@retratu.pt"
            className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-6 text-[0.9rem] font-medium text-background transition-colors hover:bg-foreground/90"
          >
            Pedir acesso
          </a>
        </div>
      </div>
    </div>
  );
};

export default UserNotRegisteredError;
