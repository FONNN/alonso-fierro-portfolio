import { useRef } from 'react';
import { useParallax } from '../../hooks/useParallax';
import { gsap, useGSAP } from '../../lib/gsapConfig';
import styles from './AmbientGlow.module.css';

/**
 * 3 manchas de luz muy suaves de fondo, cada una desplazándose a una
 * velocidad distinta mientras se scrollea toda la página (parallax).
 * Es lo que le da al fondo negro una sensación de movimiento continuo
 * durante toda la navegación, no solo al entrar a una sección.
 *
 * Además, cada mancha "respira" sola todo el tiempo (opacidad +
 * escala, en loop) con la curva `focusPull` — un pulso lento e
 * independiente del scroll, para que el fondo se sienta vivo incluso
 * si el usuario no se mueve. Las tres arrancan con un `delay` distinto
 * para que no respiren todas en sincronía.
 *
 * Puramente decorativo (aria-hidden, pointer-events: none).
 */
export function AmbientGlow() {
  const a = useParallax<HTMLSpanElement>({ distance: 140 });
  const b = useParallax<HTMLSpanElement>({ distance: -180 });
  const c = useParallax<HTMLSpanElement>({ distance: 110 });
  const layerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const blobs = layerRef.current?.querySelectorAll(`.${styles.blob}`);
      if (!blobs || blobs.length === 0) return;

      blobs.forEach((blob, index) => {
        gsap.to(blob, {
          opacity: 0.55,
          scale: 1.12,
          duration: 6.5,
          delay: index * 1.4,
          ease: 'focusPull',
          yoyo: true,
          repeat: -1,
          transformOrigin: 'center',
        });
      });
    },
    { scope: layerRef },
  );

  return (
    <div className={styles.layer} aria-hidden="true" ref={layerRef}>
      <span className={`${styles.blob} ${styles.a}`} ref={a} />
      <span className={`${styles.blob} ${styles.b}`} ref={b} />
      <span className={`${styles.blob} ${styles.c}`} ref={c} />
    </div>
  );
}
