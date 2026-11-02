import { db } from "@/api/base44Client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import ConfirmarEliminar from "@/components/admin/ConfirmarEliminar";
import ProdutoImagem from "@/components/admin/ProdutoImagem";

const inicial = (produto, categoriaInicial) => ({
  nome: produto?.nome || "",
  categoria_slug: produto?.categoria_slug || categoriaInicial || "",
  grupo: produto?.grupo || "",
  detalhe: produto?.detalhe || "",
  imagem: produto?.imagem || "",
  preco: produto?.preco ?? "",
  nota_grupo: produto?.nota_grupo || "",
  ordem: produto?.ordem ?? 0,
  ativo: produto?.ativo !== false,
});

export default function ProdutoDialogo({
  produto,
  categoriaInicial,
  categorias,
  aoGuardar,
  children,
}) {
  const [aberto, setAberto] = useState(false);
  const [form, setForm] = useState(inicial(produto, categoriaInicial));
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState("");

  const alterar = (campo, valor) => setForm((atual) => ({ ...atual, [campo]: valor }));

  const abrir = (estado) => {
    if (estado) setForm(inicial(produto, categoriaInicial));
    setErro("");
    setAberto(estado);
  };

  const guardar = async () => {
    if (!form.nome.trim()) {
      setErro("Indique o nome do produto.");
      return;
    }
    if (!form.categoria_slug) {
      setErro("Escolha a categoria do produto.");
      return;
    }

    setOcupado(true);
    setErro("");
    const preco = String(form.preco).trim();
    const dados = {
      nome: form.nome.trim(),
      categoria_slug: form.categoria_slug,
      grupo: form.grupo.trim(),
      detalhe: form.detalhe.trim(),
      imagem: form.imagem || "",
      nota_grupo: form.nota_grupo.trim(),
      ordem: Number(form.ordem) || 0,
      ativo: form.ativo,
      ...(preco ? { preco: Number(preco.replace(",", ".")) || 0 } : { preco: 0 }),
    };

    try {
      if (produto) await db.entities.ProdutoLoja.update(produto.id, dados);
      else await db.entities.ProdutoLoja.create(dados);
      setAberto(false);
      aoGuardar();
    } catch (e) {
      setErro("Não foi possível guardar o produto.");
    } finally {
      setOcupado(false);
    }
  };

  const eliminar = async () => {
    await db.entities.ProdutoLoja.delete(produto.id);
    setAberto(false);
    aoGuardar();
  };

  return (
    <Dialog open={aberto} onOpenChange={abrir}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{produto ? "Editar produto" : "Novo produto"}</DialogTitle>
          <DialogDescription>
            Sem preço definido, o produto continua a ser apresentado como orçamento à medida.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div>
            <Label htmlFor="produto-nome">Nome</Label>
            <Input
              id="produto-nome"
              value={form.nome}
              onChange={(evento) => alterar("nome", evento.target.value)}
              className="mt-2"
            />
          </div>

          <ProdutoImagem valor={form.imagem} aoAlterar={(url) => alterar("imagem", url)} />

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="produto-categoria">Categoria</Label>
              <Select
                value={form.categoria_slug}
                onValueChange={(valor) => alterar("categoria_slug", valor)}
              >
                <SelectTrigger id="produto-categoria" className="mt-2">
                  <SelectValue placeholder="Escolha a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((categoria) => (
                    <SelectItem key={categoria.slug} value={categoria.slug}>
                      {categoria.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="produto-grupo">Grupo</Label>
              <Input
                id="produto-grupo"
                value={form.grupo}
                onChange={(evento) => alterar("grupo", evento.target.value)}
                placeholder="Ex.: Formatos"
                className="mt-2"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="produto-preco">Preço desde (€, opcional)</Label>
              <Input
                id="produto-preco"
                inputMode="decimal"
                value={form.preco}
                onChange={(evento) => alterar("preco", evento.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="produto-ordem">Ordem</Label>
              <Input
                id="produto-ordem"
                type="number"
                value={form.ordem}
                onChange={(evento) => alterar("ordem", evento.target.value)}
                className="mt-2"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="produto-detalhe">Detalhe</Label>
            <Input
              id="produto-detalhe"
              value={form.detalhe}
              onChange={(evento) => alterar("detalhe", evento.target.value)}
              placeholder="Ex.: 23 x 31 cm"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="produto-nota">Nota do grupo (opcional)</Label>
            <Input
              id="produto-nota"
              value={form.nota_grupo}
              onChange={(evento) => alterar("nota_grupo", evento.target.value)}
              className="mt-2"
            />
            <p className="mt-2 text-[0.8rem] text-muted-foreground">
              Aparece sob o título do grupo, no primeiro produto que a tiver.
            </p>
          </div>

          <label className="flex items-center gap-3 text-[0.92rem]">
            <Switch checked={form.ativo} onCheckedChange={(valor) => alterar("ativo", valor)} />
            Visível no site
          </label>
        </div>

        <DialogFooter className="flex-wrap items-center justify-between gap-3 sm:justify-between">
          {produto ? <ConfirmarEliminar etiqueta="este produto" aoEliminar={eliminar} /> : <span />}
          <span className="flex flex-wrap items-center gap-3">
            {erro && <span className="text-[0.85rem] text-destructive">{erro}</span>}
            <Button
              type="button"
              variant="outline"
              onClick={() => setAberto(false)}
              className="rounded-full"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              disabled={ocupado}
              onClick={guardar}
              className="rounded-full px-6"
            >
              {ocupado ? <Loader2 className="h-4 w-4 animate-spin" /> : "Guardar"}
            </Button>
          </span>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}