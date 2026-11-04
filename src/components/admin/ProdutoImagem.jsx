import { db } from "@/lib/api";

import { useRef, useState } from "react";
import { Image as ImageIcon, Loader2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { Label } from "@/components/ui/label";

export default function ProdutoImagem({ valor, aoAlterar }) {
  const ficheiro = useRef(null);
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState("");

  const carregar = async (evento) => {
    const escolhido = evento.target.files?.[0];
    evento.target.value = "";
    if (!escolhido) return;

    setOcupado(true);
    setErro("");
    try {
      const { file_url } = await db.integrations.Core.UploadFile({ file: escolhido });
      aoAlterar(file_url);
    } catch (e) {
      setErro("Não foi possível carregar a imagem.");
    } finally {
      setOcupado(false);
    }
  };

  return (
    <div>
      <Label htmlFor="produto-imagem">Imagem demonstrativa</Label>

      <div className="mt-2 flex items-center gap-4">
        {valor ? (
          <Image
            src={valor}
            alt="Imagem do produto"
            fittingType="fill"
            className="h-20 w-20 shrink-0 rounded-xl border border-border"
          />
        ) : (
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-dashed border-border text-muted-foreground">
            <ImageIcon className="h-5 w-5" />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <input
            id="produto-imagem"
            ref={ficheiro}
            type="file"
            accept="image/*"
            onChange={carregar}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full"
            disabled={ocupado}
            onClick={() => ficheiro.current?.click()}
          >
            {ocupado ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {valor ? "Substituir" : "Carregar imagem"}
          </Button>
          {valor && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="rounded-full text-muted-foreground"
              onClick={() => aoAlterar("")}
            >
              Remover
            </Button>
          )}
        </div>
      </div>

      <p className="mt-2 text-[0.8rem] text-muted-foreground">
        Aparece ao lado do produto na loja. Use uma imagem quadrada, com fundo claro.
      </p>
      {erro && <p className="mt-1 text-[0.8rem] text-destructive">{erro}</p>}
    </div>
  );
}