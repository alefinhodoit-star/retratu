import { db } from "@/lib/api";

import React, { useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Mail, Lock, Loader2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import GoogleIcon from "@/components/GoogleIcon";
import { safeReturnTo } from "@/lib/authReturnTo";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // Post-login destination (e.g. the MCP OAuth consent page sends users here
  // with returnTo so the grant flow can resume). Same-origin paths only.
  const returnTo = safeReturnTo();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await db.auth.loginViaEmailPassword(email, password);
      window.location.href = returnTo;
    } catch {
      setError("Não foi possível entrar. Confirme o e-mail e a palavra-passe.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    try {
      await db.auth.loginWithProvider("google", returnTo);
    } catch (err) {
      setError(err.message || "O início de sessão com Google não está disponível.");
    }
  };

  return (
    <AuthLayout
      icon={LogIn}
      title="Bem-vindo de volta"
      subtitle="Entre na sua conta para acompanhar pedidos e descarregar os seus retratos."
      footer={
        <>
          Ainda não tem conta?{" "}
          <Link
            to={"/register" + (returnTo !== "/" ? "?returnTo=" + encodeURIComponent(returnTo) : "")}
            className="font-medium text-foreground underline decoration-accent underline-offset-4 hover:decoration-2"
          >
            Criar conta
          </Link>
        </>
      }
    >
      <Button
        variant="outline"
        className="mb-6 h-12 w-full rounded-full text-sm font-medium"
        onClick={handleGoogle}
      >
        <GoogleIcon className="mr-2 h-5 w-5" />
        Continuar com Google
      </Button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-[0.7rem] uppercase tracking-[0.18em]">
          <span className="bg-card px-3 text-muted-foreground">ou</span>
        </div>
      </div>

      {error && (
        <div
          id="erro-login"
          role="alert"
          className="mb-4 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-[0.88rem] text-destructive"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <div className="relative">
            <Mail
              className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              autoFocus
              placeholder="nome@email.pt"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 pl-10"
              aria-invalid={error ? "true" : undefined}
              aria-describedby={error ? "erro-login" : undefined}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="password">Palavra-passe</Label>
            <Link
              to="/forgot-password"
              className="text-[0.8rem] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Esqueceu-se?
            </Link>
          </div>
          <div className="relative">
            <Lock
              className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 pl-10"
              aria-invalid={error ? "true" : undefined}
              aria-describedby={error ? "erro-login" : undefined}
              required
            />
          </div>
        </div>
        <Button type="submit" className="h-12 w-full rounded-full font-medium" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              A entrar…
            </>
          ) : (
            "Entrar"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}
