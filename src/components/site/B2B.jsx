import { useState } from "react";
import { Image } from "@/components/ui/image";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MEDIA } from "@/lib/media";
import { useLeadSubmit } from "@/lib/useLeadSubmit";
import { esquemaEmpresa } from "@/lib/leads";
import { validarFormulario } from "@/lib/validacao";

const CAMPO =
  "mt-3 h-12 rounded-none border-0 border-b border-background/40 bg-transparent px-0 text-background placeholder:text-background/60 focus-visible:border-b-2 focus-visible:border-accent focus-visible:ring-0";

const GARANTIAS = [
  "Preço por retrato final aprovado — sem pacotes de créditos nem mensalidades.",
  "Padronização de luz, fundo e vestuário para toda a equipa.",
  "Fatura com IVA incluído e condições próprias para volume.",
];

export default function B2B() {
  const { enviar, enviando, sucesso, erro } = useLeadSubmit();
  const [form, setForm] = useState({
    nome: "",
    empresa: "",
    colaboradores: "",
    email: "",
  });
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
    const { erros: invalidos, dados } = validarFormulario(esquemaEmpresa(), form);
    setErros(invalidos);
    if (!dados) return;
    await enviar({ ...dados, origem: "empresa" });
  };

  return (
    <section id="empresas" className="scroll-mt-24 bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
        <div className="grid gap-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
          <div>
            <span className="eyebrow text-background/60">Soluções B2B / Empresas</span>
            <h2 className="mt-6 text-balance font-display text-[2.1rem] leading-[1.08] text-background sm:text-[2.6rem]">
              Retratos de equipa padronizados, sem sair do escritório
            </h2>
            <p className="mt-6 max-w-xl text-background/70">
              Alinhe a imagem da sua empresa no site, nas propostas e no LinkedIn de toda a equipa.
              Tratamos cada colaborador individualmente e entregamos um conjunto visualmente
              consistente. Do lado de lá está uma pessoa: o responsável de conta acompanha o projeto
              do primeiro contacto à entrega.
            </p>

            <ul className="mt-10 space-y-4">
              {GARANTIAS.map((item) => (
                <li key={item} className="flex gap-3 text-background/80">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-12 overflow-hidden rounded-[1.75rem] border border-background/15">
              <Image
                src={MEDIA.equipa}
                alt="Conjunto de retratos corporativos de uma equipa portuguesa"
                fittingType="fill"
                className="aspect-[16/9] w-full"
              />
            </div>
            <p className="mt-4 text-[0.85rem] text-background/50">
              Exemplo de conjunto padronizado: mesma luz, mesmo fundo, mesma direção de olhar.
            </p>
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[1.5rem] border border-background/15 bg-background/5 p-7 backdrop-blur-sm lg:p-9">
              {sucesso ? (
                <div role="status" aria-live="polite">
                  <h3 className="font-display text-[1.5rem] text-background">Pedido recebido</h3>
                  <p className="mt-4 text-background/70">
                    Obrigado{form.nome ? `, ${form.nome.split(" ")[0]}` : ""}. A nossa equipa
                    comercial responde em até um dia útil com uma proposta por retrato final
                    aprovado — e sem compromisso.
                  </p>
                  <p className="mt-4 text-[0.85rem] text-background/50">
                    Se preferir, escreva diretamente para{" "}
                    <a href="mailto:ola@retratu.pt" className="underline underline-offset-4">
                      ola@retratu.pt
                    </a>
                    .
                  </p>
                </div>
              ) : (
                <form onSubmit={submeter} className="space-y-7">
                  <div>
                    <h3 className="font-display text-[1.5rem] text-background">
                      Pedir proposta para a minha equipa
                    </h3>
                    <p className="mt-2 text-[0.9rem] text-background/60">
                      Resposta em até 1 dia útil, por uma pessoa da equipa.
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="b2b-empresa" className="eyebrow text-background/60">
                      Nome da Empresa
                    </Label>
                    <Input
                      id="b2b-empresa"
                      required
                      autoComplete="organization"
                      value={form.empresa}
                      onChange={atualizar("empresa")}
                      placeholder="Nome da empresa"
                      aria-invalid={Boolean(erros.empresa)}
                      aria-describedby={erros.empresa ? "b2b-empresa-erro" : undefined}
                      className={CAMPO}
                    />
                    {erros.empresa && (
                      <p id="b2b-empresa-erro" role="alert" className="mt-2 text-[0.85rem] text-accent">
                        {erros.empresa}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="b2b-colaboradores" className="eyebrow text-background/60">
                      Nº de Colaboradores
                    </Label>
                    <Input
                      id="b2b-colaboradores"
                      required
                      inputMode="numeric"
                      value={form.colaboradores}
                      onChange={atualizar("colaboradores")}
                      placeholder="Ex.: 25"
                      aria-invalid={Boolean(erros.colaboradores)}
                      aria-describedby={erros.colaboradores ? "b2b-colaboradores-erro" : undefined}
                      className={CAMPO}
                    />
                    {erros.colaboradores && (
                      <p
                        id="b2b-colaboradores-erro"
                        role="alert"
                        className="mt-2 text-[0.85rem] text-accent"
                      >
                        {erros.colaboradores}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="b2b-email" className="eyebrow text-background/60">
                      E-mail corporativo
                    </Label>
                    <Input
                      id="b2b-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={form.email}
                      onChange={atualizar("email")}
                      placeholder="nome@empresa.pt"
                      aria-invalid={Boolean(erros.email)}
                      aria-describedby={erros.email ? "b2b-email-erro" : undefined}
                      className={CAMPO}
                    />
                    {erros.email && (
                      <p id="b2b-email-erro" role="alert" className="mt-2 text-[0.85rem] text-accent">
                        {erros.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="b2b-nome" className="eyebrow text-background/60">
                      O seu nome
                    </Label>
                    <Input
                      id="b2b-nome"
                      required
                      autoComplete="name"
                      value={form.nome}
                      onChange={atualizar("nome")}
                      placeholder="Nome do contacto"
                      aria-invalid={Boolean(erros.nome)}
                      aria-describedby={erros.nome ? "b2b-nome-erro" : undefined}
                      className={CAMPO}
                    />
                    {erros.nome && (
                      <p id="b2b-nome-erro" role="alert" className="mt-2 text-[0.85rem] text-accent">
                        {erros.nome}
                      </p>
                    )}
                  </div>

                  {erro && (
                    <p role="alert" className="text-[0.9rem] text-accent">
                      {erro}
                    </p>
                  )}

                  <Button
                    type="submit"
                    disabled={enviando}
                    aria-busy={enviando}
                    className="h-14 w-full rounded-full bg-accent text-[1rem] text-accent-foreground hover:bg-accent/90"
                  >
                    {enviando ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> A
                        enviar…
                      </>
                    ) : (
                      "Pedir proposta"
                    )}
                  </Button>
                  <p className="text-[0.78rem] leading-relaxed text-background/50">
                    Usamos os seus dados apenas para preparar e enviar a proposta. Sem listas de
                    marketing.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}