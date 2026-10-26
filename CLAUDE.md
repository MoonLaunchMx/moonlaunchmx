@AGENTS.md

# moonlaunch.mx

Sitio de Moon Launch, agencia de Diego Garza (apps a la medida, Odoo y automatización para pymes en México).
Todo el texto del sitio va en español de México.

## Stack

- Next.js 16 (App Router, Cache Components) + TypeScript + Tailwind v4 + Motion
- Hosting: **Cloudflare Workers** con `@opennextjs/cloudflare`. No es Vercel: nada de APIs exclusivas de Vercel
  (`@vercel/*`, Edge Config, `export const runtime = "edge"`).
- El Worker debe pesar menos de 3 MiB comprimido (plan gratis). Hoy pesa ~1.1 MiB. Revisa con
  `npx wrangler deploy --dry-run --outdir /tmp/cf-dry` si agregas dependencias pesadas.

## Proceso de cambios (aprobado por Diego, 25 oct 2026)

Diego aprueba dos veces: el diseño y el preview. Nada visual se construye sin mockup aprobado.

1. **Brief.** Qué cambia y por qué, en una o dos líneas. Si no está claro, pregunta antes de diseñar.
2. **Mockup en Claude Design** (artifact tipo Design), con el Design System de Moon Launch y celular primero.
   Hasta 3 opciones cuando hay que elegir dirección.
3. **Aprobación del diseño.** Solo cuenta un "aprobado" explícito de Diego. Con eso se congela el alcance;
   lo que salga después es otro brief.
4. **Rama + PR.** Construye exactamente lo aprobado. El PR lleva el link del mockup (usa la plantilla).
   Antes de cada commit: `npm run lint`, `npx tsc --noEmit` y `npx opennextjs-cloudflare build`.
5. **Preview.** Workers Builds publica una URL por rama. Diego la revisa en su celular contra el mockup.
6. **Aprobación del preview** y merge a `main` = producción. Después, revisa producción.

**Carril rápido:** textos, typos y datos de contacto se saltan los pasos 2 y 3, pero sí van con rama, PR y preview.

Reglas:
- Nunca hagas push directo a `main` ni merge sin que Diego lo pida.
- Si algo no estaba en el mockup aprobado, no lo agregues "de paso": propónlo como brief nuevo.
- `npm run dev` para desarrollo; `npm run preview` para probar en el runtime real de Workers.

## Estado

El home actual (diagnóstico, secciones y logo con cohetes) es un **borrador** previo al proceso: no está
aprobado. El rediseño arranca en el paso 1. Lo único decidido: logo dirección B (`moonlaunch.exe`) con algo
interactivo de cohetes, y la referencia visual de charm.sh.

## Marca

- Colores oficiales: violeta `#683EE6`, tinta `#1D1E20`, blanco `#FFFFFF`, turquesa `#48C9B0`.
  Tokens en `src/app/globals.css` (`@theme`).
- Tipografía de marca: Moonlightning (`font-marca`, archivos en `public/fonts/`). Solo para el logo y momentos
  puntuales; el resto en Epilogue (`font-sans`).
- Logo: ventana retro `moonlaunch.exe` (`src/components/LogoExe.tsx`). La interacción con cohetes está pendiente de mockup.
- Dirección visual: retro tech simple, más cerca de charm.sh que de un sitio saturado. Mobile first:
  la mayoría del tráfico es de celular.
- Siempre respetar `prefers-reduced-motion`, foco visible y contraste accesible.

## Contenido

- Todo el texto editable vive en `src/lib/site.ts` (contacto, problemas del diagnóstico, servicios, pasos).
- Nunca mostrar datos reales de clientes (nombres, precios, costos) sin permiso explícito de Diego.
