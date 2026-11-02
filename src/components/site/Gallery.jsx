import BeforeAfter from "@/components/site/BeforeAfter";
import { MEDIA } from "@/lib/media";

const EXEMPLOS = [
  {
    antes: MEDIA.antesHomem,
    depois: MEDIA.depoisHomem,
    legenda: "Retrato executivo masculino",
  },
  {
    antes: MEDIA.antesMulher,
    depois: MEDIA.depoisMulher,
    legenda: "Retrato corporativo feminino",
  },
];

const DETALHES = [
  "Fundos neutros de estúdio: cinza, azul-marinho e bege.",
  "Iluminação profissional com rim light e profundidade de campo real.",
  "Guarda-roupa profissional aplicado automaticamente, sem perder os seus traços.",
];

export default function Gallery() {
  return (
    <section id="exemplos" className="scroll-mt-24 border-t border-border bg-secondary/40">
      <div className="section-shell">
        <div className="section-head">
          <span className="eyebrow">Exemplos de resultados</span>
          <h2 className="section-title">Da foto do telemóvel ao retrato de estúdio</h2>
          <p className="section-lede">
            A mesma pessoa, a mesma expressão — outra presença. A IA do Retratu corrige luz, fundo,
            postura e vestuário sem alterar a sua identidade. Deslize nos exemplos para comparar, à
            sua maneira e sem pressa.
          </p>
        </div>

        <div className="mt-14 grid gap-10 md:grid-cols-2 lg:gap-14">
          {EXEMPLOS.map((exemplo) => (
            <BeforeAfter key={exemplo.legenda} {...exemplo} />
          ))}
        </div>

        <ul className="mt-14 grid gap-6 border-t border-border pt-10 md:grid-cols-3">
          {DETALHES.map((detalhe) => (
            <li key={detalhe} className="border-l border-accent pl-5 text-[0.98rem] text-muted-foreground">
              {detalhe}
            </li>
          ))}
        </ul>

        <p className="mt-10 max-w-3xl text-[0.9rem] leading-relaxed text-muted-foreground">
          Exemplos de demonstração gerados com IA a partir de fotografias reais. O resultado final
          varia com a nitidez, a luz e a variedade das fotografias enviadas — e cada cliente recebe
          sempre uma galeria com várias opções para escolher. Se algo não estiver à altura, pedimos
          novas fotografias ou refazemos sem custo.
        </p>
      </div>
    </section>
  );
}
