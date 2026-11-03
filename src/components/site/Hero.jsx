import { ArrowRight, Clock, ShieldCheck, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import BeforeAfter from "@/components/site/BeforeAfter";
import { MEDIA } from "@/lib/media";
import { useSectionNav } from "@/lib/useSectionNav";

const PROVAS = [
  { valor: "12 400+", rotulo: "retratos entregues" },
  { valor: "4,9/5", rotulo: "satisfação dos clientes" },
  { valor: "12 min", rotulo: "tempo médio de entrega" },
];

export default function Hero() {
  const irPara = useSectionNav();

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 pb-20 pt-12 lg:grid-cols-[1.05fr_1fr] lg:gap-20 lg:pb-28 lg:pt-20">
        <div>
          <span className="eyebrow">Estúdio de retratos com IA · Portugal</span>

          <h1 className="mt-6 text-balance font-display text-[2.6rem] leading-[1.04] sm:text-[3.4rem] lg:text-[3.9rem]">
            O retrato profissional que a sua carreira merece.
          </h1>

          <p className="mt-7 max-w-xl text-pretty text-muted-foreground">
            Envie fotografias do telemóvel e receba retratos de estúdio prontos para o LinkedIn, o
            currículo e o site da sua empresa. Sem marcações, sem deslocações — e com uma pessoa a
            rever cada entrega.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              size="lg"
              onClick={() => irPara("pacotes")}
              className="h-14 rounded-full px-8 text-[1rem]"
            >
              Escolher o meu pacote
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              size="lg"
              variant="ghost"
              onClick={() => irPara("exemplos")}
              className="h-14 rounded-full px-6 text-[1rem] text-muted-foreground"
            >
              Ver exemplos
            </Button>
          </div>

          <p className="mt-4 text-[0.85rem] text-muted-foreground">
            A partir de <span className="font-medium text-foreground">24,90 €</span> · IVA incluído ·
            sem subscrição
          </p>

          <ul className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.85rem] text-muted-foreground">
            <li className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-accent" aria-hidden="true" /> Pagamento seguro
            </li>
            <li className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-accent" aria-hidden="true" /> Galeria em minutos
            </li>
            <li className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-accent" aria-hidden="true" /> Revisão humana incluída
            </li>
          </ul>

          <dl className="mt-12 grid gap-5 border-t border-border pt-8 sm:grid-cols-3 sm:gap-6">
            {PROVAS.map((p) => (
              <div key={p.rotulo} className="flex flex-col-reverse gap-1">
                <dt className="text-[0.78rem] uppercase tracking-[0.14em] text-muted-foreground">
                  {p.rotulo}
                </dt>
                <dd className="font-display text-2xl lg:text-3xl">{p.valor}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute -right-10 -top-10 hidden h-40 w-40 rounded-full bg-accent/20 blur-3xl lg:block"
          />
          <BeforeAfter
            antes={MEDIA.antesMulher}
            depois={MEDIA.depoisMulher}
            legenda="Retrato executivo para LinkedIn"
            priority
            className="relative"
          />
        </div>
      </div>
    </section>
  );
}
