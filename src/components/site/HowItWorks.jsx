import { Image } from "@/components/ui/image";
import { Check, MoveRight } from "lucide-react";
import { MEDIA } from "@/lib/media";

const PASSOS = [
  {
    numero: "01",
    tempo: "≈ 3 minutos",
    titulo: "Envie as suas fotos",
    texto:
      "Carregue 8 a 15 fotografias do telemóvel, tiradas nos últimos meses. Não precisa de estúdio, fundo neutro nem equipamento especial — basta que o seu rosto esteja nítido.",
  },
  {
    numero: "02",
    tempo: "≈ 10 minutos",
    titulo: "A IA aprende os seus traços",
    texto:
      "O nosso modelo estuda a sua expressão, a luz e os ângulos para gerar retratos executivos com iluminação de estúdio, em várias roupas e fundos.",
  },
  {
    numero: "03",
    tempo: "≈ 2 minutos",
    titulo: "Escolha e descarregue",
    texto:
      "Recebe uma galeria privada para escolher as imagens finais. Revemos consigo os detalhes e entregamos tudo em alta resolução, pronto para LinkedIn, CV e site.",
  },
];

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="scroll-mt-24 border-t border-border">
      <div className="section-shell">
        <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-20">
          <div className="lg:sticky lg:top-28">
            <span className="eyebrow">Como funciona</span>
            <h2 className="section-title">Um estúdio inteiro, resolvido em três passos</h2>
            <p className="section-lede measure">
              Sem marcações, sem deslocações e sem sessões fotográficas. Faz-se tudo online — e cada
              entrega é revista por uma pessoa antes de chegar às suas mãos.
            </p>

            <div className="mt-10 overflow-hidden rounded-[1.75rem] border border-border">
              <Image
                src={MEDIA.lente}
                alt="Objetiva de estúdio com iluminação dourada"
                fittingType="fill"
                className="aspect-[16/9] w-full"
              />
            </div>
          </div>

          <ol className="space-y-10">
            {PASSOS.map((passo) => (
              <li key={passo.numero} className="border-t border-border pt-8">
                <div className="flex items-baseline gap-5">
                  <span className="font-display text-[0.95rem] tracking-[0.2em] text-accent">
                    {passo.numero}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <h3 className="font-display text-[1.5rem] leading-tight">{passo.titulo}</h3>
                      <span className="text-[0.75rem] uppercase tracking-[0.14em] text-muted-foreground">
                        {passo.tempo}
                      </span>
                    </div>
                    <p className="mt-3 text-pretty text-muted-foreground">{passo.texto}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          {/* Lista de garantias separada da lista ordenada de passos. */}
          <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-border pt-8 text-[0.95rem] text-muted-foreground">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-accent" aria-hidden="true" /> Imagens finais aprovadas
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-accent" aria-hidden="true" /> Alta resolução
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-accent" aria-hidden="true" /> Uso comercial autorizado
            </li>
            <li className="flex items-center gap-2 font-medium text-foreground">
              <MoveRight className="h-4 w-4" aria-hidden="true" /> Sem créditos nem mensalidades
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
