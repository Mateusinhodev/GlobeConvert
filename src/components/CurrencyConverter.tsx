import { useId, useState, type FormEvent } from "react";
import { getRates } from "../services/exchangeApi";
import { moedas } from "../data/moedas";
import CurrencySelect from "./CurrencySelect";
import SectionHeader from "./SectionHeader.tsx";
import styles from "./CurrencyConverter.module.css";

interface Resultado {
  valor: number;
  de: string;
  para: string;
  convertido: number;
  taxa: number;
}

// Formata no padrão brasileiro com o símbolo da moeda: US$ 100,00 / R$ 532,10
function formatarMoeda(valor: number, moeda: string) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: moeda,
  }).format(valor);
}

function CurrencyConverter() {
  const [valor, setValor] = useState("");
  const [de, setDe] = useState("USD");
  const [para, setPara] = useState("BRL");
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const valorId = useId();

  const inverterMoedas = () => {
    setDe(para);
    setPara(de);
  };

  const limpar = () => {
    setValor("");
    setResultado(null);
    setErro("");
    setDe("USD");
    setPara("BRL");
  };

  const converter = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const valorNumerico = Number(valor);

    if (valor === "" || Number.isNaN(valorNumerico) || valorNumerico < 0) {
      setResultado(null);
      setErro("Digite um valor válido para converter.");
      return;
    }

    setErro("");

    if (de === para) {
      setResultado({ valor: valorNumerico, de, para, convertido: valorNumerico, taxa: 1 });
      return;
    }

    try {
      setCarregando(true);
      setResultado(null);

      const rates = await getRates(de);
      const taxa = rates[para];

      if (!taxa) {
        setErro(`Não encontramos a cotação de ${de} para ${para}.`);
        return;
      }

      setResultado({
        valor: valorNumerico,
        de,
        para,
        convertido: valorNumerico * taxa,
        taxa,
      });
    } catch (error) {
      console.error(error);
      setErro("Não foi possível obter a cotação. Verifique sua conexão e tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <section id="conversor" className={styles.converter}>
      <SectionHeader
        icone={
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M22 7l-8.5 8.5-5-5L2 17" />
            <path d="M16 7h6v6" />
          </svg>
        }
        selo="Conversão instantânea"
        titulo="Conversor de Moedas"
        subtitulo={`Taxas de câmbio atualizadas diariamente para ${moedas.length} moedas`}
      />

      {/* Com <form>, apertar Enter no campo de valor também converte */}
      <form className={styles.card} onSubmit={converter} noValidate>
        <div>
          <h3 className={styles.cardTitle}>Realize sua conversão</h3>
          <p className={styles.cardDescription}>
            Insira o valor e selecione as moedas para conversão
          </p>
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor={valorId} className={styles.label}>
            Valor
          </label>
          <input
            id={valorId}
            className={styles.input}
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            placeholder="Ex.: 100"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />
        </div>

        <div className={styles.currencyRow}>
          <CurrencySelect label="De" value={de} onChange={setDe} />

          <button
            type="button"
            className={styles.swapButton}
            onClick={inverterMoedas}
            aria-label="Inverter moedas"
            title="Inverter moedas"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 3 4 7l4 4" />
              <path d="M4 7h16" />
              <path d="m16 21 4-4-4-4" />
              <path d="M20 17H4" />
            </svg>
          </button>

          <CurrencySelect label="Para" value={para} onChange={setPara} />
        </div>

        <button type="submit" className={styles.convertButton} disabled={carregando}>
          {carregando ? "Convertendo..." : "Converter"}
        </button>

        {/* Região anunciada por leitores de tela quando o resultado muda */}
        <div className={styles.feedback} aria-live="polite">
          {erro && (
            <p className={styles.error} role="alert">
              {erro}
            </p>
          )}

          {resultado && (
            <div className={styles.result}>
              <div>
                <p className={styles.resultFrom}>
                  {formatarMoeda(resultado.valor, resultado.de)} =
                </p>
                <p className={styles.resultValue}>
                  {formatarMoeda(resultado.convertido, resultado.para)}
                </p>
                <p className={styles.resultRate}>
                  1 {resultado.de} ={" "}
                  {resultado.taxa.toLocaleString("pt-BR", { maximumFractionDigits: 4 })}{" "}
                  {resultado.para}
                </p>
              </div>

              <button type="button" className={styles.clearButton} onClick={limpar}>
                Limpar
              </button>
            </div>
          )}
        </div>
      </form>
    </section>
  );
}

export default CurrencyConverter;