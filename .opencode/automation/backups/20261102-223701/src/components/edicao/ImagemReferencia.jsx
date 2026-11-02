import CarregadorImagem from "@/components/edicao/CarregadorImagem";
import CampoOpcoes from "@/components/edicao/CampoOpcoes";
import CampoTexto from "@/components/edicao/CampoTexto";
import { OPCOES_COMUNS } from "@/lib/edicao/servicos";

export default function ImagemReferencia({
  imagem,
  onFicheiro,
  onRemover,
  erro,
  tipo,
  onAlterarTipo,
  notas,
  onAlterarNotas,
}) {
  return (
    <div>
      <p className="max-w-2xl text-muted-foreground">
        Carregue uma imagem que represente o resultado que pretende obter. Pode ser uma referência
        de estilo, roupa, cenário, iluminação, pose ou composição. A imagem será utilizada para
        orientar a edição, respeitando as opções selecionadas anteriormente.
      </p>

      <div className="mt-8">
        <CarregadorImagem
          id="imagem-referencia"
          titulo="Imagem de referência"
          imagem={imagem}
          onFicheiro={onFicheiro}
          onRemover={onRemover}
          erro={erro}
          obrigatoria={false}
          ajuda="A referência orienta o resultado: não garantimos a reprodução exata de todos os elementos."
        />
      </div>

      <div className="mt-9 space-y-8">
        <CampoOpcoes
          id="ref-tipo"
          label="O que deve ser seguido a partir da referência?"
          opcoes={OPCOES_COMUNS.referenciaTipo}
          valor={tipo}
          onChange={onAlterarTipo}
        />
        <CampoTexto
          id="ref-notas"
          label="O que deve ser reproduzido?"
          rows={3}
          valor={notas}
          onChange={onAlterarNotas}
          placeholder="Ex.: manter o fundo escuro e a luz lateral, mas com a minha roupa atual."
        />
      </div>
    </div>
  );
}