# moonlaunch.mx

Sitio de Moon Launch. Reemplaza el sitio de Hostinger Website Builder.

## Stack

- **Next.js 16** (App Router, Cache Components) + **TypeScript**
- **Tailwind CSS v4**: tokens de marca en `src/app/globals.css` (`@theme`)
- **Motion**: animaciones que responden a lo que hace el usuario
- **Epilogue** (variable, servida localmente con `@fontsource`)
- Deploy en **Vercel**: cada push a `main` va a producción y cada PR genera un preview

## Dónde se edita qué

| Qué | Dónde |
|---|---|
| Teléfono, WhatsApp, correo, dirección | `src/lib/site.ts` → `contacto` |
| Problemas del diagnóstico y horas por problema | `src/lib/site.ts` → `dolores` |
| Servicios y pasos de trabajo | `src/lib/site.ts` → `servicios`, `pasos` |
| Colores y tipografía | `src/app/globals.css` |
| Diagnóstico interactivo | `src/components/Diagnostico.tsx` |

## Correr local

```bash
npm install
npm run dev
```

## Siguiente

- [ ] Guardar cada diagnóstico como lead (Supabase) y avisar por correo (Resend)
- [ ] Asistente que responde dudas con la info de Moon Launch (AI SDK + Claude)
- [ ] Logo y fuente Moonlightning en `public/`
- [ ] Páginas de casos de éxito
- [ ] Analytics (GA4 `G-Y18PD7J4E8` / GTM `GTM-TCZRC2ZG` del sitio anterior)
- [ ] Apuntar el DNS de moonlaunch.mx a Vercel
