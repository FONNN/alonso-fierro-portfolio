import { useEffect, useRef } from 'react';
import type { Project } from '../../content/site';
import styles from './ProjectBento.module.css';

export interface ProjectBentoItem {
  project: Project;
  src: string;
  /** Tamaño dentro del bento (7/12 vs 5/12 de ancho, ver el CSS). */
  size: 'lg' | 'md';
}

interface TileProps {
  item: ProjectBentoItem;
}

/**
 * Tarjeta real: en vez de un <video>, una sola captura de página
 * completa que se "panea" verticalmente con un @keyframes CSS
 * (translateY en % relativo a la propia imagen) mientras el tile está
 * en pantalla — mismo patrón de IntersectionObserver que ya usa
 * Reflector.tsx, pero acá solo alterna una clase (.panning) en vez de
 * controlar reproducción de video. Respeta `prefers-reduced-motion`
 * igual que ParticleSphere.tsx: en ese caso la clase nunca se agrega y
 * la imagen queda fija mostrando el tope de la captura.
 */
function BentoTile({ item }: TileProps) {
  const { project, src, size } = item;
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => wrap.classList.toggle(styles.panning, entry.isIntersecting),
      { threshold: 0.25 },
    );
    observer.observe(wrap);

    return () => observer.disconnect();
  }, []);

  const content = (
    <>
      <div className={styles.imageWrap} ref={wrapRef}>
        <img className={styles.image} src={src} alt="" aria-hidden="true" loading="lazy" />
      </div>
      <div className={styles.meta}>
        <p className={styles.category}>{project.tags.join(' · ')}</p>
        <h3 className={styles.name}>{project.name}</h3>
        <p className={styles.tagline}>{project.tagline}</p>
      </div>
    </>
  );

  return (
    <div className={`${styles.tile} ${size === 'lg' ? styles.tileLg : styles.tileMd}`}>
      {project.url ? (
        <a className={styles.link} href={project.url} target="_blank" rel="noopener noreferrer">
          {content}
        </a>
      ) : (
        <div className={styles.link}>{content}</div>
      )}
    </div>
  );
}

const GHOST_SIZES = [styles.ghostSm, styles.ghostSm, styles.ghostSm, styles.ghostWide];

interface ProjectBentoProps {
  items: ProjectBentoItem[];
}

export function ProjectBento({ items }: ProjectBentoProps) {
  return (
    <div className={styles.grid}>
      {items.map((item) => (
        <BentoTile key={item.project.name} item={item} />
      ))}
      {GHOST_SIZES.map((sizeClass, index) => (
        <div key={index} className={`${styles.tile} ${styles.ghost} ${sizeClass}`} aria-hidden="true" />
      ))}
    </div>
  );
}
