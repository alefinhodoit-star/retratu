import { db } from "@/lib/api";

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

const inicial = (pacote) => ({
  nome: pacote?.nome || "",
  slug: pacote?.slug || "",
  preco: pacote?.preco ?? "",
  tag: pacote?.tag || "",
  descricao: pacote?.descricao || "",
  inclui: (pacote?.inclui || []).join("\n"),
  destaque: Boolean(pacote?.destaque),
  ativo: pacote?.ativo !== false,
  ordem: pacote?.ordem ?? 0,
});

export default function PacoteDialogo({ pacote, aoGuardar, children }) {
  const [aberto, setAberto] = useState(false);
  const [form, setForm] = useState(inicial(pacote));
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState("");

  const alterar = (campo, valor) => setForm((atual) => ({ ...atual, [campo]: valor }));

  const abrir = (estado) => {
    if (estado) setForm(inicial(pacote));
    setErro("");
    setAberto(estado);
  };

  const guardar = async () => {
    if (!form.nome.trim()) {
      setErro("Indique o nome do pacote.");
      return;
    }
    if (!String(form.preco).trim()) {
      setErro("Indique o preço final do pacote.");
      return;
    }

    setOcupado(true);
    setErro("");
    const dados = {
      nome: form.nome.trim(),
      slug: form.slug.trim() || slugDe(form.nome),
      preco: Number(String(form.preco).replace(",", ".")) || 0,
      tag: form.tag.trim(),
      descricao: form.descricao.trim(),
      inclui: form.inclui
        .split("\n")
        .map((linha) => linha.trim())
        .filter(Boolean),
      destaque: form.destaque,
      ativo: form.ativo,
      ordem: Number(form.ordem) || 0,
    };

    try {
      if (pacote) await db.entities.Package.update(pacote.id, dados);
      else await db.entities.Package.create(dados);
      setAberto(false);
      aoGuardar();
    } catch (e) {
      setErro("Não foi possível guardar o pacote.");
    } finally {
      setOcupado(false);
    }
  };

  const eliminar = async () => {
    await db.entities.Package.delete(pacote.id);
    setAberto(false);
    aoGuardar();
  };

  return (
    <Dialog open={aberto} onOpenChange={abrir}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{pacote ? "Editar pacote" : "Novo pacote"}</DialogTitle>
          <DialogDescription>
            Preços finais ao consumidor, com IVA à taxa legal de 23% incluído.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="pacote-nome">Nome</Label>
              <Input
                id="pacote-nome"
                value={form.nome}
                onChange={(evento) => alterar("nome", evento.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="pacote-preco">Preço final (€)</Label>
              <Input
                id="pacote-preco"
                inputMode="decimal"
                value={form.preco}
                onChange={(evento) => alterar("preco", evento.target.value)}
                className="mt-2"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="pacote-tag">Etiqueta</Label>
              <Input
                id="pacote-tag"
                value={form.tag}
                onChange={(evento) => alterar("tag", evento.target.value)}
                placeholder="Ex.: Recomendado"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="pacote-ordem">Ordem</Label>
              <Input
                id="pacote-ordem"
                type="number"
                value={form.ordem}
                onChange={(evento) => alterar("ordem", evento.target.value)}
                className="mt-2"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="pacote-slug">Identificador</Label>
            <Input
              id="pacote-slug"
              value={form.slug}
              onChange={(evento) => alterar("slug", evento.target.value)}
              placeholder={slugDe(form.nome) || "gerado a partir do nome"}
              className="mt-2"
            />
            <p className="mt-2 text-[0.8rem] text-muted-foreground">
              Usado no carrinho e nos pedidos. Deixe vazio para ser criado automaticamente.
            </p>
          </div>

          <div>
            <Label htmlFor="pacote-descricao">Descrição</Label>
            <Textarea
              id="pacote-descricao"
              rows={3}
              value={form.descricao}
              onChange={(evento) => alterar("descricao", evento.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="pacote-inclui">O que inclui (uma linha por item)</Label>
            <Textarea
              id="pacote-inclui"
              rows={5}
              value={form.inclui}
              onChange={(evento) => alterar("inclui", evento.target.value)}
              className="mt-2"
            />
          </div>

          <div className="flex flex-wrap items-center gap-8">
            <label className="flex items-center gap-3 text-[0.92rem]">
              <Switch
                checked={form.destaque}
                onCheckedChange={(valor) => alterar("destaque", valor)}
              />
              Em destaque na página inicial
            </label>
            <label className="flex items-center gap-3 text-[0.92rem]">
              <Switch checked={form.ativo} onCheckedChange={(valor) => alterar("ativo", valor)} />
              Visível no site
            </label>
          </div>
        </div>

        <DialogFooter className="flex-wrap items-center justify-between gap-3 sm:justify-between">
          {pacote ? (
            <ConfirmarEliminar etiqueta="este pacote" aoEliminar={eliminar} />
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