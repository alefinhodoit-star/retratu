// Ponto único de acesso a dados.
//
// Hoje: adaptador local (localStorage + IndexedDB).
// Amanhã: adaptador HTTP para o backend Node + SQLite, com a mesma forma.
//
// Os componentes importam `db` daqui e não sabem qual dos adaptadores está ativo.

import { auth } from "./local/auth";
import { entities } from "./local/entities";
import { uploadPrivateFile } from "./local/files";

export const db = {
  auth,
  entities,
  integrations: {
    Core: {
      UploadPrivateFile: ({ file }) => uploadPrivateFile(file),
    },
  },
  app: {
    async getPublicSettings() {
      return { id: "retratu-local", public_settings: {} };
    },
  },
};

export default db;
