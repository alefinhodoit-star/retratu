import CarregadorImagem from "@/components/edicao/CarregadorImagem";
import { instrucoesDoServico, obterServico } from "@/lib/edicao/servicos";

export default function ImagemOriginal({ servicoSlug, imagem, onFicheiro, onRemover, erro }) {
  const servico = obterServico(servicoSlug);

  return (
    <div>
      <p className="max-w-2xl text-muted-foreground">
        Carregue a fotografia que pretende editar. É a base de todo o trabalho e determina a
        qualidade do resultado final.
      </p>
      <p className="mt-4 max-w-2xl text-[0.9rem] text-muted-foreground">
        <span className="text-foreground">Recomendações: </span>
        {instrucoesDoServico(servicoSlug)}
      </p>

      <div className="mt-8">
        <CarregadorImagem
          id="imagem-original"
          titulo="Imagem original"
          imagem={imagem}
          onFicheiro={onFicheiro}
          onRemover={onRemover}
          erro={erro}
          obrigatoria={Boolean(servico?.requerOriginal)}
          ajuda={
            servico?.requerOriginal
              ? "As imagens são guardadas em armazenamento privado e usadas apenas para produzir este pedido."
              : "Este serviço pode ser processado sem imagem original. Se quiser orientar o resultado, carregue uma imagem."
          }
        />
      </div>
    </div>
  );
}