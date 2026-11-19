import { site } from '../../content/site';
import styles from './WhatsAppButton.module.css';

const MESSAGE = 'Hola! Me gustaría conversar sobre un proyecto web.';

/**
 * Flotante y fijo (vive junto a Reflector/Nav en App.tsx, fuera de
 * <main>): un link `wa.me` con mensaje precargado, no la API paga de
 * WhatsApp Business — así que no entra en los cobros por conversación
 * de Meta. Mismo mecanismo que ya usan KadiGestión y Sabor y Romance.
 */
export function WhatsAppButton() {
  const href = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(MESSAGE)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.button}
      aria-label="Escribir por WhatsApp"
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.93 9.93 0 0 0 4.74 1.2c5.46 0 9.91-4.45 9.91-9.91 0-2.64-1.03-5.13-2.9-7A9.82 9.82 0 0 0 12.04 2Zm0 1.67c2.2 0 4.26.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23-1.48 0-2.93-.39-4.19-1.15l-.3-.17-3.12.82.83-3.04-.2-.32a8.17 8.17 0 0 1-1.25-4.36c0-4.54 3.69-8.24 8.24-8.24Zm-3.52 2.66c-.16 0-.43.06-.66.31-.22.25-.87.86-.87 2.07 0 1.21.89 2.38.99 2.54.14.16 1.76 2.72 4.25 3.75.59.27 1.05.42 1.41.53.59.19 1.13.16 1.56.1.48-.07 1.46-.6 1.67-1.17.21-.57.21-1.06.15-1.16-.07-.11-.23-.17-.48-.3-.25-.12-1.47-.72-1.69-.8-.23-.08-.37-.12-.54.13-.16.25-.63.8-.77.97-.14.16-.29.2-.53.07-.25-.12-1.13-.42-2.15-1.33a8.14 8.14 0 0 1-1.49-1.84c-.15-.25-.02-.39.12-.53.1-.12.25-.31.37-.47.1-.15.16-.27.24-.45.08-.17.03-.33-.03-.45-.05-.12-.58-1.36-.8-1.86-.2-.48-.43-.44-.6-.41-.08 0-.15 0-.22 0Z" />
      </svg>
    </a>
  );
}
