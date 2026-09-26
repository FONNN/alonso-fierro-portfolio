import { useMountReveal } from '../../hooks/useMountReveal';
import { useParallax } from '../../hooks/useParallax';
import styles from './GuideLines.module.css';

/**
 * Las 4 líneas verticales punteadas de fondo, tomadas de la referencia
 * de diseño. Son puramente decorativas (aria-hidden) y se ocultan en
 * pantallas angostas para no saturar el layout en móvil.
 *
 * Dos animaciones distintas conviven aquí, cada una en su propio
 * elemento para no pisarse (ambas animan `y`, y GSAP no puede animar
 * la misma propiedad del mismo elemento de dos formas a la vez): el
 * contenedor externo hace parallax continuo con el scroll
 * (`useParallax`), y las líneas de adentro se desvanecen hacia dentro
 * una sola vez al cargar (`useMountReveal`).
 */
export function GuideLines() {
  const parallaxRef = useParallax<HTMLDivElement>({ distance: -60 });
  const revealRef = useMountReveal<HTMLDivElement>();

  return (
    <div className={styles.parallaxLayer} ref={parallaxRef}>
      <div className={styles.lines} aria-hidden="true" ref={revealRef}>
        <span className={styles.line} data-reveal />
        <span className={styles.line} data-reveal />
        <span className={styles.line} data-reveal />
        <span className={styles.line} data-reveal />
      </div>
    </div>
  );
}
