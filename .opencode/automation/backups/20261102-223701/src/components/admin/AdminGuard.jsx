import { Link, Navigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";

export default function AdminGuard() {
  const { user, isLoadingAuth, isAuthenticated } = useAuth();

  if (isLoadingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (user?.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="max-w-md text-center">
          <span className="eyebrow">Área reservada</span>
          <h1 className="mt-5 font-display text-[2rem] leading-tight">
            Acesso restrito a administradores
          </h1>
          <p className="mt-4 text-muted-foreground">
            Esta área é da equipa Retratu. Se precisar de acesso, peça ao administrador da aplicação
            para lhe dar esse perfil.
          </p>
          <Button asChild className="mt-8 rounded-full px-7">
            <Link to="/">Voltar ao site</Link>
          </Button>
        </div>
      </div>
    );
  }

  return <Outlet />;
}