import { useEffect, useRef } from 'react';
import styles from './ParticleField.module.css';

interface Particle {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  alpha: number;
  /** Qué tan rápido se desplaza esta partícula respecto al scroll (0-1) — da profundidad real, no una sola capa pareja. */
  depth: number;
}

const COUNT = 90;
const COLOR = '61, 220, 90'; // --color-accent en rgb, para variar alpha por partícula

function makeParticles(width: number, height: number): Particle[] {
  return Array.from({ length: COUNT }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: 3 + Math.random() * 5,
    vx: (Math.random() - 0.5) * 0.08,
    vy: (Math.random() - 0.5) * 0.08,
    alpha: 0.35 + Math.random() * 0.5,
    depth: 0.03 + Math.random() * 0.12,
  }));
}

function drawDiamond(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, alpha: number) {
  ctx.beginPath();
  ctx.moveTo(x, y - size);
  ctx.lineTo(x + size, y);
  ctx.lineTo(x, y + size);
  ctx.lineTo(x - size, y);
  ctx.closePath();
  ctx.fillStyle = `rgba(${COLOR}, ${alpha})`;
  ctx.fill();
}

/**
 * Polvo de rombos verdes flotando todo el alto de la página, detrás
 * del contenido — misma figura que el ícono de Furastudio (no un
 * círculo genérico ni los triángulos de la referencia de Dala).
 * Canvas 2D puro (sin librerías nuevas, sin WebGL).
 *
 * El parallax es por partícula, no de toda la capa junta: cada una
 * tiene su propio `depth`, así que al hacer scroll unas se desplazan
 * más rápido que otras — da sensación de profundidad real en vez de
 * una sola capa pegada moviéndose pareja.
 *
 * Respeta `prefers-reduced-motion`: si está activo, dibuja un solo
 * frame estático (sin drift propio ni parallax) y no arranca el loop.
 */
export function ParticleField() {
  const layerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const layer = layerRef.current;
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
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = makeParticles(width, height);
    };

    const draw = () => {
      const scrollY = window.scrollY;
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        const offsetY = (((p.y - scrollY * p.depth) % height) + height) % height;
        drawDiamond(ctx, p.x, offsetY, p.size, p.alpha);
      }
    };

    const tick = () => {
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x += width;
        if (p.x > width) p.x -= width;
        if (p.y < 0) p.y += height;
        if (p.y > height) p.y -= height;
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
  }, []);

  return (
    <div className={styles.layer} aria-hidden="true" ref={layerRef}>
      <canvas className={styles.canvas} ref={canvasRef} />
    </div>
  );
}
