import { db } from "@/lib/api";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Lock } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Passos, { PASSOS } from "@/components/edicao/Passos";
import ServiceSelector from "@/components/edicao/ServiceSelector";
import FormularioPreferencias from "@/components/edicao/FormularioPreferencias";
import ImagemOriginal from "@/components/edicao/ImagemOriginal";
import ImagemReferencia from "@/components/edicao/ImagemReferencia";
import RevisaoPedido from "@/components/edicao/RevisaoPedido";
import Consentimentos from "@/components/edicao/Consentimentos";
import Navegacao from "@/components/edicao/Navegacao";

import { esquemaPreferencias, esquemaServico, validar } from "@/lib/edicao/esquema";
import { carregarImagem, criarPedido } from "@/lib/edicao/pedidoService";
import { obterServico } from "@/lib/edicao/servicos";

const ESTADO_INICIAL = {
  servicoPrincipal: "",
  servicoPersonalizado: "",
  servicosComplementares: [],
  nomePedido: "",
  objetivo: "",
  descricao: "",
  estiloVisual: "",
  intensidade: "moderada",
  realismo: "natural",
  formato: "original",
  formatoPersonalizado: "",
  resolucao: "original",
  variacoes: "1",
  observacoes: "",
  respostas: {},
  nomeCliente: "",
  emailCliente: "",
  imagemOriginal: null,
  referencia: null,
  referenciaTipo: "",
  referenciaNotas: "",
  novidades: false,
};

const TITULOS = [
  "Escolha o serviço",
  "Personalize o pedido",
  "Imagem original",
  "Imagem de referência",
  "Reveja o pedido",
];

const SUBTITULOS = [
  "Selecione a edição principal e, se quiser, acrescente edições complementares.",
  "Estas perguntas adaptam-se ao serviço escolhido. Pode voltar atrás a qualquer momento.",
  "Carregue a fotografia que vamos editar.",
  "Mostre-nos o resultado que tem em mente.",
  "Confirme os dados antes de enviar. Nada é enviado até clicar em «Enviar pedido».",
];

