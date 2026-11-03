# moonlaunch.mx

Sitio de Moon Launch. Reemplaza el sitio de Hostinger Website Builder.

## Stack

- **Next.js 16** (App Router, Cache Components) + **TypeScript**
- **Tailwind CSS v4**: tokens de marca en `src/app/globals.css` (`@theme`)
- **Epilogue** (variable, servida localmente con `@fontsource`) y **Moonlightning** para el logo
- Deploy en **Vercel**: cada PR genera un preview y el merge a `main` va a producción

## Dónde se edita qué

| Qué | Dónde |
|---|---|
| Todos los textos, precios, casos y contacto | `src/lib/site.ts` |
| Colores y tipografía | `src/app/globals.css` |
| Switch "Tu operación / Con Moon Launch" | `src/components/OperacionSwitch.tsx` |
| Moon OS (diagnóstico, qué hacemos, pregúntale, casos) | `src/components/MoonOS.tsx` |
| Páginas | `src/app/` (`servicios`, `casos`, `contacto`, `blog`) |

## Correr local

```bash
npm install
npm run dev                  # desarrollo
npm run build && npm start   # probar el build de producción
```

## Siguiente

- [ ] Guardar cada diagnóstico como lead (Supabase) y avisar por correo (Resend)
- [ ] Asistente que responde dudas con la info de Moon Launch (AI SDK + Claude)
- [ ] Analytics (GA4 `G-Y18PD7J4E8` / GTM `GTM-TCZRC2ZG` del sitio anterior)
- [ ] Apuntar moonlaunch.mx a Vercel (cuidando los registros MX del correo)
