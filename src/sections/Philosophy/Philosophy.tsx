import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useColumnParallax } from '../../hooks/useColumnParallax';
import architecture from '../../assets/dev-diagrams/architecture.webp';
import sitemap from '../../assets/dev-diagrams/sitemap.webp';
import codeConfig from '../../assets/dev-diagrams/code-config.webp';
import codeHook from '../../assets/dev-diagrams/code-hook.webp';
import terminal from '../../assets/dev-diagrams/terminal.webp';
import styles from './Philosophy.module.css';

const GALLERY = [
  { src: architecture, width: 480, height: 435, speed: 0.7 },
  { src: sitemap, width: 480, height: 311, speed: 1.3 },
  { src: codeHook, width: 480, height: 480, speed: 0.4 },
  { src: codeConfig, width: 480, height: 308, speed: 1 },
  { src: terminal, width: 480, height: 232, speed: 0.6 },
];

export function Philosophy() {
  const revealRef = useScrollReveal<HTMLDivElement>();
  const { sectionRef, setColumnRef } = useColumnParallax<HTMLDivElement>(
    GALLERY.map((item) => item.speed),
    {
      backgroundTo: 'var(--color-fg)',
      colorTargets: [
        { selector: `.${styles.headline}`, to: 'var(--color-bg)' },
        { selector: `.${styles.copy}`, to: 'var(--color-body-inverted)' },
        { selector: `.${styles.badge}`, to: 'var(--color-body-inverted)' },
      ],
      // El trigger arranca una altura de viewport antes de que la sección
      // sea visible: el contenido recién se empieza a ver alrededor del
      // 45% del recorrido total, no del 0%. Con colorStart en 0.3 el
      // fondo ya estaba a mitad de camino (gris lavado, texto sin
      // contraste) apenas aparecía el contenido — por eso 0.55: a esa
      // altura el fondo sigue negro, y recién ahí pasa rápido a blanco.
      colorStart: 0.55,
      colorDuration: 0.2,
    },
  );

  return (
    <div
      className={styles.section}
      ref={(node) => {
        revealRef.current = node;
        sectionRef.current = node;
      }}
    >
      <div className={styles.content}>
        <div className={styles.top}>
          <p className={styles.headline} data-reveal>
            CÓDIGO
            <br />
            SIMPLE.
          </p>
          <p className={styles.copy} data-reveal>
            Cada proyecto parte de una arquitectura clara para poder crecer sin reescribir todo.
          </p>
        </div>

        <p className={`${styles.headline} ${styles.headlineRight}`} data-reveal>
          IMPACTO GRANDE.
        </p>

        <div className={styles.badge} data-reveal>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 2l2.4 6.5L21 11l-6.6 2.5L12 20l-2.4-6.5L3 11l6.6-2.5L12 2z"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
          </svg>
          <span className={styles.badgeLabel}>
            PENSADO
            <br />
            PARA DURAR
          </span>
        </div>
      </div>

      <div className={styles.gallery} aria-hidden="true">
        {GALLERY.map((item, index) => (
          <div key={item.src} className={styles.column} ref={setColumnRef(index)}>
            <img src={item.src} alt="" width={item.width} height={item.height} loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  );
}
