import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsapConfig';

/**
 * Animación de entrada para elementos que ya están a la vista al
 * cargar la página (el Nav, el titular del hero, las líneas de fondo).
 *
 * Es distinta de `useScrollReveal` a propósito: estos elementos no
 * son algo a lo que el usuario "llega" haciendo scroll, están ahí
 * desde el primer fotograma. Por eso se animan con un timeline al
 * montar el componente, sin ScrollTrigger.
 */
export function useMountReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const items = el.querySelectorAll('[data-reveal]');
      if (items.length === 0) return;

      gsap
        .timeline({ defaults: { ease: 'focusPull' } })
        .fromTo(items, { opacity: 0, y: 56 }, { opacity: 1, y: 0, duration: 1.0, stagger: 0.14 });
    },
    { scope: ref },
  );

  return ref;
}
