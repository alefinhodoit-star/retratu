import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function Consentimentos({
  autorizacao,
  onAutorizacao,
  novidades,
  onNovidades,
  erro,
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <Checkbox
          id="autorizacao-imagens"
          checked={autorizacao}
          onCheckedChange={(valor) => onAutorizacao(valor === true)}
          aria-invalid={Boolean(erro)}
          aria-describedby={erro ? "autorizacao-erro" : undefined}
          className="mt-1"
        />
        <div>
          <Label htmlFor="autorizacao-imagens" className="text-[0.92rem] font-normal leading-relaxed">
            Confirmo que tenho autorização para utilizar as imagens que carreguei e que li os{" "}
            <Link to="/termos" className="underline underline-offset-4">
              termos
            </Link>{" "}
            e a{" "}
            <Link to="/privacidade" className="underline underline-offset-4">
              política de privacidade
            </Link>
            . *
          </Label>
          {erro && (
            <p id="autorizacao-erro" className="mt-2 text-[0.85rem] text-destructive" role="alert">
              {erro}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-start gap-3">
        <Checkbox
          id="novidades"
          checked={novidades}
          onCheckedChange={(valor) => onNovidades(valor === true)}
          className="mt-1"
        />
        <Label
          htmlFor="novidades"
          className="text-[0.92rem] font-normal leading-relaxed text-muted-foreground"
        >
          Quero receber novidades e ofertas da Retratu (opcional).
        </Label>
      </div>
    </div>
  );
}