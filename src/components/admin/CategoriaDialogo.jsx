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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import ConfirmarEliminar from "@/components/admin/ConfirmarEliminar";
import { slugDe } from "@/lib/loja";

const inicial = (categoria) => ({
  nome: categoria?.nome || "",
  curto: categoria?.curto || "",
  slug: categoria?.slug || "",
  resumo: categoria?.resumo || "",
  ordem: categoria?.ordem ?? 0,
  ativo: categoria?.ativo !== false,
});

export default function CategoriaDialogo({ categoria, aoGuardar, children }) {
  const [aberto, setAberto] = useState(false);
  const [form, setForm] = useState(inicial(categoria));
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState("");

  const alterar = (campo, valor) => setForm((atual) => ({ ...atual, [campo]: valor }));

  const abrir = (estado) => {
    if (estado) setForm(inicial(categoria));
    setErro("");
    setAberto(estado);
  };

  const guardar = async () => {
    if (!form.nome.trim()) {
      setErro("Indique o nome da categoria.");
      return;
    }

    setOcupado(true);
    setErro("");
    const slug = form.slug.trim() || slugDe(form.nome);
    const dados = {
      nome: form.nome.trim(),
      curto: form.curto.trim() || form.nome.trim(),
      slug,
      resumo: form.resumo.trim(),
      ordem: Number(form.ordem) || 0,
      ativo: form.ativo,
    };

    try {
      if (categoria) {
        await db.entities.CategoriaLoja.update(categoria.id, dados);
        if (slug !== categoria.slug) {
          const antigos = await db.entities.ProdutoLoja.filter(
            { categoria_slug: categoria.slug },
            { limit: 200 }
          );
          if (antigos.items.length > 0) {
            await db.entities.ProdutoLoja.bulkUpdate(
              antigos.items.map((produto) => ({ id: produto.id, categoria_slug: slug }))
            );
          }
        }
      } else {
        await db.entities.CategoriaLoja.create(dados);
      }
      setAberto(false);
      aoGuardar();
    } catch (e) {
      setErro("Não foi possível guardar a categoria.");
    } finally {
      setOcupado(false);
    }
  };

  const eliminar = async () => {
    await db.entities.CategoriaLoja.delete(categoria.id);
    setAberto(false);
    aoGuardar();
  };

  return (
    <Dialog open={aberto} onOpenChange={abrir}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{categoria ? "Editar categoria" : "Nova categoria"}</DialogTitle>
          <DialogDescription>
            As categorias organizam a página da loja. Apenas as categorias visíveis e com produtos
            aparecem no site.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div>
            <Label htmlFor="categoria-nome">Nome</Label>
            <Input
              id="categoria-nome"
              value={form.nome}
              onChange={(evento) => alterar("nome", evento.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="categoria-curto">Nome curto (botões de navegação)</Label>
            <Input
              id="categoria-curto"
              value={form.curto}
              onChange={(evento) => alterar("curto", evento.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="categoria-slug">Identificador</Label>
            <Input
              id="categoria-slug"
              value={form.slug}
              onChange={(evento) => alterar("slug", evento.target.value)}
              placeholder={slugDe(form.nome) || "gerado a partir do nome"}
              className="mt-2"
            />
            <p className="mt-2 text-[0.8rem] text-muted-foreground">
              Os produtos desta categoria são atualizados automaticamente se mudar o identificador.
            </p>
          </div>

          <div>
            <Label htmlFor="categoria-resumo">Resumo</Label>
            <Textarea
              id="categoria-resumo"
              rows={3}
              value={form.resumo}
              onChange={(evento) => alterar("resumo", evento.target.value)}
              className="mt-2"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="categoria-ordem">Ordem</Label>
              <Input
                id="categoria-ordem"
                type="number"
                value={form.ordem}
                onChange={(evento) => alterar("ordem", evento.target.value)}
                className="mt-2"
              />
            </div>
            <label className="flex items-center gap-3 self-end text-[0.92rem] sm:pb-3">
              <Switch checked={form.ativo} onCheckedChange={(valor) => alterar("ativo", valor)} />
              Visível no site
            </label>
          </div>
        </div>

        <DialogFooter className="flex-wrap items-center justify-between gap-3 sm:justify-between">
          {categoria ? (
            <ConfirmarEliminar
              etiqueta="esta categoria"
              aoEliminar={eliminar}
            />
          ) : (
            <span />
          )}
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