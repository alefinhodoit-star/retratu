import { useRef, useState } from "react";
import { ImagePlus, Loader2, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TAMANHO_MAX, TIPOS_ACEITES, formatarTamanho } from "@/lib/edicao/pedidoService";

export default function CarregadorImagem({
  id,
  titulo,
  ajuda,
  imagem,
  onFicheiro,
  onRemover,
  erro,
  obrigatoria,
}) {
  const inputRef = useRef(null);
  const [arrastando, setArrastando] = useState(false);

  const escolher = (ficheiro) => {
    if (ficheiro) onFicheiro(ficheiro);
  };

  return (
    <div>
      <p className="eyebrow">
        {titulo} · {obrigatoria ? "obrigatória" : "opcional"}
      </p>

      {imagem ? (
        <div className="mt-4 flex flex-col gap-4 rounded-[1.25rem] border border-border bg-card p-4 sm:flex-row sm:items-center">
          <img
            src={imagem.previewUrl}
            alt={`Pré-visualização de ${imagem.nome}`}
            className="h-28 w-28 shrink-0 rounded-[0.9rem] object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[0.95rem]">{imagem.nome}</p>
            <p className="text-[0.8rem] text-muted-foreground">
              {formatarTamanho(imagem.tamanho)}
            </p>
            {imagem.estado === "a_carregar" && (
              <p className="mt-1 flex items-center gap-2 text-[0.8rem] text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> A carregar…
              </p>
            )}
            {imagem.estado === "erro" && (
              <p className="mt-1 text-[0.8rem] text-destructive">{imagem.erro}</p>
            )}
          </div>
          <div className="flex shrink-0 gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-11 rounded-full sm:h-8"
              onClick={() => inputRef.current?.click()}
            >
              <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" /> Substituir
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-11 rounded-full text-muted-foreground sm:h-8"
              onClick={onRemover}
            >
              <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" /> Remover
            </Button>
          </div>
        </div>
      ) : (
        <label
          htmlFor={id}
          onDragOver={(e) => {
            e.preventDefault();
            setArrastando(true);
          }}
          onDragLeave={() => setArrastando(false)}
          onDrop={(e) => {
            e.preventDefault();
            setArrastando(false);
            escolher(e.dataTransfer.files?.[0]);
          }}
          className={cn(
            "mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[1.25rem] border border-dashed px-6 py-12 text-center transition-colors",
            arrastando ? "border-foreground bg-secondary/60" : "border-border hover:border-foreground/50"
          )}
        >
          <ImagePlus className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
          <span className="text-[0.95rem]">
            Arraste uma imagem para aqui ou{" "}
            <span className="underline underline-offset-4">selecione um ficheiro</span>
          </span>
          <span className="text-[0.78rem] text-muted-foreground">
            JPEG, PNG ou WebP · até {formatarTamanho(TAMANHO_MAX)}
          </span>
        </label>
      )}

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={TIPOS_ACEITES.join(",")}
        className="sr-only"
        onChange={(e) => {
          escolher(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      {ajuda && <p className="mt-3 text-[0.85rem] text-muted-foreground">{ajuda}</p>}
      {erro && (
        <p className="mt-2 text-[0.85rem] text-destructive" role="alert">
          {erro}
        </p>
      )}
    </div>
  );
}