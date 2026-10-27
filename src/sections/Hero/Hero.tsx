import { site } from '../../content/site';
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

      <a
        href={site.bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.cta}
        data-reveal
      >
        Agenda una llamada
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 12h16M14 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </div>
  );
}
