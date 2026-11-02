import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/** Navegação suave para uma secção da página inicial, a partir de qualquer página. */
export function useSectionNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return useCallback(
    (id) => {
      const scroll = () =>
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

      if (pathname === "/") {
        scroll();
      } else {
        navigate("/");
        setTimeout(scroll, 150);
      }
    },
    [navigate, pathname]
  );
}