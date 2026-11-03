import { Link } from "react-router-dom";
import { ArrowUpRight, Clock, Mail, ShieldCheck } from "lucide-react";
import { Image } from "@/components/ui/image";
import { MEDIA } from "@/lib/media";
import { useSectionNav } from "@/lib/useSectionNav";

const NAVEGACAO = [
  { label: "Pacotes", id: "pacotes" },
  { label: "Como funciona", id: "como-funciona" },
  { label: "Exemplos", id: "exemplos" },
  { label: "Empresas", id: "empresas" },
  { label: "Sobre nós", id: "sobre" },
];

const LEGAL = [
  { label: "Termos e Condições", to: "/termos" },
  { label: "Política de Privacidade", to: "/privacidade" },
  { label: "Política de Reembolso", to: "/reembolso" },
  { label: "Minha conta", to: "/conta" },
];

export default function Footer() {
  const irPara = useSectionNav();
  const ano = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr] lg:py-20">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src={MEDIA.logo}
              alt=""
              fittingType="fill"
              className="h-9 w-9 rounded-[0.35rem]"
            />
            <span className="font-display text-[1.6rem] leading-none tracking-tight">Retratu</span>
          </div>
          <p className="mt-5 max-w-xs text-[0.95rem] leading-relaxed text-muted-foreground">
            Estúdio digital português de retratos profissionais gerados por inteligência artificial,
            para pessoas e equipas.
          </p>
          <p className="mt-4 max-w-xs text-[0.9rem] leading-relaxed text-muted-foreground">
            Falamos português e respondemos a todas as mensagens — normalmente no mesmo dia útil.
          </p>
        </div>

        <div>
          <h2 className="eyebrow">Navegação</h2>
          <nav aria-label="Navegação do rodapé">
            <ul className="mt-4 space-y-1 text-[0.95rem]">
              {NAVEGACAO.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => irPara(item.id)}
                    className="inline-flex min-h-11 items-center text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
              <li>
                <Link
                  to="/loja"
                  className="inline-flex min-h-11 items-center text-muted-foreground transition-colors hover:text-foreground"
                >
                  Loja
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="inline-flex min-h-11 items-center text-muted-foreground transition-colors hover:text-foreground"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div>
          <h2 className="eyebrow">Legal</h2>
          <nav aria-label="Informação legal">
            <ul className="mt-4 space-y-1 text-[0.95rem]">
              {LEGAL.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="inline-flex min-h-11 items-center text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div>
          <h2 className="eyebrow">Falar connosco</h2>
          <ul className="mt-4 space-y-4 text-[0.95rem] text-muted-foreground">
            <li>
              <a
                href="mailto:contacto@retratu.pt"
                className="inline-flex min-h-11 items-center gap-2.5 transition-colors hover:text-foreground"
              >
                <Mail className="h-4 w-4 text-accent" strokeWidth={1.7} aria-hidden="true" />
                contacto@retratu.pt
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Clock
                className="mt-1.5 h-4 w-4 shrink-0 text-accent"
                strokeWidth={1.7}
                aria-hidden="true"
              />
              <span>
                Segunda a sexta, 9h–18h
                <span className="block text-[0.85rem] text-muted-foreground">Hora de Lisboa</span>
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <ShieldCheck
                className="mt-1.5 h-4 w-4 shrink-0 text-accent"
                strokeWidth={1.7}
                aria-hidden="true"
              />
              <span>
                Serviço 100% online
                <span className="block text-[0.85rem] text-muted-foreground">
                  Pagamento seguro · IVA incluído
                </span>
              </span>
            </li>
          </ul>
          <Link to="/#contactos" className="link-quiet mt-5">
            Enviar uma mensagem
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-6 text-[0.8rem] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© {ano} Retratu. Todos os direitos reservados.</span>
          <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>Feito em Lisboa, para todo o país</span>
            <span aria-hidden="true" className="hidden h-1 w-1 rounded-full bg-border sm:inline-block" />
            <span>Preços com IVA incluído</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
