import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsapConfig';

interface ParallaxOptions {
  /** Desplazamiento total (px) a lo largo de todo el alto de la página. Negativo = sube. */
  distance?: number;
}

/**
 * Parallax continuo: el elemento se desplaza en Y en función de cuánto
 * se ha scrolleado la página completa (no de si "entró" o no a la
 * vista, como en `useScrollReveal`/`useMountReveal`).
 *
 * `scrub: true` es la diferencia clave con el resto de las animaciones
 * del sitio: en vez de dispararse una vez (`once: true`) y terminar,
 * el valor de `y` queda atado 1:1 al progreso del scroll — sube y baja
 * si el usuario sube y baja. Por eso da la sensación de que el fondo
 * "vive" durante toda la navegación, no solo al llegar a una sección.
 */
export function useParallax<T extends HTMLElement>({ distance = -120 }: ParallaxOptions = {}) {
  const ref = useRef<T | null>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;

    gsap.to(el, {
      y: distance,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
      },
    });
  }, []);

  return ref;
}
