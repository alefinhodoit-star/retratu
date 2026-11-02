import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navegacao({
  onAnterior,
  onContinuar,
  rotuloContinuar = "Continuar",
  submetendo,
  erroGeral,
}) {
  const enviar = rotuloContinuar === "Enviar pedido";

  return (
    <div className="mt-10 border-t border-border pt-6">
      {erroGeral && (
        <p className="mb-4 text-[0.9rem] text-destructive" role="alert">
          {erroGeral}
        </p>
      )}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        {onAnterior ? (
          <Button
            type="button"
            variant="ghost"
            onClick={onAnterior}
            disabled={submetendo}
            className="rounded-full px-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Anterior
          </Button>
        ) : (
          <span />
        )}
        <Button
          type="button"
          onClick={onContinuar}
          disabled={submetendo}
          className="h-12 rounded-full px-8"
        >
          {submetendo ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> A enviar…
            </>
          ) : (
            <>
              {rotuloContinuar}
              {!enviar && <ArrowRight className="ml-2 h-4 w-4" />}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}