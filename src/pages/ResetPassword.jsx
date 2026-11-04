import { db } from "@/lib/api";

import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Loader2, AlertTriangle } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Marca o campo de confirmação quando o erro apresentado é a divergência entre palavras-passe.
  const senhasDiferentes = Boolean(error) && confirmPassword.length > 0 && newPassword !== confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError("As palavras-passe não coincidem. Verifique os dois campos.");
      return;
    }
    setLoading(true);
    try {
      await db.auth.resetPassword({ resetToken, newPassword });
      window.location.href = "/login";
    } catch (err) {
      setError(err.message || "Não foi possível alterar a palavra-passe. O link pode ter expirado.");
    } finally {
      setLoading(false);
    }
  };

  if (!resetToken) {
    return (
      <AuthLayout
        icon={AlertTriangle}
        title="Link inválido"
        subtitle="Este link de recuperação está incompleto ou já expirou."
        footer={
          <Link
            to="/forgot-password"
            className="font-medium text-foreground underline decoration-accent underline-offset-4 hover:decoration-2"
          >
            Pedir um novo link
          </Link>
        }
      >
        <p className="text-center text-[0.95rem] leading-relaxed text-muted-foreground">
          O endereço que abriu parece estar incompleto. Peça um novo e-mail de recuperação — demora
          menos de um minuto.
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      icon={Lock}
      title="Defina uma nova palavra-passe"
      subtitle="Escolha uma palavra-passe segura, com pelo menos 8 caracteres."
    >
      {error && (
        <div
          id="erro-recuperacao"
          role="alert"
          className="mb-4 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-[0.88rem] text-destructive"
        >
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="password">Nova palavra-passe</Label>
          <div className="relative">
            <Lock
              className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              autoFocus
              placeholder="Mínimo 8 caracteres"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="h-12 pl-10"
              aria-invalid={error ? "true" : undefined}
              aria-describedby={error ? "erro-recuperacao" : undefined}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">Confirmar palavra-passe</Label>
          <div className="relative">
            <Lock
              className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="confirm"
              type="password"
              autoComplete="new-password"
              placeholder="Repita a palavra-passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-12 pl-10"
              aria-invalid={senhasDiferentes ? "true" : undefined}
              aria-describedby={senhasDiferentes ? "erro-recuperacao" : undefined}
              required
            />
          </div>
        </div>
        <Button type="submit" className="h-12 w-full rounded-full font-medium" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              A guardar…
            </>
          ) : (
            "Guardar nova palavra-passe"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}
