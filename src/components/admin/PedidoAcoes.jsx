import { db } from "@/lib/api";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ESTADOS_PEDIDO, entradaHistorico } from "@/lib/admin";
import { useAuth } from "@/lib/AuthContext";

export default function PedidoAcoes({ encomenda, aoAlterar }) {
  const { user } = useAuth();
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState("");
  const info = ESTADOS_PEDIDO[encomenda.estado] || {};
  const fechado = encomenda.estado === "cancelado" || encomenda.estado === "concluido";

  const aplicar = async (novoEstado) => {
    setOcupado(true);
    setErro("");
    try {
      const entrada = entradaHistorico(
        encomenda.estado,
        novoEstado,
        user?.email || "administração"
      );
      await db.entities.Order.bulkUpdate(
        encomenda.itens.map((item) => ({
          id: item.id,
          estado: novoEstado,
          historico: [...(item.historico || []), entrada],
          ...(novoEstado === "pago" ? { aprovado_por: user?.email || "" } : {}),
        }))
      );
      aoAlterar();
    } catch (e) {
      setErro("Não foi possível atualizar o pedido.");
    } finally {
      setOcupado(false);
    }
  };

  if (fechado) {
    return (
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={ocupado}
          onClick={() => aplicar("pendente_pagamento")}
          className="rounded-full"
        >
          Reabrir como pendente
        </Button>
        {erro && <p className="text-[0.85rem] text-destructive">{erro}</p>}
      </div>
    );
  }

  return (
    <div className="mt-5 flex flex-wrap items-center gap-3">
      {info.proximo && (
        <Button
          type="button"
          size="sm"
          disabled={ocupado}
          onClick={() => aplicar(info.proximo)}
          className="rounded-full px-5"
        >
          {ocupado ? <Loader2 className="h-4 w-4 animate-spin" /> : info.acao}
        </Button>
      )}

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={ocupado}
            className="rounded-full text-destructive hover:text-destructive"
          >
            Cancelar pedido
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar a encomenda {encomenda.referencia}?</AlertDialogTitle>
            <AlertDialogDescription>
              O estado passa a “Cancelado” e o cliente deixa de a ver em produção. Pode reabrir
              depois como pendente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction onClick={() => aplicar("cancelado")}>
              Cancelar pedido
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {erro && <p className="text-[0.85rem] text-destructive">{erro}</p>}
    </div>
  );
}