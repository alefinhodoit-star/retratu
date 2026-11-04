import { db } from "@/lib/api";

import React, { useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [semServico, setSemServico] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const resultado = await db.auth.resetPasswordRequest(email);
      setSemServico(resultado?.enviado === false);
    } catch {
      // Não revelamos se a conta existe.
      setSemServico(true);
    } finally {
      setLoading(false);
      setSent(true);
    }
  };

  return (
    <AuthLayout
      icon={Mail}
      title="Recuperar palavra-passe"
      subtitle="Indique o e-mail da sua conta e enviamos um link para definir uma nova."
      footer={
        <Link
          to="/login"
          className="inline-flex min-h-11 items-center gap-1.5 font-medium text-foreground underline decoration-accent underline-offset-4 hover:decoration-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Voltar ao início de sessão
        </Link>
      }
    >
      {/* Região viva persistente: garante que a confirmação é anunciada após o envio. */}
      <p role="status" aria-live="polite" className="sr-only">
        {sent ? "Pedido enviado. Se existir uma conta com este e-mail, receberá o link em poucos minutos." : ""}
      </p>
      {sent ? (
        <div className="text-center">
          {semServico ? (
            <p className="text-[0.95rem] leading-relaxed text-muted-foreground">
              O envio de e-mail ainda não está configurado neste ambiente, por isso não é possível
              enviar o link de recuperação. Contacte-nos em{" "}
              <a
                href="mailto:contacto@retratu.pt"
                className="font-medium text-foreground underline underline-offset-4"
              >
                contacto@retratu.pt
              </a>{" "}
              e resolvemos o acesso manualmente.
            </p>
          ) : (
            <>
              <p className="text-[0.95rem] leading-relaxed text-muted-foreground">
                Se existir uma conta com{" "}
                <strong className="font-medium text-foreground">{email}</strong>, receberá o link em
                poucos minutos. Verifique também a pasta de spam.
              </p>
              <p className="mt-4 text-[0.82rem] text-muted-foreground">
                O link é válido durante 1 hora.
              </p>
            </>
          )}
        </div>
      ) : (
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
                required
              />
            </div>
          </div>
          <Button type="submit" className="h-12 w-full rounded-full font-medium" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                A enviar…
              </>
            ) : (
              "Enviar link de recuperação"
            )}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
