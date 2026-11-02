import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import CartButton from "@/components/cart/CartButton";
import { Image } from "@/components/ui/image";
import { MEDIA } from "@/lib/media";
import { useSectionNav } from "@/lib/useSectionNav";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { label: "Pacotes", id: "pacotes" },
  { label: "Como funciona", id: "como-funciona" },
  { label: "Exemplos", id: "exemplos" },
  { label: "Empresas", id: "empresas" },
];

const PAGINAS = [
  { label: "Loja", to: "/loja" },
  { label: "Blog", to: "/blog" },
];

export default function Header({ user }) {
  const [aberto, setAberto] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const botaoMenuRef = useRef(null);
  const irPara = useSectionNav();
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setAberto(false), [pathname]);

  // Fecho com Esc devolve o foco ao botão que abriu o menu.
  useEffect(() => {
    if (!aberto) return undefined;
    const onKeyDown = (e) => {
      if (e.key !== "Escape") return;
      setAberto(false);
      botaoMenuRef.current?.focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [aberto]);

  const navegar = (id) => {
    setAberto(false);
    irPara(id);
  };

  return (
    <>
      <div className="border-b border-border/70 bg-foreground text-background">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-1 px-6 py-2 text-center text-[0.72rem] tracking-[0.02em] text-background/70 sm:justify-between">
          <span>Estúdio digital português · retratos para pessoas e equipas</span>
          <span className="flex items-center gap-2">
            <span aria-hidden="true" className="hidden h-1 w-1 rounded-full bg-accent sm:inline-block" />
            Resposta em até 1 dia útil ·{" "}
            <a href="mailto:ola@retratu.pt" className="text-background underline-offset-4 hover:underline">
              ola@retratu.pt
            </a>
          </span>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-40 border-b transition-colors duration-300",
          scrolled || aberto
            ? "border-border bg-background/95 backdrop-blur"
            : "border-transparent bg-background/80 backdrop-blur-sm"
        )}
      >
        <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-6 px-6">
          <Link
            to="/"
            onClick={() => setAberto(false)}
            className="flex shrink-0 items-center gap-3"
            aria-label="Retratu — página inicial"
          >
            <Image
              src={MEDIA.logo}
              alt=""
              fittingType="fill"
              className="h-9 w-9 rounded-[0.35rem]"
            />
            <span className="font-display text-[1.45rem] leading-none tracking-tight">Retratu</span>
          </Link>

          <nav className="hidden items-center gap-7 text-[0.9rem] lg:flex" aria-label="Navegação principal">
            {SECTIONS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => navegar(item.id)}
                className="relative text-muted-foreground transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-accent after:transition-all hover:text-foreground hover:after:w-full"
              >
                {item.label}
              </button>
            ))}
            {PAGINAS.map((item) => {
              const ativo = pathname === item.to || pathname.startsWith(item.to + "/");
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  aria-current={ativo ? "page" : undefined}
                  className={cn(
                    "relative transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-px after:bg-accent after:transition-all hover:text-foreground",
                    ativo
                      ? "text-foreground after:w-full"
                      : "text-muted-foreground after:w-0 hover:after:w-full"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <CartButton className="hidden h-11 w-11 sm:flex" />

            {user ? (
              <Button asChild variant="ghost" className="hidden h-11 rounded-full sm:inline-flex">
                <Link to="/conta">A minha conta</Link>
              </Button>
            ) : (
              <Button asChild variant="ghost" className="hidden h-11 rounded-full sm:inline-flex">
                <Link to="/login">Entrar</Link>
              </Button>
            )}

            <Button asChild className="hidden h-11 rounded-full px-5 sm:inline-flex">
              <Link to="/edicao">
                Começar agora
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </Button>

            <button
              ref={botaoMenuRef}
              type="button"
              onClick={() => setAberto((valor) => !valor)}
              aria-label={aberto ? "Fechar menu" : "Abrir menu"}
              aria-expanded={aberto}
              aria-controls="menu-movel"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border transition-colors hover:bg-secondary lg:hidden"
            >
              {aberto ? (
                <X className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Menu className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {aberto && (
          <div id="menu-movel" className="border-t border-border bg-background lg:hidden">
            <nav className="mx-auto flex max-w-7xl flex-col px-6 py-4" aria-label="Menu móvel">
              {SECTIONS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navegar(item.id)}
                  className="flex min-h-11 items-center border-b border-border py-3 text-left text-[0.95rem] text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </button>
              ))}
              {PAGINAS.map((item) => {
                const ativo = pathname === item.to || pathname.startsWith(item.to + "/");
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    aria-current={ativo ? "page" : undefined}
                    className={cn(
                      "flex min-h-11 items-center border-b border-border py-3 text-[0.95rem] transition-colors hover:text-foreground",
                      ativo ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <Link
                to={user ? "/conta" : "/login"}
                className="flex min-h-11 items-center border-b border-border py-3 text-[0.95rem] text-muted-foreground transition-colors hover:text-foreground"
              >
                {user ? "A minha conta" : "Entrar"}
              </Link>
              <div className="flex items-center gap-3 py-4">
                <Button asChild className="h-12 flex-1 rounded-full">
                  <Link to="/edicao">Começar agora</Link>
                </Button>
                <CartButton className="h-12 w-12 sm:hidden" />
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
