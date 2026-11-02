import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const PERGUNTAS = [
  {
    id: "envio",
    pergunta: "Como envio as minhas fotografias?",
    resposta: (
      <>
        Depois de escolher o pacote, recebe um link para carregar entre 8 e 15 fotografias tiradas nos
        últimos seis meses. Fotografias de telemóvel são suficientes: não precisa de fotógrafo nem de
        equipamento profissional.
      </>
    ),
  },
  {
    id: "escolha",
    pergunta: "Que fotografias devo escolher?",
    resposta: (
      <>
        Próximas do rosto, nítidas e de frente para uma fonte de luz natural, sem filtros pesados nem
        outras pessoas na imagem. Varie ligeiramente o ângulo do rosto entre fotografias. Se a
        qualidade não for suficiente, pedimos novos ficheiros sem custo adicional.
      </>
    ),
  },
  {
    id: "prazos",
    pergunta: "Quanto tempo demora a entrega?",
    resposta: (
      <>
        Até 24 horas no Pacote Entrada, até 12 horas no Pacote Principal e até 6 horas no Pacote
        Premium. Pode acrescentar entrega prioritária (6 horas) ou entrega expresso (90 minutos) no
        checkout. O prazo começa a contar quando recebemos as suas fotografias.
      </>
    ),
  },
  {
    id: "recebo",
    pergunta: "Como recebo os retratos finais?",
    resposta: (
      <>
        Numa galeria privada, acessível apenas na sua conta, onde escolhe e aprova as imagens. As
        imagens aprovadas ficam disponíveis em alta resolução e em versões já otimizadas para LinkedIn,
        currículo e site.
      </>
    ),
  },
  {
    id: "utilizacao",
    pergunta: "As imagens finais são minhas?",
    resposta: (
      <>
        Sim. Recebe uma licença de utilização pessoal e comercial das imagens aprovadas — redes
        sociais, currículo, website e materiais profissionais. Os detalhes estão nos{" "}
        <Link to="/termos" className="underline decoration-accent underline-offset-4">
          Termos e Condições
        </Link>
        .
      </>
    ),
  },
  {
    id: "resultado",
    pergunta: "E se eu não gostar do resultado?",
    resposta: (
      <>
        Quando há um problema técnico — identidade alterada, artefactos visíveis ou fundo incorreto —
        geramos novamente as imagens sem custo adicional. Se nenhuma imagem tiver sido entregue por
        motivo imputável à Retratu, devolvemos 100% do valor pago. Consulte a{" "}
        <Link to="/reembolso" className="underline decoration-accent underline-offset-4">
          Política de Reembolso
        </Link>
        .
      </>
    ),
  },
  {
    id: "fotos",
    pergunta: "O que acontece às fotografias que envio?",
    resposta: (
      <>
        São usadas apenas para gerar os seus retratos, com acesso restrito à equipa de produção, e
        eliminadas ou anonimizadas até 30 dias após a entrega. Só mostramos uma imagem sua como exemplo
        com autorização expressa. Consulte a{" "}
        <Link to="/privacidade" className="underline decoration-accent underline-offset-4">
          Política de Privacidade
        </Link>
        .
      </>
    ),
  },
  {
    id: "pagamento",
    pergunta: "Os preços incluem IVA? Como é feito o pagamento?",
    resposta: (
      <>
        Sim: todos os preços ao consumidor incluem IVA a 23%, com fatura discriminada. O pedido fica
        confirmado após a confirmação do pagamento e as opções adicionais que escolher são mostradas
        com o respetivo preço antes de finalizar.
      </>
    ),
  },
];

export default function FaqCompra() {
  return (
    <section id="faq" className="scroll-mt-24 border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:py-28">
        <div>
          <span className="eyebrow">Perguntas frequentes</span>
          <h2 className="section-title">Tudo o que precisa de saber antes de encomendar</h2>
          <p className="section-lede max-w-sm">
            Envio das fotografias, prazos, entrega, utilização, privacidade e pagamento — explicado de
            forma direta, sem letras pequenas.
          </p>
          <Button asChild className="mt-9 rounded-full px-7">
            <Link to="/#pacotes">Ver pacotes e preços</Link>
          </Button>
        </div>

        <div>
          <Accordion type="single" collapsible className="border-t border-border">
            {PERGUNTAS.map((item) => (
              <AccordionItem key={item.id} value={item.id} className="border-b border-border">
                <AccordionTrigger className="py-5 text-left font-heading text-[1.1rem] leading-snug hover:no-underline">
                  {item.pergunta}
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-[0.98rem] leading-relaxed text-muted-foreground">
                  {item.resposta}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-[1.25rem] border border-border bg-background p-6">
            <p className="max-w-sm text-[0.92rem] text-muted-foreground">
              A sua pergunta não está aqui? Respondemos em menos de um dia útil.
            </p>
            <Link to="/#contactos" className="link-quiet">
              Falar com a equipa
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}