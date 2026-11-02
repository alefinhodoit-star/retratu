import { db } from "@/api/base44Client";

import { useEffect, useState } from "react";

export const slugDe = (texto) =>
  (texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/** Constrói a estrutura da loja (categorias → grupos → itens) a partir dos dados guardados. */
export const montarCatalogo = (categorias = [], produtos = []) =>
  categorias
    .filter((categoria) => categoria.ativo !== false && categoria.slug)
    .map((categoria) => {
      const grupos = [];

      produtos
        .filter(
          (produto) =>
            produto.categoria_slug === categoria.slug && produto.ativo !== false && produto.nome
        )
        .forEach((produto) => {
          const titulo = produto.grupo || "Opções";
          let grupo = grupos.find((item) => item.titulo === titulo);
          if (!grupo) {
            grupo = { titulo, nota: produto.nota_grupo || "", itens: [] };
            grupos.push(grupo);
          }
          grupo.itens.push({
            id: produto.id,
            nome: produto.nome,
            detalhe: produto.detalhe,
            imagem: produto.imagem,
            preco: produto.preco,
          });
        });

      return {
        id: categoria.slug,
        nome: categoria.nome,
        curto: categoria.curto || categoria.nome,
        resumo: categoria.resumo,
        grupos,
      };
    })
    .filter((categoria) => categoria.grupos.length > 0);

export const useCatalogo = () => {
  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;
    Promise.all([
      db.entities.CategoriaLoja.list({ sort: "ordem", limit: 50 }),
      db.entities.ProdutoLoja.list({ sort: "ordem", limit: 200 }),
    ])
      .then(([listaCategorias, listaProdutos]) => {
        if (!ativo) return;
        setCategorias(montarCatalogo(listaCategorias.items, listaProdutos.items));
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });
    return () => {
      ativo = false;
    };
  }, []);

  return { categorias, carregando };
};