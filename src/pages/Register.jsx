import { db } from "@/lib/api";

import React, { useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Mail, Lock, Loader2 } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import AuthLayout from "@/components/AuthLayout";
import GoogleIcon from "@/components/GoogleIcon";
import { toast } from "@/components/ui/use-toast";
import { safeReturnTo } from "@/lib/authReturnTo";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("As palavras-passe não coincidem. Verifique os dois campos.");
      return;
    }
    setLoading(true);
    try {
      const resultado = await db.auth.register({ email, password });
      // Em modo local a conta fica com sessão aberta e não há e-mail de
      // confirmação para esperar; só se houver verificação é que mostramos o OTP.
      if (resultado?.sessaoIniciada) {
        window.location.href = safeReturnTo();
        return;
      }
      setShowOtp(true);
    } catch (err) {
      setError(err.message || "Não foi possível criar a conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await db.auth.verifyOtp({ email, otpCode });
      if (result?.access_token) {
        db.auth.setToken(result.access_token);
      }
      window.location.href = safeReturnTo();
    } catch {
      setError("Código inválido ou expirado. Pode pedir um novo código abaixo.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    try {
      await db.auth.resendOtp(email);
      toast({
        title: "Código reenviado",
        description: "Verifique a sua caixa de entrada e a pasta de spam.",
      });
    } catch (err) {
      setError(err.message || "Não foi possível reenviar o código. Tente novamente.");
    }
  };

  const handleGoogle = async () => {
    setError("");
    try {
      await db.auth.loginWithProvider("google", safeReturnTo());
    } catch (err) {
      setError(err.message || "O início de sessão com Google não está disponível.");
    }
  };

  // Marca o campo de confirmação quando o erro apresentado é a divergência entre as palavras-passe.
  const senhasDiferentes = Boolean(error) && confirmPassword.length > 0 && password !== confirmPassword;

  if (showOtp) {
    return (
      <AuthLayout
        icon={Mail}
        title="Confirme o seu e-mail"
        subtitle={`Enviámos um código de 6 dígitos para ${email}.`}
      >
        {error && (
          <div
            id="erro-otp"
            role="alert"
            className="mb-4 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-[0.88rem] text-destructive"
          >
            {error}
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleVerify();
          }}
        >
          <div className="mb-6 flex justify-center">
            <InputOTP
              maxLength={6}
              value={otpCode}
              onChange={setOtpCode}
              autoFocus
              autoComplete="one-time-code"
              aria-label="Código de verificação de 6 dígitos"
              aria-invalid={error ? "true" : undefined}
              aria-describedby={error ? "erro-otp" : undefined}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <Button
            type="submit"
            className="h-12 w-full rounded-full font-medium"
            disabled={loading || otpCode.length < 6}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                A verificar…
              </>
            ) : (
              "Verificar e continuar"
            )}
          </Button>
        </form>
        <p className="mt-5 text-center text-[0.88rem] text-muted-foreground">
          Não recebeu o código?{" "}
          <button
            type="button"
            onClick={handleResend}
            className="-my-2 inline-flex min-h-11 items-center px-1 font-medium text-foreground underline decoration-accent underline-offset-4 hover:decoration-2"
          >
            Reenviar
          </button>
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      icon={UserPlus}
      title="Crie a sua conta"
      subtitle="Leva menos de um minuto. Depois é só escolher o pacote e enviar as fotografias."
      footer={
        <>
          Já tem conta?{" "}
          <Link
            to={"/login" + (safeReturnTo() !== "/" ? "?returnTo=" + encodeURIComponent(safeReturnTo()) : "")}
            className="font-medium text-foreground underline decoration-accent underline-offset-4 hover:decoration-2"
          >
            Entrar
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
          id="erro-registo"
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
              aria-describedby={error ? "erro-registo" : undefined}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Palavra-passe</Label>
          <div className="relative">
            <Lock
              className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 pl-10"
              aria-invalid={error ? "true" : undefined}
              aria-describedby={error ? "erro-registo" : undefined}
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
              aria-describedby={senhasDiferentes ? "erro-registo" : undefined}
              required
            />
          </div>
        </div>
        <Button type="submit" className="h-12 w-full rounded-full font-medium" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              A criar conta…
            </>
          ) : (
            "Criar conta"
          )}
        </Button>
      </form>

      <p className="mt-5 text-center text-[0.78rem] leading-relaxed text-muted-foreground">
        Ao criar conta aceita os{" "}
        <Link to="/termos" className="underline underline-offset-4 hover:text-foreground">
          Termos
        </Link>{" "}
        e a{" "}
        <Link to="/privacidade" className="underline underline-offset-4 hover:text-foreground">
          Política de Privacidade
        </Link>
        .
      </p>
    </AuthLayout>
  );
}
