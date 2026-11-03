import { Link } from "react-router-dom";
import { ShieldCheck, Lock, Trash2, FileCheck2 } from "lucide-react";

const GARANTIAS = [
  {
    icone: Lock,
    titulo: "Carregamento seguro",
    texto:
      "As suas fotografias são enviadas por ligação segura e guardadas em armazenamento privado, sem endereço público acessível.",
  },
  {
    icone: ShieldCheck,
    titulo: "Acesso restrito",
    texto:
      "Apenas a equipa de produção e os prestadores que executam o serviço acedem às suas fotografias. Nunca são cedidas nem usadas em publicidade de terceiros.",
  },
  {
    icone: Trash2,
    titulo: "Eliminadas até 30 dias",
    texto:
      "As fotografias e as imagens geradas são eliminadas ou anonimizadas até 30 dias após a entrega final. Pode pedir o apagamento antes desse prazo.",
  },
  {
    icone: FileCheck2,
    titulo: "Só mostramos exemplos com autorização",
    texto:
      "Nenhuma fotografia sua é publicada como exemplo sem uma autorização expressa da sua parte — e pode retirá-la em qualquer momento.",
  },
];

export default function PrivacyPromise() {
  return (
    <section id="privacidade-fotos" className="border-t border-border">
      <div className="section-shell">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div>
            <span className="eyebrow">Privacidade das fotografias</span>
            <h2 className="section-title">O que acontece às fotografias que envia</h2>
            <p className="section-lede">
              Sabemos que enviar fotografias suas exige confiança. Por isso explicamos, sem letras
              pequenas, como as tratamos do carregamento à eliminação. As suas fotografias não são
              usadas para treinar modelos.
            </p>
            <Link to="/privacidade" className="link-quiet mt-8 min-h-11">
              Ler a Política de Privacidade
            </Link>
            <p className="mt-6 text-[0.88rem] leading-relaxed text-muted-foreground">
              Ficou com alguma dúvida?{" "}
              <Link to="/#contactos" className="underline underline-offset-4 hover:text-foreground">
                Escreva-nos
              </Link>{" "}
              — respondemos com detalhe, sem respostas automáticas.
            </p>
          </div>

          <div className="grid gap-px overflow-hidden rounded-[1.5rem] border border-border bg-border sm:grid-cols-2">
            {GARANTIAS.map((item) => (
              <div key={item.titulo} className="bg-background p-7 lg:p-8">
                <item.icone className="h-5 w-5 text-accent" strokeWidth={1.6} aria-hidden="true" />
                <h3 className="mt-5 font-heading text-[1.15rem] leading-tight">{item.titulo}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">
                  {item.texto}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}