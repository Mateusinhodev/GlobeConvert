import styles from "./Navbar.module.css";

const links = [
  { href: "#conversor", rotulo: "Conversor" },
  { href: "#mapa", rotulo: "Mapa Mundial" },
  { href: "#aprenda", rotulo: "Aprenda" },
];

function Navbar() {
  return (
    <header className={styles.navbar}>
      <nav className={styles.inner} aria-label="Navegação principal">
        <a href="#" className={styles.logo}>
          <svg
            className={styles.logoIcon}
            width="30"
            height="30"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          <span className={styles.logoText}>GlobeConvert</span>
        </a>

        <ul className={styles.links}>
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className={styles.link}>
                {link.rotulo}
              </a>
            </li>
          ))}
        </ul>

        <a href="#conversor" className={styles.cta}>
          Começar
        </a>
      </nav>
    </header>
  );
}

export default Navbar;