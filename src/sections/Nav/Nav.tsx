import { useEffect, useRef, useState } from 'react';
import { site } from '../../content/site';
import { useMountReveal } from '../../hooks/useMountReveal';
import { gsap, useGSAP } from '../../lib/gsapConfig';
import { pauseSmoothScroll, resumeSmoothScroll } from '../../lib/smoothScroll';
import logoDesktop from '../../assets/logo/logo-desktop-blanco.svg';
import logoMobile from '../../assets/logo/logo-mobile-blanco.svg';
import styles from './Nav.module.css';

const NAV_LINKS = [
  { href: '#sobre-mi', label: 'Sobre mí' },
  { href: '#proyectos', label: 'Proyectos' },
  { href: '#contacto', label: 'Contacto' },
];

/**
 * El menú mobile es un panel a pantalla completa (no un dropdown chico):
 * por debajo de cierto ancho, `.links` desaparece y este botón +
 * panel toman su lugar. El ícono de 3 líneas se transforma en una X
 * con puro CSS (rotación + fade de la línea del medio) — no hace
 * falta GSAP para eso, es un cambio de 2 estados.
 *
 * El contenido del panel sí usa GSAP: cada link entra con fade +
 * traslación al abrir (mismo lenguaje visual que el resto del sitio),
 * en cascada.
 */
export function Nav() {
  const ref = useMountReveal<HTMLElement>();
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useGSAP(
    () => {
      const panel = panelRef.current;
      if (!panel || !isOpen) return;

      const items = panel.querySelectorAll('[data-menu-item]');
      gsap.fromTo(
        items,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power3.out' },
      );
    },
    { dependencies: [isOpen], scope: panelRef },
  );

  // Bloquea el scroll suave (Lenis) mientras el panel está abierto, y
  // lo restaura al cerrar o si el componente se desmonta con el panel
  // abierto (edge case, pero mejor no dejar el scroll trabado).
  useEffect(() => {
    if (isOpen) {
      pauseSmoothScroll();
      firstLinkRef.current?.focus();
    } else {
      resumeSmoothScroll();
    }
    return () => {
      if (isOpen) resumeSmoothScroll();
    };
  }, [isOpen]);

  // Cerrar con Escape, devolviendo el foco al botón que abrió el menú.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className={styles.nav} ref={ref}>
      <div className={styles.brand} data-reveal>
        {/* Dos SVG, uno por breakpoint (ver Nav.module.css): el de
            mobile es solo el ícono (sin texto, pensado para el header
            angosto), el de desktop es el lockup completo con el
            wordmark. Ambos en blanco porque el Nav vive siempre sobre
            fondo oscuro. */}
        <img className={styles.logoMobile} src={logoMobile} alt={site.name} width={32} height={32} />
        <img
          className={styles.logoDesktop}
          src={logoDesktop}
          alt={site.name}
          width={194}
          height={62}
        />
      </div>

      <span className={styles.status} data-reveal>
        {site.available ? 'Disponible' : 'No disponible'} · {site.location}
      </span>

      <nav className={styles.links} aria-label="Navegación principal" data-reveal>
        {NAV_LINKS.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        ref={buttonRef}
        className={styles.menuButton}
        data-reveal
        aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={isOpen}
        aria-controls="menu-mobile"
        onClick={() => setIsOpen((v) => !v)}
      >
        <span className={styles.iconBars} data-open={isOpen || undefined} aria-hidden="true">
          <span className={styles.bar} />
          <span className={styles.bar} />
          <span className={styles.bar} />
        </span>
      </button>

      <div
        id="menu-mobile"
        ref={panelRef}
        className={styles.panel}
        data-open={isOpen || undefined}
        aria-hidden={!isOpen}
      >
        <ul className={styles.panelList}>
          {NAV_LINKS.map((link, index) => (
            <li key={link.href}>
              <a
                href={link.href}
                ref={index === 0 ? firstLinkRef : undefined}
                className={styles.panelLink}
                data-menu-item
                tabIndex={isOpen ? 0 : -1}
                onClick={closeMenu}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <span className={styles.panelFooter} data-menu-item>
          {site.email}
        </span>
      </div>
    </header>
  );
}
