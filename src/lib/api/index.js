// Ponto único de acesso a dados.
//
// Dois adaptadores com a mesma forma:
//   - local  (localStorage + IndexedDB) — quando `VITE_API_URL` não está definido
//   - http   (Node + SQLite)            — quando `VITE_API_URL` aponta para a API
//
// Os componentes importam `db` daqui e não sabem qual está ativo.

import { criarApiHttp } from "./http";
import { auth } from "./local/auth";
import { entities } from "./local/entities";
import { uploadPrivateFile } from "./local/files";

const adaptadorLocal = {
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

// Por omissão usa a API (`/api`, mesma origem, com proxy em desenvolvimento).
// `VITE_API_URL=local` força o adaptador local — útil para demo offline.
const urlApi = import.meta.env.VITE_API_URL ?? "/api";

export const db = urlApi === "local" ? adaptadorLocal : criarApiHttp(urlApi);

export const modo = urlApi === "local" ? "local" : "http";

export default db;
