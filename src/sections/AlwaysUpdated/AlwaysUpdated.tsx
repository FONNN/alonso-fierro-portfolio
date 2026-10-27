import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './AlwaysUpdated.module.css';

export function AlwaysUpdated() {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <div className={styles.section} ref={ref}>
      <p className={styles.headline} data-reveal>
        SIEMPRE
      </p>
      <p className={`${styles.headline} ${styles.headlineRight}`} data-reveal>
        AL DÍA.
      </p>

      <div className={styles.row}>
        <p className={styles.caption} data-reveal>
          ESTE PORTAFOLIO SE ACTUALIZA CON CADA PROYECTO NUEVO QUE ENTREGO.
        </p>
        <div className={styles.photo} data-reveal aria-hidden="true" />
        <a href="#proyectos" className={styles.link} data-reveal>
          Ver todos los proyectos →
        </a>
      </div>
    </div>
  );
}
