import { useScrollReveal } from '../../hooks/useScrollReveal';
import voltoFichaPublica from '../../assets/voltopet/volto-ficha-publica.webp';
import voltoGuiaEstilo from '../../assets/voltopet/volto-guia-estilo.webp';
import styles from './IntroPreview.module.css';

/**
 * La mayoría de los tiles son relleno decorativo (Picsum, seeds fijas
 * para que no cambien en cada carga) — el usuario pidió explícitamente
 * un banco de fotos genérico para este bento en vez de más capturas de
 * KadiGestión, así que van sin alt (grid con aria-hidden) y no como
 * contenido. Los tiles 'a' y 'd' son la excepción: capturas reales de
 * Volto (proyecto en desarrollo), puestas ahí porque son las dos
 * celdas grandes (2x2, ver .bento en el CSS) — en las celdas angostas
 * 'b'/'c' una imagen tan compuesta (varias pantallas de teléfono) se
 * recortaría ilegible. También son las únicas 2 de las 7 que siguen
 * visibles en mobile (ver el nth-child que oculta e/f/g ahí).
 */
const TILES = [
  { src: voltoFichaPublica, area: 'a' },
  { seed: 'portfolio-bento-2', area: 'b' },
  { seed: 'portfolio-bento-3', area: 'c' },
  { src: voltoGuiaEstilo, area: 'd' },
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
              key={tile.area}
              className={styles.tile}
              data-reveal-repeat
              style={{ gridArea: tile.area }}
            >
              <img
                className={styles.tileImage}
                src={tile.src ?? `https://picsum.photos/seed/${tile.seed}/600/600`}
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
