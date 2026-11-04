import { createContext, useCallback, useContext, useEffect, useState } from "react";

import { db } from "@/lib/api";

const AuthContext = createContext(undefined);

/**
 * Estado de sessão da aplicação.
 *
 * O contrato mantém-se igual ao que as páginas já consomem. A diferença é que
 * já não há "public settings" da plataforma: a sessão é lida do adaptador em
 * `src/lib/api` e, quando o backend entrar, só esse adaptador muda.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  const checkUserAuth = useCallback(async () => {
    setIsLoadingAuth(true);
    try {
      const atual = await db.auth.me();
      setUser(atual);
      setIsAuthenticated(true);
      setAuthError(null);
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoadingAuth(false);
      setAuthChecked(true);
    }
  }, []);

  useEffect(() => {
    checkUserAuth();
  }, [checkUserAuth]);

  const logout = useCallback((redirecionar = true) => {
    setUser(null);
    setIsAuthenticated(false);
    db.auth.logout(redirecionar ? "/" : undefined);
  }, []);

  const navigateToLogin = useCallback(() => {
    db.auth.redirectToLogin(window.location.pathname + window.location.search);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoadingAuth,
        // Já não existe carregamento de definições públicas da plataforma.
        isLoadingPublicSettings: false,
        authError,
        appPublicSettings: null,
        authChecked,
        logout,
        navigateToLogin,
        checkUserAuth,
        checkAppState: checkUserAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
