import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import { useGSAP } from '@gsap/react';

/**
 * Registro central de plugins de GSAP.
 *
 * `registerPlugin` solo necesita llamarse una vez en toda la app, pero
 * es inofensivo llamarlo más de una vez (GSAP lo ignora si ya está
 * registrado). Aun así, todo lo demás importa gsap/ScrollTrigger/
 * useGSAP desde ESTE archivo (no directo desde 'gsap') para que el
 * registro quede garantizado sin pensar en el orden de imports.
 */
gsap.registerPlugin(ScrollTrigger, CustomEase, useGSAP);

/**
 * Curva de easing del sitio completo: arranque lento, freno decidido
 * ("optical focus pulling"). Reemplaza a `power3.out` como curva por
 * defecto en las animaciones de scroll (ver useScrollReveal.ts /
 * useMountReveal.ts) y se reutiliza en las transiciones CSS de hover
 * (mismo valor, `cubic-bezier(0.52, 0.01, 0, 1)`, escrito directo en
 * cada .module.css porque CSS no puede importar esta constante).
 */
CustomEase.create('focusPull', '0.52, 0.01, 0, 1');

export { gsap, ScrollTrigger, useGSAP };
