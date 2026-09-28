import styles from "./Hero.module.css";

// Símbolos de moedas flutuando ao fundo (posição e tamanho em % / rem)
const simbolos = [
  { simbolo: "$", top: "62%", left: "12%", tamanho: 3.5, atraso: 0 },
  { simbolo: "€", top: "30%", left: "20%", tamanho: 2.5, atraso: 1.5 },
  { simbolo: "£", top: "80%", left: "26%", tamanho: 2, atraso: 2.1 },
  { simbolo: "£", top: "38%", left: "78%", tamanho: 5, atraso: 1.2 },
  { simbolo: "¥", top: "22%", left: "88%", tamanho: 3, atraso: 2.4 },
  { simbolo: "€", top: "64%", left: "88%", tamanho: 3, atraso: 0.6 },
  { simbolo: "¥", top: "82%", left: "72%", tamanho: 2, atraso: 0.9 },
];

function Hero() {
  return (
    <section className={styles.hero}>
      {/* Fundo decorativo: brilhos, globo e símbolos */}
      <div className={styles.background} aria-hidden="true">
        <div className={styles.glow} />
        <div className={styles.globe} />
        {simbolos.map((item, indice) => (
          <span
            key={indice}
            className={styles.symbol}
            style={{
              top: item.top,
              left: item.left,
              fontSize: `${item.tamanho}rem`,
              animationDelay: `${item.atraso}s`,
            }}
          >
            {item.simbolo}
          </span>
        ))}
      </div>

      <div className={styles.content}>
        <p className={styles.badge}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M22 7l-8.5 8.5-5-5L2 17" />
            <path d="M16 7h6v6" />
          </svg>
          Taxas de câmbio atualizadas diariamente
        </p>

        <h1 className={styles.title}>
          <span className={styles.titleGradient}>Converta Moedas</span>
          <br />
          do Mundo Todo
        </h1>

        <p className={styles.subtitle}>
          Explore o mapa mundial interativo, conheça moedas de diferentes
          países e faça conversões com taxas de câmbio atualizadas todos os dias.
        </p>

        <div className={styles.actions}>
          <a href="#conversor" className={`${styles.button} ${styles.primary}`}>
            Converter agora
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </a>
          <a href="#mapa" className={`${styles.button} ${styles.secondary}`}>
            Explorar mapa
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;