import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Clock, Loader2, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLeadSubmit } from "@/lib/useLeadSubmit";
import { esquemaContacto } from "@/lib/leads";
import { validarFormulario } from "@/lib/validacao";

const CAMPO =
  "mt-3 h-12 rounded-none border-0 border-b border-border bg-transparent px-0 focus-visible:border-b-2 focus-visible:border-foreground focus-visible:ring-0";

export default function Contact() {
  const { enviar, enviando, sucesso, erro } = useLeadSubmit();
  const [form, setForm] = useState({ nome: "", email: "", mensagem: "" });
  const [erros, setErros] = useState({});

  const atualizar = (campo) => (e) => {
    const { value } = e.target;
    setForm((atual) => ({ ...atual, [campo]: value }));
    // Limpa o erro do campo assim que este volta a ser editado.
    setErros((atual) => (atual[campo] ? { ...atual, [campo]: "" } : atual));
  };

  const submeter = async (e) => {
    e.preventDefault();
    // O `required` do HTML é apenas UX: um POST direto ignora-o.
    const { erros: invalidos, dados } = validarFormulario(esquemaContacto(), form);
    setErros(invalidos);
    if (!dados) return;
    await enviar({ ...dados, origem: "contacto" });
  };

  return (
    <section id="contactos" className="scroll-mt-24 border-t border-border">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 py-20 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24 lg:py-28">
        <div>
          <span className="eyebrow">Contactos</span>
          <h2 className="section-title">Dúvidas antes de encomendar?</h2>
          <p className="section-lede max-w-md">
            Escreva-nos e respondemos com todos os detalhes sobre pacotes, prazos, faturação com IVA
            e condições para empresas. Quem responde é uma pessoa da equipa, em português.
          </p>

          <dl className="mt-10 space-y-5 border-t border-border pt-8 text-[0.95rem]">
            <div>
              <dt className="flex items-center gap-2 font-medium text-foreground">
                <Mail className="h-4 w-4 shrink-0 text-accent" strokeWidth={1.7} aria-hidden="true" />
                E-mail
              </dt>
              <dd className="mt-1 pl-6 text-muted-foreground">
                <a
                  href="mailto:ola@retratu.pt"
                  className="underline decoration-accent decoration-1 underline-offset-4 transition-all hover:decoration-2"
                >
                  ola@retratu.pt
                </a>
              </dd>
            </div>
            <div>
              <dt className="flex items-center gap-2 font-medium text-foreground">
                <Clock className="h-4 w-4 shrink-0 text-accent" strokeWidth={1.7} aria-hidden="true" />
                Horário
              </dt>
              <dd className="mt-1 pl-6 text-muted-foreground">
                Segunda a sexta, 9h–18h (hora de Lisboa)
              </dd>
            </div>
            <div>
              <dt className="flex items-center gap-2 font-medium text-foreground">
                <MessageCircle
                  className="h-4 w-4 shrink-0 text-accent"
                  strokeWidth={1.7}
                  aria-hidden="true"
                />
                Tempo de resposta
              </dt>
              <dd className="mt-1 pl-6 text-muted-foreground">
                Normalmente no mesmo dia útil — nunca mais de 1 dia.
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-[1.5rem] border border-border bg-card p-7 lg:p-10">
          {sucesso ? (
            <div role="status" aria-live="polite" className="flex h-full flex-col justify-center py-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/15">
                <Check className="h-5 w-5 text-accent" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-display text-[1.5rem]">Mensagem enviada</h3>
              <p className="mt-3 text-muted-foreground">
                Obrigado pelo contacto. Vamos responder para{" "}
                <strong className="font-medium text-foreground">{form.email}</strong> em até 1 dia
                útil. Se for urgente, escreva diretamente para{" "}
                <a href="mailto:ola@retratu.pt" className="underline underline-offset-4">
                  ola@retratu.pt
                </a>
                .
              </p>
            </div>
          ) : (
            <form onSubmit={submeter} className="space-y-7">
              <div className="grid gap-7 sm:grid-cols-2">
                <div>
                  <Label htmlFor="contacto-nome" className="eyebrow">
                    Nome
                  </Label>
                  <Input
                    id="contacto-nome"
                    required
                    autoComplete="name"
                    value={form.nome}
                    onChange={atualizar("nome")}
                    placeholder="O seu nome"
                    aria-invalid={Boolean(erros.nome)}
                    aria-describedby={erros.nome ? "contacto-nome-erro" : undefined}
                    className={CAMPO}
                  />
                  {erros.nome && (
                    <p id="contacto-nome-erro" role="alert" className="mt-2 text-[0.85rem] text-destructive">
                      {erros.nome}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="contacto-email" className="eyebrow">
                    E-mail
                  </Label>
                  <Input
                    id="contacto-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={form.email}
                    onChange={atualizar("email")}
                    placeholder="nome@email.pt"
                    aria-invalid={Boolean(erros.email)}
                    aria-describedby={erros.email ? "contacto-email-erro" : undefined}
                    className={CAMPO}
                  />
                  {erros.email && (
                    <p id="contacto-email-erro" role="alert" className="mt-2 text-[0.85rem] text-destructive">
                      {erros.email}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="contacto-mensagem" className="eyebrow">
                  Mensagem
                </Label>
                <Textarea
                  id="contacto-mensagem"
                  required
                  rows={5}
                  value={form.mensagem}
                  onChange={atualizar("mensagem")}
                  placeholder="Conte-nos o que precisa — quanto mais contexto, melhor o conseguimos ajudar."
                  aria-invalid={Boolean(erros.mensagem)}
                  aria-describedby={erros.mensagem ? "contacto-mensagem-erro" : undefined}
                  className="mt-3 rounded-none border-0 border-b border-border bg-transparent px-0 focus-visible:border-b-2 focus-visible:border-foreground focus-visible:ring-0"
                />
                {erros.mensagem && (
                  <p id="contacto-mensagem-erro" role="alert" className="mt-2 text-[0.85rem] text-destructive">
                    {erros.mensagem}
                  </p>
                )}
              </div>

              {erro && (
                <p role="alert" className="text-[0.9rem] text-destructive">
                  {erro}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-5">
                <Button
                  type="submit"
                  disabled={enviando}
                  aria-busy={enviando}
                  className="h-14 rounded-full px-8 text-[1rem]"
                >
                  {enviando ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> A enviar…
                    </>
                  ) : (
                    "Enviar mensagem"
                  )}
                </Button>
                <p className="max-w-60 text-[0.78rem] leading-relaxed text-muted-foreground">
                  Usamos os seus dados apenas para responder. Consulte a{" "}
                  <Link to="/privacidade" className="underline underline-offset-4 hover:text-foreground">
                    Política de Privacidade
                  </Link>
                  .
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
