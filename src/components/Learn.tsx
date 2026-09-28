import type { ReactNode } from "react";
import { conteudos, perguntasFrequentes, type IconeConteudo } from "../data/conteudos";
import SectionHeader from "./SectionHeader";
import styles from "./Learn.module.css";

const icones: Record<IconeConteudo, ReactNode> = {
  globo: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </>
  ),
  grafico: (
    <>
      <path d="M22 7l-8.5 8.5-5-5L2 17" />
      <path d="M16 7h6v6" />
    </>
  ),
  carteira: (
    <>
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
    </>
  ),
  livro: (
    <>
      <path d="M12 7v14" />
      <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
    </>
  ),
};

function Icone({ nome }: { nome: IconeConteudo }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {icones[nome]}
    </svg>
  );
}

function Learn() {
  return (
    <section id="aprenda" className={styles.learn}>
      <SectionHeader
        icone={<Icone nome="livro" />}
        selo="Educação financeira"
        titulo="Aprenda sobre Moedas"
        subtitulo="Conceitos essenciais do mercado de câmbio e da economia global"
      />

      <div className={styles.grid}>
        {conteudos.map((conteudo) => (
          <article key={conteudo.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.iconTile}>
                <Icone nome={conteudo.icone} />
              </span>
              <div>
                <h3 className={styles.cardTitle}>{conteudo.titulo}</h3>
                <p className={styles.cardDescription}>{conteudo.descricao}</p>
              </div>
            </div>

            {conteudo.texto && <p className={styles.text}>{conteudo.texto}</p>}

            {conteudo.termos && (
              <dl className={styles.terms}>
                {conteudo.termos.map((item) => (
                  <div key={item.termo} className={styles.term}>
                    <dt>{item.termo}:</dt>
                    <dd>{item.definicao}</dd>
                  </div>
                ))}
              </dl>
            )}
          </article>
        ))}
      </div>

      {/* Perguntas frequentes: <details> abre e fecha sem JavaScript */}
      <div id="faq" className={styles.faq}>
        <h3 className={styles.faqTitle}>Perguntas frequentes</h3>
        <p className={styles.faqDescription}>
          Dúvidas comuns de quem vai converter ou comprar moeda estrangeira
        </p>

        <div className={styles.faqList}>
          {perguntasFrequentes.map((item) => (
            <details key={item.id} className={styles.faqItem}>
              <summary className={styles.faqQuestion}>
                {item.pergunta}
                <svg className={styles.faqIcon} viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </summary>
              <p className={styles.faqAnswer}>{item.resposta}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Learn;