@AGENTS.md

# moonlaunch.mx

Sitio de Moon Launch, agencia de Diego Garza (apps a la medida, Odoo y automatización para pymes en México).
Todo el texto del sitio va en español de México.

## Stack

- Next.js 16 (App Router, Cache Components) + TypeScript + Tailwind v4 (animaciones en CSS)
- Hosting: **Vercel**, en el equipo Pro de Diego (junto a Anfiora y Cuantix). Decidido el 2 nov 2026; antes se
  probó Cloudflare Workers y se descartó porque Diego ya paga Vercel Pro.
- Vercel cobra por uso dentro del mismo equipo: mantén el sitio casi todo estático. Antes de agregar funciones
  pesadas, optimización de imágenes o IA, avísale a Diego por el costo.

## Proceso de cambios (aprobado por Diego, 25 oct 2026)

Diego aprueba dos veces: el diseño y el preview. Nada visual se construye sin mockup aprobado.

1. **Brief.** Qué cambia y por qué, en una o dos líneas. Si no está claro, pregunta antes de diseñar.
2. **Mockup en Claude Design** (artifact tipo Design), con el Design System de Moon Launch y celular primero.
   Hasta 3 opciones cuando hay que elegir dirección.
3. **Aprobación del diseño.** Solo cuenta un "aprobado" explícito de Diego. Con eso se congela el alcance;
   lo que salga después es otro brief.
4. **Rama + PR.** Construye exactamente lo aprobado. El PR lleva el link del mockup (usa la plantilla).
   Antes de cada commit: `npm run lint`, `npx tsc --noEmit` y `npm run build`.
5. **Preview.** Vercel publica una URL de preview por cada PR. Diego la revisa en su celular contra el mockup.
6. **Aprobación del preview** y merge a `main` = producción. Después, revisa producción.

**Carril rápido:** textos, typos y datos de contacto se saltan los pasos 2 y 3, pero sí van con rama, PR y preview.

Reglas:
- Nunca hagas push directo a `main` ni merge sin que Diego lo pida.
- Si algo no estaba en el mockup aprobado, no lo agregues "de paso": propónlo como brief nuevo.
- `npm run dev` para desarrollo; `npm run build && npm start` para probar el build de producción.

## Estado

Diseño aprobado por Diego (2 nov 2026): home + Servicios, Casos, Contacto, Blog y artículo, en el canvas
"moonlaunch.mx · mockups" de Claude Design (https://claude.ai/artifact/9Hcdqub1etvDJdcUukLcYU).

Decisiones que no se reabren sin brief nuevo:
- Titular "Automatiza. Ordena. Despega.". Nada de "con app o sin app" ni "semanas"; el plazo es "meses, no años".
- Ventanas retro solo en el logo, en Moon OS (home) y en el formulario de Contacto. El resto, tarjetas simples.
- Poco texto: frases de una línea; las dudas se contestan a la vista, sin acordeones.
- Navbar en píldora flotante arriba (logo, Agendar y Menú). Todo lo que se pica usa `.nin` o `.btn`: sombra
  hacia abajo y se hunde al tocarlo, como botón de Nintendo. Las tarjetas que no se pican conservan la sombra diagonal.
- Diagnóstico de 45 min sin costo. Apps en suscripción o compra, más soporte mensual. Sin cobro por usuario.
- Pendiente de brief: cohetes en el logo, asistente con IA real, leads en Supabase, versión de escritorio.

## Marca

- Colores oficiales: violeta `#683EE6`, tinta `#1D1E20`, blanco `#FFFFFF`, turquesa `#48C9B0`.
  Tokens en `src/app/globals.css` (`@theme`).
- Tipografía de marca: Moonlightning (`font-marca`, archivos en `public/fonts/`). **Sin licencia comercial**: Diego
  decidió usarla por ahora y cambiarla después. No la presentes como resuelta. Solo para el logo y momentos
  puntuales; el resto en Epilogue (`font-sans`).
- Logo: ventana retro `moonlaunch.exe` (`src/components/Logo.tsx`). La interacción con cohetes está pendiente de mockup.
- Dirección visual: retro tech simple, más cerca de charm.sh que de un sitio saturado. Mobile first:
  la mayoría del tráfico es de celular.
- Siempre respetar `prefers-reduced-motion`, foco visible y contraste accesible.

## Contenido

- Todo el texto editable vive en `src/lib/site.ts`. Lo que va entre corchetes `[así]` está pendiente de Diego.
- Nunca mostrar datos reales de clientes (nombres, precios, costos) sin permiso explícito de Diego.
