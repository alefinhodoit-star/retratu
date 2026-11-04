import { db } from "@/lib/api";

import { useEffect, useState } from "react";

import Hero from "@/components/site/Hero";
import HowItWorks from "@/components/site/HowItWorks";
import Gallery from "@/components/site/Gallery";
import Pricing from "@/components/site/Pricing";
import Upsells from "@/components/site/Upsells";
import B2B from "@/components/site/B2B";
import Testimonials from "@/components/site/Testimonials";
import About from "@/components/site/About";
import PrivacyPromise from "@/components/site/PrivacyPromise";
import FaqCompra from "@/components/site/FaqCompra";
import Contact from "@/components/site/Contact";
import { PACOTES_PADRAO } from "@/lib/pacotes";

export default function Home() {
  // Arranca com o catálogo padrão para a secção nunca aparecer vazia; os
  // pacotes reais da app Base44 substituem-no assim que existirem.
  const [pacotes, setPacotes] = useState(PACOTES_PADRAO);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;
    db.entities.Package.filter({ ativo: true }, { sort: "ordem", limit: 12 })
      .then((res) => {
        if (!ativo) return;
        const items = Array.isArray(res?.items) ? res.items : [];
        if (items.length > 0) setPacotes(items);
      })
      .catch(() => {
        // Sem backend configurado mantém-se o catálogo padrão.
      })
      .finally(() => ativo && setCarregando(false));
    return () => {
      ativo = false;
    };
  }, []);

  const principal = pacotes.find((p) => p.destaque) || pacotes[0];

  return (
    <>
      <Hero />
      <HowItWorks />
      <Gallery />
      <PrivacyPromise />
      <Pricing pacotes={pacotes} carregando={carregando} />
      <Upsells pacotePrincipal={principal} />
      <B2B />
      <Testimonials />
      <About />
      <FaqCompra />
      <Contact />
    </>
  );
}