export default function Edicao() {
  const navigate = useNavigate();
  const [passo, setPasso] = useState(0);
  const [dados, setDados] = useState(ESTADO_INICIAL);
  const [erros, setErros] = useState({});
  const [autorizacao, setAutorizacao] = useState(false);
  const [erroAutorizacao, setErroAutorizacao] = useState("");
  const [erroEnvio, setErroEnvio] = useState("");
  const [submetendo, setSubmetendo] = useState(false);
  const [confirmacao, setConfirmacao] = useState(null);
  const emEnvio = useRef(false);
  const topoRef = useRef(null);
  const montado = useRef(false);

  useEffect(() => {
    let ativo = true;
    db.auth
      .me()
      .then((utilizador) => {
        if (!ativo || !utilizador) return;
        setDados((atual) => ({
          ...atual,
          nomeCliente: atual.nomeCliente || utilizador.full_name || "",
          emailCliente: atual.emailCliente || utilizador.email || "",
        }));
      })
      .catch(() => {});
    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    if (!montado.current) {
      montado.current = true;
      return;
    }
    // O html tem `scroll-behavior: smooth`; quando o utilizador pede menos movimento
    // desativamos temporariamente o smooth para o salto ao topo ser imediato.
    const reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const raiz = document.documentElement;
    const scrollAnterior = raiz.style.scrollBehavior;
    if (reduzirMovimento) raiz.style.scrollBehavior = "auto";
    topoRef.current?.scrollIntoView({
      behavior: reduzirMovimento ? "auto" : "smooth",
      block: "start",
    });
    if (reduzirMovimento) raiz.style.scrollBehavior = scrollAnterior;
  }, [passo]);

  const limparErro = (chave) =>
    setErros((atual) => {
      if (!atual[chave]) return atual;
      const novo = { ...atual };
      delete novo[chave];
      return novo;
    });

  const alterar = (campo, valor) => {
    setDados((atual) => ({ ...atual, [campo]: valor }));
    limparErro(campo);
  };

  const alterarResposta = (campo, valor) => {
    setDados((atual) => ({ ...atual, respostas: { ...atual.respostas, [campo]: valor } }));
    limparErro(campo);
  };

  const aplicarServico = (slug) => {
    const perfilAntigo = obterServico(dados.servicoPrincipal)?.perfil ?? null;
    const perfilNovo = obterServico(slug)?.perfil ?? null;
    const temRespostas = Object.values(dados.respostas).some((valor) =>
      Array.isArray(valor) ? valor.length > 0 : Boolean(valor)
    );

    const aplicar = () => {
      setDados((atual) => ({
        ...atual,
        servicoPrincipal: slug,
        servicosComplementares: atual.servicosComplementares.filter((item) => item !== slug),
        respostas: perfilAntigo === perfilNovo ? atual.respostas : {},
      }));
      setErros({});
      setConfirmacao(null);
    };

    if (temRespostas && perfilAntigo !== perfilNovo) setConfirmacao(() => aplicar);
    else aplicar();
  };

  const alternarComplementar = (slug) => {
    setDados((atual) => ({
      ...atual,
      servicosComplementares: atual.servicosComplementares.includes(slug)
        ? atual.servicosComplementares.filter((item) => item !== slug)
        : [...atual.servicosComplementares, slug],
    }));
  };

  const carregar = async (chave, ficheiro) => {
    if (dados[chave]?.previewUrl) URL.revokeObjectURL(dados[chave].previewUrl);
    setDados((atual) => ({
      ...atual,
      [chave]: {
        nome: ficheiro.name,
        tamanho: ficheiro.size,
        previewUrl: URL.createObjectURL(ficheiro),
        fileUri: "",
        estado: "a_carregar",
        erro: "",
      },
    }));
    limparErro(chave);

    try {
      const fileUri = await carregarImagem(ficheiro);
      setDados((atual) => ({
        ...atual,
        [chave]: { ...atual[chave], fileUri, estado: "pronto" },
      }));
    } catch (e) {
      setDados((atual) => ({
        ...atual,
        [chave]: { ...atual[chave], estado: "erro", erro: e.message },
      }));
    }
  };

  const remover = (chave) => {
    if (dados[chave]?.previewUrl) URL.revokeObjectURL(dados[chave].previewUrl);
    setDados((atual) => ({ ...atual, [chave]: null }));
    limparErro(chave);
  };

  const validarPasso = (indice) => {
    let novos = {};

    if (indice === 0) {
      novos = validar(esquemaServico(), {
        servicoPrincipal: dados.servicoPrincipal,
        servicoPersonalizado: dados.servicoPersonalizado,
      });
    } else if (indice === 1) {
      novos = validar(esquemaPreferencias(dados.servicoPrincipal), {
        nomePedido: dados.nomePedido,
        objetivo: dados.objetivo,
        descricao: dados.descricao,
        estiloVisual: dados.estiloVisual,
        intensidade: dados.intensidade,
        realismo: dados.realismo,
        formato: dados.formato,
        formatoPersonalizado: dados.formatoPersonalizado,
        resolucao: dados.resolucao,
        variacoes: dados.variacoes,
        observacoes: dados.observacoes,
        respostas: dados.respostas,
        nomeCliente: dados.nomeCliente,
        emailCliente: dados.emailCliente,
      });
    } else if (indice === 2) {
      const servico = obterServico(dados.servicoPrincipal);
      const imagem = dados.imagemOriginal;
      if (imagem?.estado === "a_carregar") {
        novos = { imagemOriginal: "Aguarde o carregamento da imagem." };
      } else if (imagem?.estado === "erro") {
        novos = { imagemOriginal: imagem.erro };
      } else if (servico?.requerOriginal && !imagem?.fileUri) {
        novos = { imagemOriginal: "Carregue a imagem original para continuar." };
      }
    } else if (indice === 3) {
      const imagem = dados.referencia;
      if (imagem?.estado === "a_carregar") {
        novos = { referencia: "Aguarde o carregamento da imagem." };
      } else if (imagem?.estado === "erro") {
        novos = { referencia: imagem.erro };
      }
    }

    setErros(novos);
    return Object.keys(novos).length === 0;
  };

  const submeter = async () => {
    if (emEnvio.current) return;

    for (const indice of [0, 1, 2, 3]) {
      if (!validarPasso(indice)) {
        setPasso(indice);
        return;
      }
    }
    if (!autorizacao) {
      setErroAutorizacao("Confirme a autorização antes de enviar.");
      return;
    }

    setErroAutorizacao("");
    setErroEnvio("");
    emEnvio.current = true;
    setSubmetendo(true);

    try {
      const pedido = await criarPedido(dados);
      navigate(`/edicao/obrigado?pedido=${pedido.id}`, { replace: true });
    } catch (e) {
      setErroEnvio(e?.message || "Não foi possível enviar o pedido. Tente novamente.");
    } finally {
      emEnvio.current = false;
      setSubmetendo(false);
    }
  };

  const continuar = () => {
    if (passo === 4) {
      submeter();
      return;
    }
    if (!validarPasso(passo)) return;
    setErros({});
    setPasso(passo + 1);
  };

  const irPara = (indice) => {
    if (indice >= passo) return;
    setErros({});
    setErroEnvio("");
    setPasso(indice);
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-14 lg:py-20">
      <header ref={topoRef} className="scroll-mt-28">
        <span className="eyebrow">Edição com IA</span>
        <h1 className="mt-5 max-w-2xl text-balance font-display text-[2.1rem] leading-[1.05] sm:text-[2.7rem]">
          {TITULOS[passo]}
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">{SUBTITULOS[passo]}</p>
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.82rem] text-muted-foreground">
          <span className="flex items-center gap-2">
            <Lock className="h-3.5 w-3.5 text-accent" aria-hidden="true" /> Ficheiros privados, eliminados após a entrega
          </span>
          <span className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-accent" aria-hidden="true" /> Pode voltar atrás em qualquer passo
          </span>
        </div>
      </header>

      <div className="mt-9">
        <Passos atual={passo} onIr={irPara} />
      </div>

      <p aria-live="polite" className="sr-only">
        Passo {passo + 1} de {PASSOS.length}: {PASSOS[passo]}
      </p>

      <div className="mt-9 rounded-[1.5rem] border border-border bg-card p-6 lg:p-10">
        <div key={passo} className="passo-entrada">
          {passo === 0 && (
            <ServiceSelector
              valor={dados.servicoPrincipal}
              complementares={dados.servicosComplementares}
              servicoPersonalizado={dados.servicoPersonalizado}
              onEscolherPrincipal={aplicarServico}
              onAlternarComplementar={alternarComplementar}
              onAlterarPersonalizado={(valor) => alterar("servicoPersonalizado", valor)}
              erroServico={erros.servicoPrincipal}
              erroPersonalizado={erros.servicoPersonalizado}
            />
          )}

          {passo === 1 && (
            <FormularioPreferencias
              estado={dados}
              onAlterar={alterar}
              onAlterarResposta={alterarResposta}
              erros={erros}
            />
          )}

          {passo === 2 && (
            <ImagemOriginal
              servicoSlug={dados.servicoPrincipal}
              imagem={dados.imagemOriginal}
              onFicheiro={(ficheiro) => carregar("imagemOriginal", ficheiro)}
              onRemover={() => remover("imagemOriginal")}
              erro={erros.imagemOriginal}
            />
          )}

          {passo === 3 && (
            <ImagemReferencia
              imagem={dados.referencia}
              onFicheiro={(ficheiro) => carregar("referencia", ficheiro)}
              onRemover={() => remover("referencia")}
              erro={erros.referencia}
              tipo={dados.referenciaTipo}
              onAlterarTipo={(valor) => alterar("referenciaTipo", valor)}
              notas={dados.referenciaNotas}
              onAlterarNotas={(valor) => alterar("referenciaNotas", valor)}
            />
          )}

          {passo === 4 && (
            <div className="space-y-8">
              <RevisaoPedido estado={dados} onIr={irPara} />
              <div className="border-t border-border pt-8">
                <Consentimentos
                  autorizacao={autorizacao}
                  onAutorizacao={(valor) => {
                    setAutorizacao(valor);
                    if (valor) setErroAutorizacao("");
                  }}
                  novidades={dados.novidades}
                  onNovidades={(valor) => alterar("novidades", valor)}
                  erro={erroAutorizacao}
                />
              </div>
            </div>
          )}
        </div>

        <Navegacao
          onAnterior={passo > 0 ? () => irPara(passo - 1) : null}
          onContinuar={continuar}
          rotuloContinuar={passo === 4 ? "Enviar pedido" : "Continuar"}
          submetendo={submetendo}
          erroGeral={passo === 4 ? erroEnvio : ""}
        />
      </div>

      <p className="mt-8 text-center text-[0.85rem] text-muted-foreground">
        Prefere falar primeiro? Escreva para{" "}
        <a
          href="mailto:contacto@retratu.pt"
          className="underline decoration-accent decoration-1 underline-offset-4 hover:decoration-2"
        >
          contacto@retratu.pt
        </a>{" "}
        — respondemos no mesmo dia útil.
      </p>

      <AlertDialog open={Boolean(confirmacao)} onOpenChange={(aberto) => !aberto && setConfirmacao(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Substituir o serviço escolhido?</AlertDialogTitle>
            <AlertDialogDescription>
              O novo serviço tem perguntas diferentes. As respostas que já deu a estas perguntas
              serão apagadas. As restantes preferências são mantidas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Manter o serviço atual</AlertDialogCancel>
            <AlertDialogAction onClick={() => confirmacao?.()}>Substituir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}