import { Link } from "react-router-dom";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  OPCOES_COMUNS,
  camposDoServico,
  obterServico,
  rotuloOpcao,
} from "@/lib/edicao/servicos";

function Linha({ rotulo, valor }) {
  return (
    <div className="flex flex-col gap-1 border-b border-border py-3 last:border-0 sm:flex-row sm:gap-6">
      <span className="w-48 shrink-0 text-[0.78rem] uppercase tracking-[0.12em] text-muted-foreground">
        {rotulo}
      </span>
      <span className="text-[0.95rem]">{valor || "—"}</span>
    </div>
  );
}

function Bloco({ titulo, passo, onIr, children }) {
  return (
    <section className="rounded-[1.25rem] border border-border bg-card p-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-display text-[1.1rem]">{titulo}</h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="rounded-full text-muted-foreground"
          onClick={() => onIr(passo)}
        >
          <Pencil className="mr-2 h-3.5 w-3.5" /> Editar
        </Button>
      </div>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export default function RevisaoPedido({ estado, onIr }) {
  const servico = obterServico(estado.servicoPrincipal);
  const campos = camposDoServico(estado.servicoPrincipal);
  const complementares = estado.servicosComplementares
    .map((slug) => obterServico(slug)?.nome ?? slug)
    .join(", ");

  return (
    <div className="space-y-5">
      <Bloco titulo="Serviço" passo={0} onIr={onIr}>
        <Linha rotulo="Serviço principal" valor={servico?.nome} />
        {complementares && <Linha rotulo="Edições complementares" valor={complementares} />}
        {estado.servicoPersonalizado && (
          <Linha rotulo="Descrição livre" valor={estado.servicoPersonalizado} />
        )}
      </Bloco>

      <Bloco titulo="Preferências" passo={1} onIr={onIr}>
        <Linha rotulo="Nome do pedido" valor={estado.nomePedido} />
        <Linha rotulo="Objetivo" valor={estado.objetivo} />
        <Linha rotulo="Resultado pretendido" valor={estado.descricao} />
        <Linha rotulo="Estilo visual" valor={estado.estiloVisual} />
        <Linha
          rotulo="Intensidade"
          valor={rotuloOpcao(OPCOES_COMUNS.intensidade, estado.intensidade)}
        />
        <Linha rotulo="Realismo" valor={rotuloOpcao(OPCOES_COMUNS.realismo, estado.realismo)} />
        <Linha
          rotulo="Formato e resolução"
          valor={`${
            estado.formato === "personalizado"
              ? estado.formatoPersonalizado
              : rotuloOpcao(OPCOES_COMUNS.formato, estado.formato)
          } · ${rotuloOpcao(OPCOES_COMUNS.resolucao, estado.resolucao)}`}
        />
        <Linha rotulo="Variações" valor={`${estado.variacoes}`} />
        {campos.map((campo) => {
          const valor = estado.respostas?.[campo.id];
          const texto = Array.isArray(valor) ? valor.join(", ") : valor;
          return (
            <Linha
              key={campo.id}
              rotulo={campo.label.replace(/\?$/, "")}
              valor={texto === "sim" ? "Sim" : texto === "nao" ? "Não" : texto}
            />
          );
        })}
        <Linha rotulo="Observações" valor={estado.observacoes} />
        <Linha rotulo="Contacto" valor={`${estado.nomeCliente} · ${estado.emailCliente}`} />
      </Bloco>

      <Bloco titulo="Imagens" passo={2} onIr={onIr}>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-[0.78rem] uppercase tracking-[0.12em] text-muted-foreground">
              Imagem original
            </p>
            {estado.imagemOriginal ? (
              <div className="mt-3 flex items-center gap-3">
                <img
                  src={estado.imagemOriginal.previewUrl}
                  alt="Pré-visualização da imagem original"
                  className="h-16 w-16 rounded-[0.7rem] object-cover"
                />
                <span className="truncate text-[0.85rem]">{estado.imagemOriginal.nome}</span>
              </div>
            ) : (
              <p className="mt-3 text-[0.9rem] text-muted-foreground">Não carregada</p>
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="mt-2 rounded-full px-0 text-muted-foreground"
              onClick={() => onIr(2)}
            >
              Alterar imagem original
            </Button>
          </div>
          <div>
            <p className="text-[0.78rem] uppercase tracking-[0.12em] text-muted-foreground">
              Imagem de referência
            </p>
            {estado.referencia ? (
              <div className="mt-3 flex items-center gap-3">
                <img
                  src={estado.referencia.previewUrl}
                  alt="Pré-visualização da imagem de referência"
                  className="h-16 w-16 rounded-[0.7rem] object-cover"
                />
                <span className="truncate text-[0.85rem]">{estado.referencia.nome}</span>
              </div>
            ) : (
              <p className="mt-3 text-[0.9rem] text-muted-foreground">Não carregada</p>
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="mt-2 rounded-full px-0 text-muted-foreground"
              onClick={() => onIr(3)}
            >
              Alterar referência
            </Button>
          </div>
        </div>
      </Bloco>

      <p className="px-1 text-[0.85rem] text-muted-foreground">
        Pode voltar a qualquer etapa para corrigir os dados antes de enviar. Consulte os{" "}
        <Link to="/termos" className="underline underline-offset-4">
          termos
        </Link>{" "}
        e a{" "}
        <Link to="/privacidade" className="underline underline-offset-4">
          política de privacidade
        </Link>
        .
      </p>
    </div>
  );
}