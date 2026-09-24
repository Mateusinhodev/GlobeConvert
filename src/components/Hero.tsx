import styles from "./Hero.module.css";

function Hero() {
  return (
    <section className={styles.hero}>
      <h1 className={styles.title}>🌎 Explore as moedas do mundo inteiro</h1>

      <p className={styles.subtitle}>
        Converta valores entre países, descubra moedas
        e navegue pelo mapa mundial interativo.
      </p>
    </section>
  );
}

export default Hero;