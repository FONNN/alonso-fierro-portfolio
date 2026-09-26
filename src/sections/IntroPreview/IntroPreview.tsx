import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './IntroPreview.module.css';

/**
 * Imágenes decorativas de relleno (Picsum, seeds fijas para que no
 * cambien en cada carga). No representan proyectos reales — el usuario
 * pidió explícitamente usar un banco de fotos genérico para este bento
 * grid en vez de más capturas de KadiGestión, así que van marcadas como
 * decorativas (alt vacío, grid con aria-hidden) y no como contenido.
 */
const TILES = [
  { seed: 'portfolio-bento-1', area: 'a' },
  { seed: 'portfolio-bento-2', area: 'b' },
  { seed: 'portfolio-bento-3', area: 'c' },
  { seed: 'portfolio-bento-4', area: 'd' },
  { seed: 'portfolio-bento-5', area: 'e' },
  { seed: 'portfolio-bento-6', area: 'f' },
  { seed: 'portfolio-bento-7', area: 'g' },
];

export function IntroPreview() {
  const ref = useScrollReveal<HTMLDivElement>();
  // Grid aparte del resto de la sección: se repite (fade-in al entrar,
  // fade-out al salir) en vez de animarse una sola vez, a pedido
  // explícito — el resto de la sección (headline) sigue con el
  // comportamiento por defecto de una sola vez.
  const gridRef = useScrollReveal<HTMLDivElement>({ repeat: true, stagger: 0.06 });

  return (
    <div className={styles.section} ref={ref}>
      <div className={styles.bentoWrap}>
        <div className={styles.bento} ref={gridRef} aria-hidden="true">
          {TILES.map((tile) => (
            <div
              key={tile.seed}
              className={styles.tile}
              data-reveal-repeat
              style={{ gridArea: tile.area }}
            >
              <img
                className={styles.tileImage}
                src={`https://picsum.photos/seed/${tile.seed}/600/600`}
                alt=""
                width={600}
                height={600}
                loading="lazy"
              />
            </div>
          ))}
        </div>
        <span className={styles.tag} aria-hidden="true">
          PORTFOLIO
          <br />
          2026
        </span>
      </div>

      <p className={styles.headline} data-reveal>
        CONSTRUYO
        <br />
        PRODUCTOS QUE
        <br />
        ESCALAN
      </p>
    </div>
  );
}
