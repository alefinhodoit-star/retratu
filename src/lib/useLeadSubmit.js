import { db } from "@/lib/api";

import { useState } from "react";

/** Regista um pedido de contacto (ou proposta B2B) na base de dados da app. */
export function useLeadSubmit() {
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState("");

  const enviar = async (dados) => {
    setEnviando(true);
    setErro("");
    try {
      await db.entities.Lead.create({
        nome: dados.nome,
        email: dados.email,
        telefone: dados.telefone || "",
        mensagem: dados.mensagem || "",
        origem: dados.origem || "contacto",
        empresa: dados.empresa || "",
        colaboradores: dados.colaboradores || "",
        estado: "novo",
        sincronizado_crm: false,
      });
      setSucesso(true);
    } catch (e) {
      setErro("Não foi possível enviar. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  };

  return { enviar, enviando, sucesso, erro };
}