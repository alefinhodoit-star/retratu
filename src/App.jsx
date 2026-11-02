import { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import { CartProvider } from '@/lib/cart';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Navigate } from 'react-router-dom';
import SiteLayout from '@/components/site/SiteLayout';
import AdminGuard from '@/components/admin/AdminGuard';
// A Home fica estática de propósito: é a rota do LCP e um chunk próprio
// acrescentaria um pedido em série antes da primeira pintura.
import Home from '@/pages/Home';

// Rotas sob pedido. O painel /admin deixa de entrar no bundle do visitante anónimo.
const AdminLayout = lazy(() => import('@/components/admin/AdminLayout'));
const AdminPainel = lazy(() => import('@/pages/admin/Painel'));
const AdminPedidos = lazy(() => import('@/pages/admin/Pedidos'));
const AdminContactos = lazy(() => import('@/pages/admin/Contactos'));
const AdminPacotes = lazy(() => import('@/pages/admin/Pacotes'));
const AdminLoja = lazy(() => import('@/pages/admin/Loja'));
const Loja = lazy(() => import('@/pages/Loja'));
const Blog = lazy(() => import('@/pages/Blog'));
const BlogPost = lazy(() => import('@/pages/BlogPost'));
const Legal = lazy(() => import('@/pages/Legal'));
const Conta = lazy(() => import('@/pages/Conta'));
const Edicao = lazy(() => import('@/pages/Edicao'));
const EdicaoObrigado = lazy(() => import('@/pages/EdicaoObrigado'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));
// O PageNotFound fica estático (import na linha 6): medi que movê-lo para lazy
// faz o rolldown fundir o SDK no chunk de entrada e o entry subir de 297 para 437 kB.

/** Fallback de carregamento da marca. Reserva 70vh para o conteúdo não saltar (CLS). */
const ACarregar = () => (
  <div
    role="status"
    aria-live="polite"
    className="flex min-h-[70vh] w-full flex-col items-center justify-center gap-4"
  >
    <div
      aria-hidden="true"
      className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent"
    />
    <p className="text-[0.8rem] uppercase tracking-[0.2em] text-muted-foreground">A carregar</p>
  </div>
);

/**
 * Suspense por rota (e não um único em volta de <Routes>) para que o
 * SiteLayout — header, footer e carrinho — permaneça montado durante a navegação.
 */
const Rota = ({ children }) => <Suspense fallback={<ACarregar />}>{children}</Suspense>;

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-4 bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent" />
        <p className="text-[0.8rem] uppercase tracking-[0.2em] text-muted-foreground">A carregar</p>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/loja" element={<Rota><Loja /></Rota>} />
        <Route path="/edicao" element={<Rota><Edicao /></Rota>} />
        <Route path="/edicao/obrigado" element={<Rota><EdicaoObrigado /></Rota>} />
        <Route path="/blog" element={<Rota><Blog /></Rota>} />
        <Route path="/blog/:slug" element={<Rota><BlogPost /></Rota>} />
        <Route path="/termos" element={<Rota><Legal tipo="termos" /></Rota>} />
        <Route path="/privacidade" element={<Rota><Legal tipo="privacidade" /></Rota>} />
        <Route path="/reembolso" element={<Rota><Legal tipo="reembolso" /></Rota>} />
        <Route
          element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}
        >
          <Route path="/conta" element={<Rota><Conta /></Rota>} />
        </Route>
      </Route>
      <Route
        element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}
      >
        <Route element={<AdminGuard />}>
          <Route path="/admin" element={<Rota><AdminLayout /></Rota>}>
            <Route index element={<Rota><AdminPainel /></Rota>} />
            <Route path="pedidos" element={<Rota><AdminPedidos /></Rota>} />
            <Route path="contactos" element={<Rota><AdminContactos /></Rota>} />
            <Route path="pacotes" element={<Rota><AdminPacotes /></Rota>} />
            <Route path="loja" element={<Rota><AdminLoja /></Rota>} />
          </Route>
        </Route>
      </Route>
      <Route path="/login" element={<Rota><Login /></Rota>} />
      <Route path="/register" element={<Rota><Register /></Rota>} />
      <Route path="/forgot-password" element={<Rota><ForgotPassword /></Rota>} />
      <Route path="/reset-password" element={<Rota><ResetPassword /></Rota>} />
      <Route path="*" element={<Rota><PageNotFound /></Rota>} />
    </Routes>
  );
};

function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <CartProvider>
          <Router>
            <ScrollToTop />
            <AuthenticatedApp />
          </Router>
        </CartProvider>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App