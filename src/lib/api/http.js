// Adaptador HTTP para o backend Node + SQLite.
//
// Expõe exatamente a mesma forma que o adaptador local (`auth`, `entities`,
// `integrations`, `app`), por isso nenhuma página precisa de saber qual está
// ativo. Ativa-se definindo `VITE_API_URL` (ex.: `/api`).

import { gravarJSON, lerJSON, removerChave } from "./local/storage";

const CHAVE_TOKEN = "token";

const NOMES_ENTIDADES = [
  "Package",
  "BlogPost",
  "CategoriaLoja",
  "ProdutoLoja",
  "Order",
  "Lead",
  "PedidoEdicao",
];

export function criarApiHttp(baseUrl) {
  const raiz = String(baseUrl || "").replace(/\/$/, "");

  async function pedido(caminho, { metodo = "GET", corpo } = {}) {
    const token = lerJSON(CHAVE_TOKEN, null);

    const resposta = await fetch(`${raiz}${caminho}`, {
      method: metodo,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
    });

    const dados = await resposta.json().catch(() => ({}));

    if (!resposta.ok) {
      throw new Error(dados.error || "Não foi possível contactar o servidor.");
    }

    return dados;
  }

  const guardarToken = (token) => gravarJSON(CHAVE_TOKEN, token || null);

  const auth = {
    async me() {
      // Sem token não vale a pena bater na API: evita um 401 em cada visita anónima.
      if (!lerJSON(CHAVE_TOKEN, null)) throw new Error("Sem sessão ativa.");
      return pedido("/auth/me");
    },

    isAuthenticated() {
      return Boolean(lerJSON(CHAVE_TOKEN, null));
    },

    async loginViaEmailPassword(email, palavraPasse) {
      const resultado = await pedido("/auth/login", {
        metodo: "POST",
        corpo: { email, password: palavraPasse },
      });
      guardarToken(resultado.access_token);
      return resultado;
    },

    async register({ email, password }) {
      const resultado = await pedido("/auth/register", {
        metodo: "POST",
        corpo: { email, password },
      });
      guardarToken(resultado.access_token);
      return resultado;
    },

    async verifyOtp() {
      return { access_token: lerJSON(CHAVE_TOKEN, null) };
    },

    async resendOtp() {
      return { enviado: false };
    },

    async resetPasswordRequest(email) {
      await pedido("/auth/password-reset", { metodo: "POST", corpo: { email } });
      return { enviado: true };
    },

    async resetPassword() {
      throw new Error(
        "A recuperação de palavra-passe ainda não está disponível. Contacte contacto@retratu.pt."
      );
    },

    setToken(token) {
      guardarToken(token);
    },

    logout(returnTo) {
      removerChave(CHAVE_TOKEN);
      pedido("/auth/logout", { metodo: "POST" }).catch(() => {});
      if (typeof returnTo === "string") window.location.href = "/";
    },

    redirectToLogin(returnTo) {
      const destino = typeof returnTo === "string" && returnTo.startsWith("/") ? returnTo : "/";
      window.location.assign(`/login?returnTo=${encodeURIComponent(destino)}`);
    },

    async loginWithProvider() {
      throw new Error(
        "O início de sessão com Google precisa de um servidor de OAuth. Ainda não está disponível."
      );
    },
  };

  function entidade(nome) {
    return {
      list: (opcoes = {}) =>
        pedido(`/entities/${nome}/query`, {
          metodo: "POST",
          corpo: { sort: opcoes.sort, limit: opcoes.limit },
        }),

      filter: (filtro = {}, opcoes = {}) =>
        pedido(`/entities/${nome}/query`, {
          metodo: "POST",
          corpo: { filtro, sort: opcoes.sort, limit: opcoes.limit },
        }),

      count: (filtro = {}) =>
        pedido(`/entities/${nome}/count`, { metodo: "POST", corpo: { filtro } }).then(
          (resultado) => resultado.total
        ),

      aggregate: (opcoes = {}) =>
        pedido(`/entities/${nome}/aggregate`, { metodo: "POST", corpo: opcoes }),

      create: (dados) => pedido(`/entities/${nome}`, { metodo: "POST", corpo: dados }),

      bulkCreate: (items) =>
        pedido(`/entities/${nome}/bulk`, { metodo: "POST", corpo: { items } }),

      update: (id, dados) => pedido(`/entities/${nome}/${id}`, { metodo: "PATCH", corpo: dados }),

      bulkUpdate: (items) =>
        pedido(`/entities/${nome}/bulk-update`, { metodo: "POST", corpo: { items } }),

      delete: (id) => pedido(`/entities/${nome}/${id}`, { metodo: "DELETE" }),

      get: (id) => pedido(`/entities/${nome}/${id}`),
    };
  }

  const entities = Object.fromEntries(NOMES_ENTIDADES.map((nome) => [nome, entidade(nome)]));

  const integrations = {
    Core: {
      async UploadPrivateFile({ file }) {
        const token = lerJSON(CHAVE_TOKEN, null);
        const formulario = new FormData();
        formulario.append("file", file);

        const resposta = await fetch(`${raiz}/files`, {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formulario,
        });

        const dados = await resposta.json().catch(() => ({}));
        if (!resposta.ok) throw new Error(dados.error || "Não foi possível carregar o ficheiro.");
        return dados;
      },
    },
  };

  const app = {
    async getPublicSettings() {
      return { id: "retratu", public_settings: {} };
    },
  };

  return { auth, entities, integrations, app };
}

export default criarApiHttp;
