import CampoOpcoes from "@/components/edicao/CampoOpcoes";
import CampoTexto from "@/components/edicao/CampoTexto";
import CamposCondicionais from "@/components/edicao/CamposCondicionais";
import { OPCOES_COMUNS } from "@/lib/edicao/servicos";

export default function FormularioPreferencias({
  estado,
  onAlterar,
  onAlterarResposta,
  erros,
}) {
  const campo = (nome) => (valor) => onAlterar(nome, valor);
  const comum = (id, nome) => ({
    id: `pref-${id}`,
    valor: estado[nome],
    onChange: campo(nome),
    erro: erros[nome],
  });

  return (
    <div className="space-y-9">
      <div className="grid gap-8 sm:grid-cols-2">
        <CampoTexto
          id="pref-nome"
          label="Nome do pedido *"
          placeholder="Ex.: Retrato para LinkedIn — outubro"
          {...comum("nome", "nomePedido")}
        />
        <CampoTexto
          id="pref-objetivo"
          label="Objetivo da edição *"
          placeholder="Ex.: atualizar a imagem do meu perfil profissional"
          {...comum("objetivo", "objetivo")}
        />
      </div>

      <CampoTexto
        id="pref-descricao"
        label="Resultado pretendido *"
        rows={4}
        placeholder="Descreva o resultado que procura com o máximo de detalhe possível."
        {...comum("descricao", "descricao")}
      />

      <CampoTexto
        id="pref-estilo"
        label="Estilo visual desejado"
        placeholder="Ex.: editorial sóbrio, luz suave, tons neutros"
        {...comum("estilo", "estiloVisual")}
      />

      <div className="grid gap-8 sm:grid-cols-2">
        <CampoOpcoes
          label="Intensidade da edição"
          opcoes={OPCOES_COMUNS.intensidade}
          obrigatorio
          {...comum("intensidade", "intensidade")}
        />
        <CampoOpcoes
          label="Nível de realismo"
          opcoes={OPCOES_COMUNS.realismo}
          obrigatorio
          {...comum("realismo", "realismo")}
        />
      </div>

      <CampoOpcoes
        label="Formato final"
        opcoes={OPCOES_COMUNS.formato}
        obrigatorio
        {...comum("formato", "formato")}
      />

      {estado.formato === "personalizado" && (
        <CampoTexto
          id="pref-formato-personalizado"
          label="Descreva o formato pretendido *"
          placeholder="Ex.: 1200 × 630 px para capa de artigo"
          {...comum("formato-personalizado", "formatoPersonalizado")}
        />
      )}

      <div className="grid gap-8 sm:grid-cols-2">
        <CampoOpcoes
          label="Resolução pretendida"
          opcoes={OPCOES_COMUNS.resolucao}
          obrigatorio
          ajuda="Oferecemos o tamanho original, 2K ou 4K."
          {...comum("resolucao", "resolucao")}
        />
        <CampoOpcoes
          label="Número de variações"
          opcoes={OPCOES_COMUNS.variacoes}
          obrigatorio
          {...comum("variacoes", "variacoes")}
        />
      </div>

      <CampoTexto
        id="pref-observacoes"
        label="Observações adicionais"
        rows={3}
        placeholder="Alguma indicação que devamos ter em conta?"
        {...comum("observacoes", "observacoes")}
      />

      <CamposCondicionais
        servicoSlug={estado.servicoPrincipal}
        respostas={estado.respostas}
        onAlterar={onAlterarResposta}
        erros={erros}
      />

      <div className="space-y-8 border-t border-border pt-8">
        <h3 className="font-display text-[1.2rem]">Contacto</h3>
        <div className="grid gap-8 sm:grid-cols-2">
          <CampoTexto
            id="pref-nome-cliente"
            label="O seu nome *"
            autoComplete="name"
            {...comum("nome-cliente", "nomeCliente")}
          />
          <CampoTexto
            id="pref-email-cliente"
            label="E-mail *"
            type="email"
            autoComplete="email"
            placeholder="nome@email.pt"
            {...comum("email-cliente", "emailCliente")}
          />
        </div>
      </div>
    </div>
  );
}