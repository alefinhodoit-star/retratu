import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ConfirmarEliminar({ etiqueta, aoEliminar }) {
  const [confirmar, setConfirmar] = useState(false);
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState("");

  if (!confirmar) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setConfirmar(true)}
        className="rounded-full text-destructive hover:text-destructive"
      >
        Eliminar
      </Button>
    );
  }

  const eliminar = async () => {
    setOcupado(true);
    setErro("");
    try {
      await aoEliminar();
    } catch (e) {
      setErro("Não foi possível eliminar.");
      setOcupado(false);
    }
  };

  return (
    <span className="flex flex-wrap items-center gap-3">
      <span className="text-[0.85rem] text-muted-foreground">Eliminar {etiqueta}?</span>
      <Button
        type="button"
        variant="destructive"
        size="sm"
        disabled={ocupado}
        onClick={eliminar}
        className="rounded-full"
      >
        {ocupado ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sim, eliminar"}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={ocupado}
        onClick={() => setConfirmar(false)}
        className="rounded-full"
      >
        Cancelar
      </Button>
      {erro && <span className="text-[0.85rem] text-destructive">{erro}</span>}
    </span>
  );
}