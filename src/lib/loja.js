// @ts-check

import { db } from "@/api/base44Client";

import { useEffect, useState } from "react";

/**
 * @param {string} texto
 * @returns {string} slug em minúsculas, sem acentos nem caracteres especiais
 */
export const slugDe = (texto) =>
  (texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/**
 * Registo de `CategoriaLoja`. Só os campos usados por `montarCatalogo` são
 * tipados; os restantes chegam do backend e não são lidos aqui.
 * @typedef {Object} CategoriaGuardada
 * @property {string} slug obrigatório no esquema da entidade
 * @property {string} nome obrigatório no esquema da entidade
 * @property {string} [curto]
 * @property {string} [resumo]
 * @property {boolean} [ativo]
 */

/**
 * Registo de `ProdutoLoja`.
 * @typedef {Object} ProdutoGuardado
 * @property {string} [id] campo de sistema atribuído pelo Base44
 * @property {string} nome obrigatório no esquema da entidade
 * @property {string} categoria_slug obrigatório no esquema da entidade
 * @property {string} [grupo]
 * @property {string} [nota_grupo]
 * @property {string} [detalhe]
 * @property {string} [imagem]
 * @property {number} [preco]
 * @property {boolean} [ativo]
 */

/**
 * @typedef {Object} ItemCatalogo
 * @property {string | undefined} id
 * @property {string} nome
 * @property {string | undefined} detalhe
 * @property {string | undefined} imagem
 * @property {number | undefined} preco
 */

/**
 * @typedef {Object} GrupoCatalogo
 * @property {string} titulo
 * @property {string} nota
 * @property {ItemCatalogo[]} itens
 */

/**
 * @typedef {Object} CategoriaCatalogo
 * @property {string} id
 * @property {string | undefined} nome
 * @property {string | undefined} curto
 * @property {string | undefined} resumo
 * @property {GrupoCatalogo[]} grupos
 */

/**
 * Constrói a estrutura da loja (categorias → grupos → itens) a partir dos dados guardados.
 * @param {CategoriaGuardada[]} [categorias]
 * @param {ProdutoGuardado[]} [produtos]
 * @returns {CategoriaCatalogo[]}
 */
export const montarCatalogo = (categorias = [], produtos = []) =>
  categorias
    .filter((categoria) => categoria.ativo !== false && categoria.slug)
    .map((categoria) => {
      /** @type {GrupoCatalogo[]} */
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

/** @returns {{ categorias: CategoriaCatalogo[], carregando: boolean }} */
export const useCatalogo = () => {
  const [categorias, setCategorias] = useState(/** @type {CategoriaCatalogo[]} */ ([]));
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;
    Promise.all([
      db.entities.CategoriaLoja.list({ sort: "ordem", limit: 50 }),
      db.entities.ProdutoLoja.list({ sort: "ordem", limit: 200 }),
    ])
      .then(([listaCategorias, listaProdutos]) => {
        if (!ativo) return;
        // O SDK devolve `any`; o contrato usado a partir daqui é o definido acima.
        const categoriasGuardadas = /** @type {CategoriaGuardada[]} */ (
          /** @type {unknown} */ (listaCategorias.items)
        );
        const produtosGuardados = /** @type {ProdutoGuardado[]} */ (
          /** @type {unknown} */ (listaProdutos.items)
        );
        setCategorias(montarCatalogo(categoriasGuardadas, produtosGuardados));
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