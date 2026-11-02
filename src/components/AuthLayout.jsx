import { Link } from "react-router-dom";
import { ArrowLeft, Clock, ShieldCheck, Sparkles } from "lucide-react";

import { Image } from "@/components/ui/image";
import { MEDIA } from "@/lib/media";

const PONTOS = [
  { icone: Sparkles, texto: "Retratos com qualidade de estúdio, gerados a partir das suas fotos." },
  { icone: Clock, texto: "Galeria pronta em minutos, não em semanas." },
  { icone: ShieldCheck, texto: "Fotografias em armazenamento privado e eliminadas após a entrega." },
];

export default function AuthLayout({ icon: Icon, title, subtitle, footer, children }) {
  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-[0.95fr_1.05fr]">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-foreground p-12 text-background lg:flex xl:p-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-1/3 h-72 w-72 rounded-full bg-accent/20 blur-3xl"
        />
        <Link to="/" className="relative flex items-center gap-3" aria-label="Retratu — página inicial">
          <Image
            src={MEDIA.logo}
            alt=""
            fittingType="fill"
            className="h-10 w-10 rounded-[0.35rem]"
          />
          <span className="font-display text-[1.6rem] leading-none tracking-tight">Retratu</span>
        </Link>

        <div className="relative max-w-md">
          <p className="font-display text-[2.1rem] leading-[1.12] text-background">
            “O retrato profissional que a sua carreira merece — sem estúdio, sem marcações, sem
            constrangimentos.”
          </p>
          <p className="mt-6 text-[0.9rem] uppercase tracking-[0.2em] text-background/50">
            Estúdio digital português
          </p>

          <ul className="mt-12 space-y-4 border-t border-background/15 pt-8">
            {PONTOS.map((ponto) => (
              <li key={ponto.texto} className="flex gap-3 text-[0.92rem] leading-relaxed text-background/70">
                <ponto.icone className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.7} />
                <span>{ponto.texto}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-[0.78rem] text-background/40">
          © {new Date().getFullYear()} Retratu · Portugal
        </p>
      </aside>

      <main className="flex flex-col px-6 py-8 sm:px-10">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 lg:hidden" aria-label="Retratu — página inicial">
            <Image src={MEDIA.logo} alt="" fittingType="fill" className="h-8 w-8 rounded-[0.3rem]" />
            <span className="font-display text-[1.3rem] leading-none">Retratu</span>
          </Link>
          <Link
            to="/"
            className="ml-auto inline-flex items-center gap-1.5 text-[0.85rem] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Voltar ao site
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-md">
            <div className="mb-8">
              {Icon && (
                <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full border border-border bg-secondary">
                  <Icon className="h-5 w-5 text-foreground" strokeWidth={1.6} aria-hidden="true" />
                </span>
              )}
              <h1 className="text-balance font-display text-[2rem] leading-[1.1] sm:text-[2.3rem]">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-3 text-pretty text-[0.98rem] text-muted-foreground">{subtitle}</p>
              )}
            </div>

            <div className="rounded-[1.5rem] border border-border bg-card p-6 shadow-[0_24px_60px_-45px_rgba(26,26,27,0.5)] sm:p-8">
              {children}
            </div>

            {footer && <div className="mt-6 text-center text-[0.9rem] text-muted-foreground">{footer}</div>}
          </div>
        </div>

        <p className="text-center text-[0.78rem] text-muted-foreground/70 lg:text-right">
          Precisa de ajuda?{" "}
          <a href="mailto:ola@retratu.pt" className="underline underline-offset-4 hover:text-foreground">
            ola@retratu.pt
          </a>
        </p>
      </main>
    </div>
  );
}
