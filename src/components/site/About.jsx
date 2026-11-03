import { Image } from "@/components/ui/image";
import { MEDIA } from "@/lib/media";

const FACTOS = [
  { rotulo: "Sede", valor: "Lisboa, Portugal" },
  { rotulo: "Serviço", valor: "100% online" },
  { rotulo: "Resposta", valor: "Até 1 dia útil" },
];

export default function About() {
  return (
    <section id="sobre" className="scroll-mt-24 border-t border-border bg-secondary/40">
      <div className="section-shell">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div>
            <span className="eyebrow">Quem está por trás</span>
            <h2 className="section-title">Um estúdio pequeno, com nome, rosto e resposta.</h2>

            <div className="measure mt-6 space-y-4 text-muted-foreground">
              <p>
                O Retratu nasceu de uma frustração simples: sessões de fotografia caras, agendas
                impossíveis e fotografias que nunca ficavam prontas a tempo. Construímos uma
                alternativa que trata a imagem profissional com o rigor de um estúdio — e a
                simplicidade de uma troca de mensagens.
              </p>
              <p>
                Somos uma equipa pequena, em Lisboa. Cada pedido é lido por uma pessoa, cada entrega
                é revista antes de sair e cada mensagem tem resposta. Se algo não estiver bem,
                resolve-se — sem formulários intermináveis nem respostas automáticas.
              </p>
            </div>

            <p className="mt-6 font-display text-[1.15rem] italic text-foreground">
              — Equipa Retratu
            </p>

            <dl className="mt-10 grid gap-6 border-t border-border pt-8 sm:grid-cols-3">
              {FACTOS.map((facto) => (
                <div key={facto.rotulo}>
                  <dt className="text-[0.72rem] uppercase tracking-[0.18em] text-muted-foreground">
                    {facto.rotulo}
                  </dt>
                  <dd className="mt-1.5 text-[0.95rem] font-medium text-foreground">{facto.valor}</dd>
                </div>
              ))}
            </dl>
          </div>

          <figure className="overflow-hidden rounded-[1.75rem] border border-border bg-background">
            <Image
              src={MEDIA.lente}
              alt="Objetiva de estúdio usada nas sessões de retrato"
              fittingType="fill"
              loading="lazy"
              className="aspect-[4/5] w-full"
            />
            <figcaption className="border-t border-border px-5 py-4 text-[0.82rem] leading-relaxed text-muted-foreground">
              O mesmo cuidado de um estúdio fotográfico, aplicado a fotografias que já tem no
              telemóvel.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
