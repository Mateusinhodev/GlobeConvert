import { useState } from "react";
import { getRates } from "../services/exchangeApi";
import CurrencySelect from "./CurrencySelect";
import styles from "./CurrencyConverter.module.css";

function CurrencyConverter() {
  const [valor, setValor] = useState("");
  const [resultado, setResultado] = useState("");
  const [de, setDe] = useState("USD");
  const [para, setPara] = useState("BRL");
  const [carregando, setCarregando] = useState(false);

  const inverterMoedas = () => {
    setDe(para);
    setPara(de);
  };

  const limpar = () => {
    setValor("");
    setResultado("");
    setDe("USD");
    setPara("BRL");
  };

  const converter = async () => {
    const valorNumerico = Number(valor);

    if (valor === "" || Number.isNaN(valorNumerico)) {
      setResultado("Digite um valor válido");
      return;
    }

    if (de === para) {
      setResultado(
        `${valorNumerico.toFixed(2)} ${de} = ${valorNumerico.toFixed(2)} ${para}`
      );
      return;
    }

    try {
      setCarregando(true);
      setResultado("");

      const rates = await getRates(de);
      const taxa = rates[para];

      if (!taxa) {
        setResultado("Cotação não encontrada");
        return;
      }

      const convertido = valorNumerico * taxa;

      setResultado(
        `${valorNumerico.toFixed(2)} ${de} = ${convertido.toFixed(2)} ${para}`
      );
    } catch (error) {
      console.error(error);
      setResultado("Erro ao obter cotação");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <section className={styles.converter}>
      <div className={styles.card}>
        <input
          className={styles.field}
          type="number"
          placeholder="Digite o valor"
          aria-label="Valor a converter"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />

        <CurrencySelect
          label="Moeda de origem"
          value={de}
          onChange={setDe}
        />

        <button
          type="button"
          className={`${styles.button} ${styles.swapButton}`}
          onClick={inverterMoedas}
        >
          ⇄ Inverter moedas
        </button>

        <CurrencySelect
          label="Moeda de destino"
          value={para}
          onChange={setPara}
        />

        <button
          type="button"
          className={styles.button}
          onClick={converter}
          disabled={carregando}
        >
          {carregando ? "Convertendo..." : "Converter"}
        </button>

        <button
          type="button"
          className={`${styles.button} ${styles.clearButton}`}
          onClick={limpar}
        >
          🗑️ Limpar
        </button>

        {resultado && (
          <h2 className={styles.result} aria-live="polite">
            {resultado}
          </h2>
        )}
      </div>
    </section>
  );
}

export default CurrencyConverter;