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

## Flujo

1. Trabaja en una rama y abre PR. Workers Builds publica una versión de preview por rama.
2. Antes de cada commit: `npm run lint`, `npx tsc --noEmit` y `npx opennextjs-cloudflare build`.
3. Merge a `main` = producción en moonlaunch.mx. Nunca hagas push directo a `main` sin que Diego lo pida.
4. `npm run dev` para desarrollo; `npm run preview` para probar en el runtime real de Workers.

## Marca

- Colores oficiales: violeta `#683EE6`, tinta `#1D1E20`, blanco `#FFFFFF`, turquesa `#48C9B0`.
  Tokens en `src/app/globals.css` (`@theme`).
- Tipografía de marca: Moonlightning (`font-marca`, archivos en `public/fonts/`). Solo para el logo y momentos
  puntuales; el resto en Epilogue (`font-sans`).
- Logo: ventana retro `moonlaunch.exe` (`src/components/LogoExe.tsx`). Tocarla lanza un cohete.
- Dirección visual: retro tech simple, más cerca de charm.sh que de un sitio saturado. Mobile first:
  la mayoría del tráfico es de celular.
- Siempre respetar `prefers-reduced-motion`, foco visible y contraste accesible.

## Contenido

- Todo el texto editable vive en `src/lib/site.ts` (contacto, problemas del diagnóstico, servicios, pasos).
- Nunca mostrar datos reales de clientes (nombres, precios, costos) sin permiso explícito de Diego.
