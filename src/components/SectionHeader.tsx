import type { ReactNode } from "react";
import styles from "./SectionHeader.module.css";

interface SectionHeaderProps {
  /** Ícone SVG exibido no selo */
  icone: ReactNode;
  selo: string;
  titulo: string;
  subtitulo: ReactNode;
}

// Cabeçalho padrão das seções: selo, título em gradiente e subtítulo
function SectionHeader({ icone, selo, titulo, subtitulo }: SectionHeaderProps) {
  return (
    <header className={styles.header}>
      <p className={styles.badge}>
        {icone}
        {selo}
      </p>
      <h2 className={styles.title}>{titulo}</h2>
      <p className={styles.subtitle}>{subtitulo}</p>
    </header>
  );
}

export default SectionHeader;