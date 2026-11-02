import CampoOpcoes from "@/components/edicao/CampoOpcoes";
import CampoTexto from "@/components/edicao/CampoTexto";
import { PERFIS, obterServico } from "@/lib/edicao/servicos";

const SIM_NAO = [
  { valor: "sim", label: "Sim" },
  { valor: "nao", label: "Não" },
];

export default function CamposCondicionais({ servicoSlug, respostas, onAlterar, erros }) {
  const servico = obterServico(servicoSlug);
  const perfil = servico?.perfil ? PERFIS[servico.perfil] : null;
  if (!perfil?.campos?.length) return null;

  return (
    <div className="space-y-8 border-t border-border pt-8">
      <h3 className="font-display text-[1.2rem]">{perfil.titulo}</h3>
      {perfil.campos.map((campo) => {
        const id = `campo-${campo.id}`;
        const valor = respostas?.[campo.id];
        if (campo.tipo === "opcoes" || campo.tipo === "sim_nao") {
          return (
            <CampoOpcoes
              key={campo.id}
              id={id}
              label={campo.label}
              opcoes={campo.tipo === "sim_nao" ? SIM_NAO : campo.opcoes}
              valor={valor}
              multiplo={Boolean(campo.multiplo)}
              obrigatorio={Boolean(campo.obrigatorio)}
              onChange={(novo) => onAlterar(campo.id, novo)}
              erro={erros?.[campo.id]}
            />
          );
        }
        return (
          <CampoTexto
            key={campo.id}
            id={id}
            label={`${campo.label}${campo.obrigatorio ? " *" : ""}`}
            valor={valor}
            rows={campo.tipo === "texto_longo" ? 3 : undefined}
            placeholder={campo.placeholder}
            onChange={(novo) => onAlterar(campo.id, novo)}
            erro={erros?.[campo.id]}
          />
        );
      })}
    </div>
  );
}