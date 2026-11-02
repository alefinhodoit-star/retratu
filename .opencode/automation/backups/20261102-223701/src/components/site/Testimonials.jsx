import { Star } from "lucide-react";

const DEPOIMENTOS = [
  {
    texto:
      "Substituí a foto do LinkedIn por um retrato do Retratu e comecei a receber mais convites para conversas comerciais na mesma semana.",
    nome: "Ana Ribeiro",
    cargo: "Diretora de Marketing",
    local: "Lisboa",
  },
  {
    texto:
      "Enviei três fotos tiradas no telemóvel e recebi retratos que parecem de estúdio. Uso-os no site, nas propostas e no CV.",
    nome: "Miguel Santos",
    cargo: "Consultor Financeiro",
    local: "Porto",
  },
  {
    texto:
      "Padronizámos os retratos de 40 colaboradores sem tirar ninguém do trabalho. O conjunto final parece feito por uma equipa de fotógrafos.",
    nome: "Sofia Almeida",
    cargo: "Recursos Humanos",
    local: "Braga",
  },
];

const iniciais = (nome) =>
  nome
    .split(" ")
    .slice(0, 2)
    .map((parte) => parte[0])
    .join("");

export default function Testimonials() {
  return (
    <section className="border-t border-border">
      <div className="section-shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="section-head">
            <span className="eyebrow">Quem já usou</span>
            <h2 className="section-title">Histórias de quem já encomendou</h2>
            <p className="section-lede">
              Profissionais de áreas diferentes, todos com a mesma necessidade: uma imagem que
              acompanhe o trabalho que já fazem.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[0.85rem] text-muted-foreground">
            <span className="flex" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, indice) => (
                <Star key={indice} className="h-3.5 w-3.5 fill-accent text-accent" />
              ))}
            </span>
            4,9/5 em avaliações de clientes
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {DEPOIMENTOS.map((item) => (
            <figure
              key={item.nome}
              className="flex h-full flex-col rounded-[1.5rem] border border-border bg-card p-7 lg:p-8"
            >
              <div className="flex gap-0.5" aria-label="Avaliação: 5 de 5 estrelas">
                {Array.from({ length: 5 }).map((_, indice) => (
                  <Star key={indice} className="h-3.5 w-3.5 fill-accent text-accent" aria-hidden="true" />
                ))}
              </div>

              <blockquote className="mt-5 flex-1 font-display text-[1.2rem] leading-[1.45]">
                “{item.texto}”
              </blockquote>

              <figcaption className="mt-7 flex items-center gap-3 border-t border-border pt-5">
                <span className="avatar-mono" aria-hidden="true">
                  {iniciais(item.nome)}
                </span>
                <span className="text-[0.88rem] leading-snug text-muted-foreground">
                  <span className="block font-medium text-foreground">{item.nome}</span>
                  {item.cargo} · {item.local}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
