import { site } from '../../content/site';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import logoDesktop from '../../assets/logo/logo-desktop.svg';
import styles from './Footer.module.css';

const BOOKING_URL = 'https://calendar.app.google/fzyqRiMxs83sZEh59';

export function Footer() {
  const ref = useScrollReveal<HTMLDivElement>({ y: 40, stagger: 0.07 });
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer} ref={ref} id="contacto">
      <div className={styles.pillars}>
        <div className={styles.pillar} data-reveal>
          <span className={styles.pillarLabel}>RENDIMIENTO</span>
          {/* Caption solo visible en desktop: en mobile se prioriza
              llegar rápido al CTA de abajo (ver Footer.module.css). */}
          <p className={styles.pillarCaption}>Carga rápida, sin peso de más.</p>
        </div>
        <div className={styles.pillar} data-reveal>
          <span className={styles.pillarLabel}>SEGURIDAD</span>
          <p className={styles.pillarCaption}>Sin cookies ni rastreadores.</p>
        </div>
        <div className={styles.pillar} data-reveal>
          <span className={styles.pillarLabel}>DISEÑO</span>
          <p className={styles.pillarCaption}>Hecho a mano, no con plantillas.</p>
        </div>
      </div>

      <div className={styles.contact} data-reveal>
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.cta}
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

      <div className={styles.wordmark} data-reveal>
        {/* Versión negra (fondo claro del footer, ver Footer.module.css
            arriba) — mismo lockup que el Nav pero en negro en vez de
            blanco. Siempre el logo de escritorio (ícono + texto
            completo), también en mobile: a diferencia del Nav, esta
            zona del footer tiene espacio de sobra para alojarlo. */}
        <img className={styles.wordmarkImg} src={logoDesktop} alt={site.name} width={1943} height={620} />
      </div>

      <p className={styles.legal} data-reveal>
        © {year} {site.name}
      </p>
    </footer>
  );
}
