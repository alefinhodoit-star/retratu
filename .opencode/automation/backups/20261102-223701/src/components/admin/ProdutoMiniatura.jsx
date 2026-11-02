import { Image as ImageIcon } from "lucide-react";
import { Image } from "@/components/ui/image";

export default function ProdutoMiniatura({ produto }) {
  if (produto.imagem) {
    return (
      <Image
        src={produto.imagem}
        alt={produto.nome}
        fittingType="fill"
        className="h-12 w-12 shrink-0 rounded-lg border border-border"
      />
    );
  }

  return (
    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-dashed border-border text-muted-foreground">
      <ImageIcon className="h-4 w-4" />
    </span>
  );
}