// Carregamento de ficheiros em modo local.
//
// O binário fica em IndexedDB e o registo guarda apenas um identificador
// `local://<id>`. O backend Node + SQLite irá substituir isto por upload real,
// devolvendo uma URL assinada — o contrato (`{ file_uri }`) mantém-se.

import { guardarBlob, novoId } from "./storage";

export async function uploadPrivateFile(file) {
  if (!file) throw new Error("Nenhum ficheiro recebido.");
  const id = novoId();
  await guardarBlob(id, file);
  return { file_uri: `local://${id}` };
}

export default { uploadPrivateFile };
