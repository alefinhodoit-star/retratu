import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ESTADOS_PEDIDO, obterPedido } from "@/lib/edicao/pedidoService";

const PROXIMOS_PASSOS = [
  "Confirmamos os dados do pedido e, se faltar alguma coisa, escrevemos-lhe.",
  "A nossa equipa prepara a edição de acordo com o serviço que escolheu.",
  "Cada imagem passa por uma revisão de qualidade antes de ser dada como concluída.",
  "Recebe um e-mail assim que o resultado estiver disponível na sua conta.",
];

export default function EdicaoObrigado() {
  const [pedido, setPedido] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("pedido");
    if (!id) {
      setErro("Não encontrámos a referência do pedido.");
      setCarregando(false);
      return;
    }

    let ativo = true;
    obterPedido(id)
      .then((registado) => {
        if (ativo) setPedido(registado);
      })
      .catch(() => {
        if (ativo) setErro("Não foi possível encontrar este pedido.");
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  if (carregando) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (erro || !pedido) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-display text-[1.9rem]">Pedido não encontrado</h1>
        <p className="mt-4 text-muted-foreground">{erro}</p>
        <Button asChild className="mt-8 rounded-full px-7">
          <Link to="/edicao">Criar novo pedido</Link>
        </Button>
      </div>
    );
  }

  const data = new Date(pedido.created_date).toLocaleString("pt-PT", {
    dateStyle: "long",
    timeStyle: "short",
  });

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 lg:py-24">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/15">
        <Check className="h-5 w-5 text-accent" aria-hidden="true" />
      </span>

      <h1 className="mt-6 max-w-xl text-balance font-display text-[2rem] leading-[1.08] sm:text-[2.5rem]">
        Obrigado! O seu pedido foi recebido.
      </h1>
      <p className="mt-5 max-w-xl text-pretty text-muted-foreground">
        Recebemos as suas preferências e as imagens enviadas. Não tem de fazer mais nada por agora —
        a nossa equipa trata do resto e mantém-no a par por e-mail.
      </p>

      <section className="mt-10 rounded-[1.5rem] border border-border bg-card p-6 lg:p-8">
        <h2 className="eyebrow">Estado do pedido</h2>
        <dl className="mt-5 space-y-3">
          <div className="flex flex-wrap justify-between gap-2 border-b border-border pb-3 text-[0.95rem]">
            <dt className="text-muted-foreground">Pedido</dt>
            <dd>Registado</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-2 border-b border-border pb-3 text-[0.95rem]">
            <dt className="text-muted-foreground">Referência</dt>
            <dd className="font-medium">{pedido.referencia}</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-2 border-b border-border pb-3 text-[0.95rem]">
            <dt className="text-muted-foreground">Estado atual</dt>
            <dd>{ESTADOS_PEDIDO[pedido.estado] ?? pedido.estado}</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-2 border-b border-border pb-3 text-[0.95rem]">
            <dt className="text-muted-foreground">Submetido a</dt>
            <dd>{data}</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-2 text-[0.95rem]">
            <dt className="text-muted-foreground">Serviço</dt>
            <dd>{pedido.servico_nome}</dd>
          </div>
        </dl>
      </section>

      <section className="mt-8">
        <h2 className="eyebrow">Próximos passos</h2>
        <ol className="mt-4 space-y-3">
          {PROXIMOS_PASSOS.map((texto, indice) => (
            <li key={texto} className="flex gap-3 text-[0.95rem]">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border text-[0.72rem] text-muted-foreground">
                {indice + 1}
              </span>
              <span>{texto}</span>
            </li>
          ))}
        </ol>
        <p className="mt-5 text-[0.85rem] text-muted-foreground">
          Guarde o número de referência para acompanhar o pedido. O estado é atualizado pela equipa à
          medida que o trabalho avança — e pode sempre responder ao e-mail de confirmação para falar
          com uma pessoa.
        </p>
      </section>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Button asChild className="h-12 rounded-full px-7">
          <Link to="/edicao">
            Criar novo pedido <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="ghost" className="h-12 rounded-full px-7">
          <Link to="/">Voltar ao início</Link>
        </Button>
      </div>
    </div>
  );
}