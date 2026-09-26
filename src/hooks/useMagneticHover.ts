import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsapConfig';

const PULL_STRENGTH = 0.3;

/**
 * Efecto "cursor magnético": el elemento se deja atraer un poco hacia
 * el puntero mientras este se mueve encima (o cerca, según el tamaño
 * del propio elemento), y vuelve a su lugar con un rebote elástico al
 * salir el cursor.
 *
 * Investigado con la skill `ui-ux-pro-max` (dominio `gsap`, categoría
 * "Hover Micro-interaction", tier Complex). Su propia recomendación es
 * no usarlo en más de 1-2 elementos focales por pantalla — se aplicó
 * solo a la flecha de "Sobre mí" y al ícono de contacto del footer,
 * que nunca están a la vista al mismo tiempo.
 *
 * `gsap.quickTo` se usa en vez de `gsap.to` repetido en cada evento:
 * crea el tween una sola vez y solo actualiza el valor destino en cada
 * `pointermove`, evitando generar (y descartar) un tween nuevo por
 * cada movimiento del mouse.
 */
export function useMagneticHover<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3' });

    const onPointerMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      xTo((e.clientX - rect.left - rect.width / 2) * PULL_STRENGTH);
      yTo((e.clientY - rect.top - rect.height / 2) * PULL_STRENGTH);
    };

    const onPointerLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    };

    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerleave', onPointerLeave);

    return () => {
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerleave', onPointerLeave);
      gsap.killTweensOf(el);
    };
  }, []);

  return ref;
}
