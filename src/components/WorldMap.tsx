import styles from "./WorldMap.module.css";

function WorldMap() {
  return (
    <section className={styles.worldMap}>
      <h2 className={styles.title}>🌍 Mapa Mundial Interativo</h2>

      <div className={styles.placeholder}>
        <p>Funcionando!</p>
      </div>
    </section>
  );
}

export default WorldMap;