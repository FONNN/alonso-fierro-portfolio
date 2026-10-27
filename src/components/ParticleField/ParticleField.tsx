import { useEffect, useRef } from 'react';
import { useParallax } from '../../hooks/useParallax';
import styles from './ParticleField.module.css';

interface Particle {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  alpha: number;
}

const COUNT = 70;
const COLOR = '61, 220, 90'; // --color-accent en rgb, para poder variar alpha por partícula

function makeParticles(width: number, height: number): Particle[] {
  return Array.from({ length: COUNT }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: 0.6 + Math.random() * 1.8,
    vx: (Math.random() - 0.5) * 0.08,
    vy: (Math.random() - 0.5) * 0.08,
    alpha: 0.15 + Math.random() * 0.45,
  }));
}

/**
 * Polvo de partículas verdes flotando todo el alto de la página,
 * detrás del contenido — versión propia (no copiada) de un efecto de
 * "nube animada" visto en un sitio de referencia (Dala). Se dibuja en
 * canvas 2D (sin librerías nuevas, sin WebGL) en vez de con cientos de
 * nodos DOM, y se apoya en `useParallax` (mismo hook que ya usa
 * AmbientGlow) para que la capa entera se desplace a su propio ritmo
 * con el scroll.
 *
 * Respeta `prefers-reduced-motion`: si está activo, se dibuja un solo
 * frame estático y no arranca el loop de animación.
 */
export function ParticleField() {
  const parallaxRef = useParallax<HTMLDivElement>({ distance: -90 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const layer = parallaxRef.current;
    if (!canvas || !layer) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let frameId: number | undefined;

    const resize = () => {
      width = layer.offsetWidth;
      height = layer.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      particles = makeParticles(width, height);
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${COLOR}, ${p.alpha})`;
        ctx.fill();
      }
    };

    const tick = () => {
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
      }
      draw();
      frameId = requestAnimationFrame(tick);
    };

    resize();

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      draw();
    } else {
      frameId = requestAnimationFrame(tick);
    }

    const onResize = () => {
      resize();
      if (reduceMotion) draw();
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [parallaxRef]);

  return (
    <div className={styles.layer} aria-hidden="true" ref={parallaxRef}>
      <canvas className={styles.canvas} ref={canvasRef} />
    </div>
  );
}
