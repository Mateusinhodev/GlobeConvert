import styles from "./Navbar.module.css";

function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.inner}>
        <h2 className={styles.logo}>🌎 GlobeConvert</h2>
      </div>
    </nav>
  );
}

export default Navbar;