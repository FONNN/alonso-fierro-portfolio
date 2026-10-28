import { useEffect, useRef } from 'react';
import { gsap, useGSAP } from '../../lib/gsapConfig';
import { ParticleSphere } from './ParticleSphere';
import styles from './Reflector.module.css';

/**
 * Reemplaza a AmbientGlow, GuideLines y al pañuelo de partículas: un
 * solo resplandor grande y difuminado, clavado al viewport
 * (`position: fixed`, no a la página) — así "acompaña" al usuario en
 * todo momento sin necesitar seguir el scroll a mano, y al ser luz
 * suave (gradiente + blur) nunca compite visualmente con el
 * contenido como sí pasaba con las líneas del pañuelo.
 *
 * Dos capas superpuestas (verde/oscura) en vez de animar el color del
 * gradiente directo: un `background` con gradiente no transiciona
 * suave entre colores en CSS, así que se cruzan en opacidad dos
 * capas fijas — eso sí anima bien.
 *
 * `IntersectionObserver` en vez de escuchar scroll a mano: se apaga
 * al acercarse al Footer, y cambia de color mientras AlwaysUpdated
 * (la sección de tema claro, marcada con `data-theme="light"`) está
 * en pantalla.
 *
 * La animación de "respiración" (scale) va en un div interno, nunca
 * en el que tiene `position: fixed`: confirmado en Chromium que un
 * elemento fixed con su propio transform activo deja de pintarse al
 * hacer scroll profundo en páginas largas (el fixed se "pierde" aunque
 * sus estilos computados sigan siendo correctos). Separar ambas cosas
 * evita el bug sin perder el efecto.
 */
export function Reflector() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const breatheRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = breatheRef.current;
    if (!el) return;
    gsap.to(el, {
      scale: 1.1,
      duration: 7,
      ease: 'focusPull',
      yoyo: true,
      repeat: -1,
      transformOrigin: 'center',
    });
  }, []);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const footer = document.getElementById('contacto');
    const lightSection = document.querySelector('[data-theme="light"]');

    const footerObserver = new IntersectionObserver(
      ([entry]) => el.classList.toggle(styles.hidden, entry.isIntersecting),
      { rootMargin: '0px 0px -200px 0px' },
    );
    if (footer) footerObserver.observe(footer);

    const themeObserver = new IntersectionObserver(
      ([entry]) => el.classList.toggle(styles.light, entry.isIntersecting),
      { threshold: 0.2 },
    );
    if (lightSection) themeObserver.observe(lightSection);

    return () => {
      footerObserver.disconnect();
      themeObserver.disconnect();
    };
  }, []);

  return (
    <div className={styles.wrapper} aria-hidden="true" ref={wrapperRef}>
      <div className={styles.breathe} ref={breatheRef}>
        <span className={`${styles.glow} ${styles.green}`} />
        <span className={`${styles.glow} ${styles.gold}`} />
        <ParticleSphere wrapperRef={wrapperRef} />
      </div>
    </div>
  );
}
