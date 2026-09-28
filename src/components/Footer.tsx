import styles from "./Footer.module.css";

interface LinkRodape {
  rotulo: string;
  href: string;
  externo?: boolean;
}

const colunas: { titulo: string; links: LinkRodape[] }[] = [
  {
    titulo: "Recursos",
    links: [
      { rotulo: "Conversor", href: "#conversor" },
      { rotulo: "Mapa Mundial", href: "#mapa" },
      { rotulo: "Aprenda", href: "#aprenda" },
      { rotulo: "Perguntas frequentes", href: "#faq" },
    ],
  },
  {
    titulo: "Sobre o projeto",
    links: [
      {
        rotulo: "Código no GitHub",
        href: "https://github.com/douglassousa6-design/GlobeConvert",
        externo: true,
      },
      {
        rotulo: "Cotações: ExchangeRate-API",
        href: "https://www.exchangerate-api.com",
        externo: true,
      },
      {
        rotulo: "Países: mledoze/countries",
        href: "https://github.com/mledoze/countries",
        externo: true,
      },
      {
        rotulo: "Mapa: Natural Earth",
        href: "https://www.naturalearthdata.com",
        externo: true,
      },
      {
        rotulo: "Bandeiras: Flagpedia",
        href: "https://flagpedia.net",
        externo: true,
      },
    ],
  },
];

function Footer() {
  const ano = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <a href="#" className={styles.logo}>
              <svg className={styles.logoIcon} width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span className={styles.logoText}>GlobeConvert</span>
            </a>
            <p className={styles.tagline}>
              Convertendo moedas e conectando o mundo através da educação
              financeira.
            </p>
          </div>

          {colunas.map((coluna) => (
            <nav key={coluna.titulo} className={styles.column} aria-label={coluna.titulo}>
              <h2 className={styles.columnTitle}>{coluna.titulo}</h2>
              <ul className={styles.links}>
                {coluna.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className={styles.link}
                      {...(link.externo && { target: "_blank", rel: "noopener noreferrer" })}
                    >
                      {link.rotulo}
                      {link.externo && (
                        <svg className={styles.externalIcon} viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M7 17 17 7" />
                          <path d="M7 7h10v10" />
                        </svg>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {ano} GlobeConvert. Todos os direitos reservados.
          </p>

          <a
            href="https://github.com/douglassousa6-design/GlobeConvert"
            className={styles.social}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Repositório do GlobeConvert no GitHub"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;