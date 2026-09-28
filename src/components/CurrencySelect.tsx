import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { moedas, urlBandeira } from "../data/moedas";
import styles from "./CurrencySelect.module.css";

interface CurrencySelectProps {
  value: string;
  onChange: (codigo: string) => void;
  label: string;
}

function Bandeira({ codigo }: { codigo: string }) {
  return (
    <img
      className={styles.flag}
      src={urlBandeira(codigo)}
      srcSet={`${urlBandeira(codigo, 80)} 2x`}
      alt=""
      width={28}
      height={21}
      loading="lazy"
    />
  );
}

function CurrencySelect({ value, onChange, label }: CurrencySelectProps) {
  const [aberto, setAberto] = useState(false);
  const [ativo, setAtivo] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const listaRef = useRef<HTMLUListElement>(null);
  const buscaRef = useRef("");
  const buscaTimeout = useRef<number | undefined>(undefined);
  const listboxId = useId();
  const labelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);

  const indiceSelecionado = Math.max(
    0,
    moedas.findIndex((m) => m.codigo === value)
  );
  const selecionada = moedas[indiceSelecionado];
  const idOpcao = (codigo: string) => `${listboxId}-${codigo}`;

  // Fecha a lista ao clicar fora do componente
  useEffect(() => {
    if (!aberto) return;

    const aoClicarFora = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setAberto(false);
      }
    };

    document.addEventListener("mousedown", aoClicarFora);
    return () => document.removeEventListener("mousedown", aoClicarFora);
  }, [aberto]);

  // Mantém a opção destacada visível ao navegar com o teclado
  useEffect(() => {
    if (!aberto) return;
    const item = listaRef.current?.children[ativo] as HTMLElement | undefined;
    item?.scrollIntoView({ block: "nearest" });
  }, [aberto, ativo]);

  const abrir = () => {
    setAtivo(indiceSelecionado);
    setAberto(true);
  };

  const selecionar = (indice: number) => {
    onChange(moedas[indice].codigo);
    setAberto(false);
  };

  // Digitar letras pula para a moeda correspondente (ex.: "br" → BRL)
  const buscarPorTexto = (tecla: string) => {
    buscaRef.current += tecla.toLowerCase();
    window.clearTimeout(buscaTimeout.current);
    buscaTimeout.current = window.setTimeout(() => {
      buscaRef.current = "";
    }, 500);

    const termo = buscaRef.current;
    const indice = moedas.findIndex(
      (m) =>
        m.codigo.toLowerCase().startsWith(termo) ||
        m.nome.toLowerCase().startsWith(termo)
    );

    if (indice >= 0) {
      if (aberto) setAtivo(indice);
      else onChange(moedas[indice].codigo);
    }
  };

  const aoPressionarTecla = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (!aberto) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        abrir();
      } else if (e.key.length === 1) {
        buscarPorTexto(e.key);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setAtivo((i) => Math.min(i + 1, moedas.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setAtivo((i) => Math.max(i - 1, 0));
        break;
      case "Home":
        e.preventDefault();
        setAtivo(0);
        break;
      case "End":
        e.preventDefault();
        setAtivo(moedas.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        selecionar(ativo);
        break;
      case "Escape":
        e.preventDefault();
        setAberto(false);
        break;
      case "Tab":
        setAberto(false);
        break;
      default:
        if (e.key.length === 1) buscarPorTexto(e.key);
    }
  };

  return (
    <div className={styles.container} ref={containerRef}>
      {/* Clicar no rótulo foca o campo, como em um <label> comum */}
      <span
        id={labelId}
        className={styles.fieldLabel}
        onClick={() => triggerRef.current?.focus()}
      >
        {label}
      </span>

      <div className={styles.control}>
        <button
          ref={triggerRef}
          type="button"
          className={styles.trigger}
          role="combobox"
          aria-labelledby={labelId}
          aria-haspopup="listbox"
          aria-expanded={aberto}
          aria-controls={listboxId}
          aria-activedescendant={
            aberto ? idOpcao(moedas[ativo].codigo) : undefined
          }
          onClick={() => (aberto ? setAberto(false) : abrir())}
          onKeyDown={aoPressionarTecla}
        >
          <Bandeira codigo={selecionada.codigo} />
          <span className={styles.triggerText}>
            <strong>{selecionada.codigo}</strong>{" "}
            <span className={styles.triggerName}>- {selecionada.nome}</span>
          </span>
          <svg
            className={styles.chevron}
            width="16"
            height="16"
            viewBox="0 0 16 16"
            aria-hidden="true"
          >
            <path
              d="M4 6l4 4 4-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {aberto && (
          <ul
            className={styles.list}
            id={listboxId}
            role="listbox"
            aria-labelledby={labelId}
            ref={listaRef}
          >
            {moedas.map((moeda, indice) => (
              <li
                key={moeda.codigo}
                id={idOpcao(moeda.codigo)}
                role="option"
                aria-selected={moeda.codigo === value}
                className={`${styles.option} ${
                  indice === ativo ? styles.optionActive : ""
                }`}
                // Evita que o botão perca o foco ao clicar na opção
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => setAtivo(indice)}
                onClick={() => selecionar(indice)}
              >
                <Bandeira codigo={moeda.codigo} />
                <span className={styles.code}>{moeda.codigo}</span>
                <span className={styles.name}>{moeda.nome}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default CurrencySelect;