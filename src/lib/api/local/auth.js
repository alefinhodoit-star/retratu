// Autenticação local, sem backend.
//
// As palavras-passe são derivadas com PBKDF2-SHA256 (120 000 iterações) e um
// salt aleatório por utilizador. A sessão é um token opaco guardado em
// localStorage — o mesmo contrato que um backend JWT irá expor, para que a
// troca seja transparente para as páginas.
//
// Limitações assumidas nesta fase:
//   - não há envio de e-mail, por isso a recuperação de palavra-passe e o OTP
//     não funcionam (falham com uma mensagem explícita)
//   - o login com Google precisa de um servidor de OAuth

import { gravarJSON, lerJSON, novoId, removerChave } from "./storage";

const CHAVE_UTILIZADORES = "utilizadores";
const CHAVE_SESSAO = "sessao";
const ITERACOES_PBKDF2 = 120000;
const DURACAO_SESSAO_MS = 30 * 24 * 60 * 60 * 1000;

const paraHex = (buffer) =>
  [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, "0")).join("");

const paraBytes = (hex) =>
  new Uint8Array(hex.match(/.{2}/g)?.map((par) => parseInt(par, 16)) ?? []);

async function derivarHash(palavraPasse, saltHex) {
  const chave = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(palavraPasse),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: paraBytes(saltHex),
      iterations: ITERACOES_PBKDF2,
      hash: "SHA-256",
    },
    chave,
    256
  );
  return paraHex(bits);
}

const normalizarEmail = (email) => String(email || "").trim().toLowerCase();

const lerUtilizadores = () => lerJSON(CHAVE_UTILIZADORES, []);

const utilizadorPublico = (utilizador) => {
  if (!utilizador) return null;
  const { passwordHash, salt, ...publico } = utilizador;
  return publico;
};

function abrirSessao(utilizador) {
  const sessao = {
    token: novoId(),
    userId: utilizador.id,
    criadaEm: new Date().toISOString(),
    expiraEm: Date.now() + DURACAO_SESSAO_MS,
  };
  gravarJSON(CHAVE_SESSAO, sessao);
  return sessao;
}

function sessaoValida() {
  const sessao = lerJSON(CHAVE_SESSAO, null);
  if (!sessao?.token || !sessao?.userId) return null;
  if (typeof sessao.expiraEm === "number" && sessao.expiraEm < Date.now()) {
    removerChave(CHAVE_SESSAO);
    return null;
  }
  return sessao;
}

export const auth = {
  /** Devolve o utilizador da sessão atual. Lança quando não há sessão válida. */
  async me() {
    const sessao = sessaoValida();
    if (!sessao) throw new Error("Sem sessão ativa.");
    const utilizador = lerUtilizadores().find((item) => item.id === sessao.userId);
    if (!utilizador) {
      removerChave(CHAVE_SESSAO);
      throw new Error("Sessão inválida.");
    }
    return utilizadorPublico(utilizador);
  },

  isAuthenticated() {
    return Boolean(sessaoValida());
  },

  async loginViaEmailPassword(email, palavraPasse) {
    const alvo = normalizarEmail(email);
    const utilizador = lerUtilizadores().find((item) => item.email === alvo);
    if (!utilizador) throw new Error("E-mail ou palavra-passe incorretos.");

    const hash = await derivarHash(palavraPasse, utilizador.salt);
    if (hash !== utilizador.passwordHash) throw new Error("E-mail ou palavra-passe incorretos.");

    abrirSessao(utilizador);
    return utilizadorPublico(utilizador);
  },

  /**
   * Cria a conta e abre sessão imediatamente.
   * `sessaoIniciada` sinaliza às páginas que não é preciso o passo de OTP.
   */
  async register({ email, password }) {
    const alvo = normalizarEmail(email);
    const utilizadores = lerUtilizadores();
    if (utilizadores.some((item) => item.email === alvo)) {
      throw new Error("Já existe uma conta com este e-mail.");
    }

    const salt = paraHex(crypto.getRandomValues(new Uint8Array(16)));
    const passwordHash = await derivarHash(password, salt);

    const utilizador = {
      id: novoId(),
      email: alvo,
      full_name: alvo.split("@")[0],
      role: "user",
      salt,
      passwordHash,
      created_date: new Date().toISOString(),
    };

    utilizadores.push(utilizador);
    if (!gravarJSON(CHAVE_UTILIZADORES, utilizadores)) {
      throw new Error("Não foi possível guardar a conta neste navegador.");
    }

    abrirSessao(utilizador);
    return { ...utilizadorPublico(utilizador), access_token: "local", sessaoIniciada: true };
  },

  async verifyOtp() {
    const sessao = sessaoValida();
    if (!sessao) throw new Error("Sem sessão ativa.");
    return { access_token: sessao.token };
  },

  async resendOtp() {
    return { enviado: false };
  },

  /** Sem servidor de e-mail, não há link para enviar. */
  async resetPasswordRequest() {
    return { enviado: false };
  },

  async resetPassword() {
    throw new Error(
      "A recuperação de palavra-passe precisa do backend (envio de e-mail). Ainda não está disponível."
    );
  },

  setToken() {
    // A sessão é gerida por abrirSessao(); mantido para compatibilidade da API.
  },

  logout(returnTo) {
    removerChave(CHAVE_SESSAO);
    if (typeof returnTo === "string") {
      window.location.href = "/";
    }
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

export default auth;
