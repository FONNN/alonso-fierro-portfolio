import { useMountReveal } from '../../hooks/useMountReveal';
import styles from './Hero.module.css';

/**
 * El titular de apertura. Es lo primero que se ve al cargar: se anima
 * al montar (useMountReveal), no al hacer scroll.
 *
 * Las 3 líneas y la insignia están marcadas con `data-reveal` para que
 * el hook las anime en cascada, una tras otra.
 */
export function Hero() {
  const ref = useMountReveal<HTMLDivElement>();

  return (
    <div className={styles.hero} ref={ref}>
      <h1 className={styles.headingReset}>
        <div className={styles.row}>
          <span className={styles.title} data-reveal>
            TU PRÓXIMO
          </span>
          <span className={styles.microLabel} data-reveal>
            FULL-STACK
            <br />
            REACT · NODE.JS
          </span>
        </div>

        <div className={`${styles.row} ${styles.rowCenter}`}>
          <span className={styles.title} data-reveal>
            DESARROLLADOR
          </span>
          <span className={styles.badge} data-reveal>
            <span className={styles.badgeDot} />
            <span className={styles.badgeText}>Disponible para nuevos proyectos</span>
          </span>
        </div>

        <span className={styles.title} data-reveal>
          WEB.
        </span>
      </h1>
    </div>
  );
}
