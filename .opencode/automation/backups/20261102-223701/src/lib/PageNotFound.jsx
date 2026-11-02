import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Home, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";

const ATALHOS = [
  { label: "Pacotes de retratos", to: "/#pacotes" },
  { label: "Loja", to: "/loja" },
  { label: "Blog", to: "/blog" },
  { label: "Perguntas frequentes", to: "/#faq" },
];

export default function PageNotFound() {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6 py-20">
      <div className="w-full max-w-xl text-center">
        <p className="eyebrow">Erro 404</p>

        <h1 className="mt-6 text-balance font-display text-[2.2rem] leading-[1.08] sm:text-[3rem]">
          Esta página não existe — ou mudou de lugar.
        </h1>

        <p className="mx-auto mt-6 max-w-md text-pretty text-muted-foreground">
          O endereço <span className="font-medium text-foreground">{pathname}</span> não foi
          encontrado. Não é nada consigo: às vezes os links ficam desatualizados. Vamos pô-lo no
          caminho certo.
        </p>

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild className="h-12 rounded-full px-7">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Voltar ao início
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-12 rounded-full px-7">
            <Link to="/#contactos">
              <Mail className="mr-2 h-4 w-4" />
              Falar connosco
            </Link>
          </Button>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <p className="eyebrow">Talvez procure</p>
          <ul className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-3 text-[0.92rem]">
            {ATALHOS.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
