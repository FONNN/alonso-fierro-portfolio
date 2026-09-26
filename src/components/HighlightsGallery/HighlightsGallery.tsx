import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import styles from './HighlightsGallery.module.css';

export interface HighlightsSlide {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
}

interface HighlightsGalleryProps {
  slides: HighlightsSlide[];
  /** Milisegundos entre avances automáticos. */
  autoplayMs?: number;
}

const AUTOPLAY_MS_DEFAULT = 5000;

/**
 * Galería tipo "highlights" investigada en apple.com/airpods-5: el
 * deslizamiento real corre por `overflow-x` + `scroll-snap-type`
 * nativos del navegador, no por drag/JS a mano. Es la razón por la que
 * en el sitio original nunca se rompe en mobile (a diferencia de un
 * caso real que sí encontramos roto — el carrusel de fundadores de
 * vividand.co, con `overflow: visible` y sin ningún mecanismo para
 * llegar a los elementos fuera de pantalla).
 *
 * Loop infinito: se clona el último slide antes del primero y el
 * primero después del último (`[clonLast, ...slides, clonFirst]`). El
 * scroll arranca posicionado en el primer slide REAL (índice 1 del
 * arreglo extendido). Al asentarse el scroll sobre uno de los clones
 * (`scrollend`), se salta al instante (sin animación) al slide real
 * equivalente — como el clon es visualmente idéntico, el salto es
 * imperceptible y el scroll se siente continuo en ambas direcciones.
 */
export function HighlightsGallery({ slides, autoplayMs = AUTOPLAY_MS_DEFAULT }: HighlightsGalleryProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const slideRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(true);

  const extended = [
    { ...slides[slides.length - 1], key: 'clone-start' },
    ...slides.map((slide, index) => ({ ...slide, key: `slide-${index}` })),
    { ...slides[0], key: 'clone-end' },
  ];
  const lastRealExtIndex = slides.length;
  const lastExtIndex = extended.length - 1;

  // Arranca en el primer slide real (índice 1 del arreglo extendido),
  // no en el clon del último. useLayoutEffect (no useEffect) para que
  // corra antes del primer paint y no se alcance a ver el clon.
  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollLeft = track.clientWidth * 1;
  }, []);

  // Marca cuándo el scroll (del usuario, del autoplay o de un click en
  // un punto) terminó de asentarse. Ahí se decide: si cayó en un clon,
  // saltar sin animación al slide real equivalente; si no, solo
  // actualizar qué punto está activo.
  //
  // Se usa un 'scroll' debounced en vez del evento nativo `scrollend`:
  // en pruebas reales, `scrollend` no llegó a dispararse ni una sola
  // vez en Chromium headless para un scroll disparado por `scrollTo`
  // (0 eventos en varias corridas, pese a que el scroll sí ocurría) —
  // demasiado riesgoso para depender de él. El debounce sobre 'scroll'
  // sí es consistente en cualquier navegador.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let timeoutId: number;

    const onSettled = () => {
      const width = track.clientWidth;
      const extIndex = Math.round(track.scrollLeft / width);

      if (extIndex === 0) {
        track.scrollTo({ left: width * lastRealExtIndex, behavior: 'instant' });
        setCurrent(slides.length - 1);
      } else if (extIndex === lastExtIndex) {
        track.scrollTo({ left: width * 1, behavior: 'instant' });
        setCurrent(0);
      } else {
        setCurrent(extIndex - 1);
      }
    };

    const onScroll = () => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(onSettled, 120);
    };

    track.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      track.removeEventListener('scroll', onScroll);
      window.clearTimeout(timeoutId);
    };
  }, [slides.length, lastRealExtIndex, lastExtIndex]);

  // Siempre avanza una posición dentro del arreglo extendido. Al caer
  // en el clon del final, el efecto de arriba hace el salto invisible
  // de vuelta al slide real 0 — el mismo mecanismo del scroll manual,
  // sin ningún caso especial para el autoplay.
  useEffect(() => {
    if (!playing) return;

    const id = window.setInterval(() => {
      const track = trackRef.current;
      if (!track) return;
      const width = track.clientWidth;
      const curExtIndex = Math.round(track.scrollLeft / width);
      track.scrollTo({ left: width * (curExtIndex + 1), behavior: 'smooth' });
    }, autoplayMs);

    return () => window.clearInterval(id);
  }, [playing, autoplayMs]);

  const goTo = (realIndex: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: track.clientWidth * (realIndex + 1), behavior: 'smooth' });
  };

  return (
    <div className={styles.gallery}>
      <ul className={styles.track} ref={trackRef}>
        {extended.map((slide, index) => {
          const isClone = slide.key === 'clone-start' || slide.key === 'clone-end';
          return (
            <li
              key={slide.key}
              className={styles.slide}
              aria-hidden={isClone || undefined}
              ref={(el) => {
                slideRefs.current[index] = el;
              }}
            >
              <img
                className={styles.image}
                src={slide.src}
                alt={slide.alt}
                width={slide.width}
                height={slide.height}
                loading={index <= 1 ? 'eager' : 'lazy'}
              />
              <p className={styles.caption}>{slide.caption}</p>
            </li>
          );
        })}
      </ul>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.playButton}
          onClick={() => setPlaying((v) => !v)}
          aria-label={playing ? 'Pausar galería' : 'Reproducir galería'}
        >
          {playing ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <rect x="5" y="4" width="5" height="16" rx="1" />
              <rect x="14" y="4" width="5" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M6 4l14 8-14 8V4z" />
            </svg>
          )}
        </button>

        <ul className={styles.dotnav} role="tablist" aria-label="Diapositivas de la galería">
          {slides.map((slide, index) => (
            <li key={slide.src} role="presentation">
              <button
                type="button"
                role="tab"
                aria-selected={index === current}
                aria-label={`Ir a: ${slide.caption}`}
                data-current={index === current || undefined}
                className={styles.dot}
                onClick={() => goTo(index)}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
