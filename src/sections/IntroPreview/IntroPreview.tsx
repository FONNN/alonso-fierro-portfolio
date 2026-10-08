import { useScrollReveal } from '../../hooks/useScrollReveal';
import voltoFichaPublica from '../../assets/voltopet/volto-ficha-publica.webp';
import voltoGuiaEstilo from '../../assets/voltopet/volto-guia-estilo.webp';
import srHeroCompleto from '../../assets/saboryromance/sr-hero-completo.webp';
import srGaleriaMosaico from '../../assets/saboryromance/sr-galeria-mosaico.webp';
import kadiHero from '../../assets/gallery/kadi-01-hero.webp';
import kadiEquipo from '../../assets/gallery/kadi-03-equipo.webp';
import styles from './IntroPreview.module.css';

/**
 * 6 tiles con 3 formas (ver .bento en el CSS): 'top1'/'top2' anchas
 * (misma imagen completa, sin recorte angosto — mostrar solo un
 * fragmento, como la copa de Sabor & Romance sola, fue justo lo que
 * se pidió evitar), 'tall1'/'tall2' angostas, y 'sq1'/'sq2' cuadradas
 * apiladas en la tercera columna de la fila inferior. Sin alt ni
 * caption porque el grid entero sigue siendo aria-hidden.
 *
 * 'top1/top2/tall1/tall2' son capturas de los 2 proyectos en
 * desarrollo (Volto, Sabor & Romance) y son las 4 que mobile mantiene
 * visibles ([data-desktop-only] ausente). 'sq1/sq2' son de
 * KadiGestión — es el único proyecto con 4 capturas reales
 * disponibles, así que rellenan las 2 celdas que sobran y quedan
 * ocultas en mobile.
 */
const TILES = [
  { src: srHeroCompleto, area: 'top1', w: 1903, h: 909, mobileVisible: true },
  { src: voltoFichaPublica, area: 'top2', w: 1100, h: 617, mobileVisible: true },
  { src: srGaleriaMosaico, area: 'tall1', w: 454, h: 907, mobileVisible: true },
  {
    src: voltoGuiaEstilo,
    area: 'tall2',
    w: 730,
    h: 702,
    mobileVisible: true,
    // El recorte centrado por defecto dejaba la mitad izquierda (solo
    // la muestra tipográfica "Figtree"); el lado derecho —nombre de
    // la mascota, tamaños de fuente, botón, chips— es la parte que
    // realmente identifica el proyecto.
    objectPosition: 'right center',
  },
  { src: kadiHero, area: 'sq1', w: 1200, h: 670, mobileVisible: false },
  { src: kadiEquipo, area: 'sq2', w: 1200, h: 670, mobileVisible: false },
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
              data-desktop-only={tile.mobileVisible ? undefined : true}
              style={{ gridArea: tile.area }}
            >
              <img
                className={styles.tileImage}
                src={tile.src}
                alt=""
                width={tile.w}
                height={tile.h}
                loading="lazy"
                style={tile.objectPosition ? { objectPosition: tile.objectPosition } : undefined}
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
