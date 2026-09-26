/**
 * Todo el contenido real del sitio vive en este archivo.
 *
 * La idea es que para cambiar el nombre, el correo o añadir un
 * proyecto nuevo NO haga falta tocar ningún componente: solo editar
 * los valores de aquí.
 *
 * Los textos entre corchetes, ej. "[algo]", son placeholders: todavía
 * no hay un dato real para ese campo. Reemplázalos antes de publicar
 * el sitio.
 */

export const site = {
  name: 'Alonso Fierro',
  role: 'Desarrollador Web Full-Stack',
  email: 'robertofierrourrutia@gmail.com',
  available: true,
  location: 'Remoto',
};

export interface ProjectHighlight {
  alt: string;
  caption: string;
}

export interface Project {
  name: string;
  url?: string;
  description: string;
  tags: string[];
  /** Capturas reales del proyecto para la galería tipo highlights (ver HighlightsGallery). */
  highlights?: ProjectHighlight[];
}

/**
 * Datos reales revisados directamente en el preview del sitio
 * (https://kadigestion-preview.netlify.app) el 2026-09-18: sitio
 * estático (HTML/CSS/JS, sin framework detectado), tipografías
 * Fraunces + Inter vía Google Fonts, alojado en Netlify. Reserva de
 * hora integrada con Google Calendar/Meet (widget embebido en la
 * sección de contacto) y contacto directo por WhatsApp Business.
 */
export const featuredProject: Project = {
  name: 'KadiGestión',
  url: 'https://www.kadigestion.cl',
  description:
    'Sitio para una firma de auditoría, contabilidad, finanzas y RR.HH. que entrega transparencia financiera y cumplimiento normativo a comunidades (condominios) y pymes en Santiago de Chile. Permite agendar una reunión por Google Calendar/Meet o escribir directo por WhatsApp desde el mismo sitio.',
  tags: ['HTML/CSS/JS', 'Netlify', 'Google Calendar', 'WhatsApp Business'],
  // Los archivos de imagen correspondientes (en orden) están en
  // web/src/assets/gallery/kadi-0{1..4}-*.jpg — se importan directo en
  // FeaturedProject.tsx (Vite necesita imports estáticos para poder
  // procesar/optimizar las imágenes, no funciona con rutas dinámicas).
  highlights: [
    {
      alt: 'Sección de inicio de KadiGestión',
      caption: 'Transparencia financiera para condominios y pymes en Santiago de Chile.',
    },
    {
      alt: 'Sección de pilares de KadiGestión',
      caption: 'Tres pilares: área financiera, gestión de RR.HH. y cumplimiento normativo.',
    },
    {
      alt: 'Sección de equipo de KadiGestión',
      caption: 'Más de 13 años de trayectoria conjunta de sus socios fundadores.',
    },
    {
      alt: 'Sección de contacto de KadiGestión',
      caption: 'Agenda una reunión por Google Calendar o escribe directo por WhatsApp.',
    },
  ],
};
