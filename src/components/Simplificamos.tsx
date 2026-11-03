"use client";

import { useEffect, useRef, useState } from "react";
import { simplificamos } from "@/lib/site";

type Marco = { x: number; y: number; w: number; h: number };
type Item = (typeof simplificamos)[number];

const MARGEN = 16;
const ARRIBA = 196;
const PASOS = 6;

function reducirMovimiento() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function IconoApp({ nombre }: { nombre: Item["nombre"] }) {
  if (nombre === "Digitalizamos")
    return (
      <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden>
        <rect x="6" y="5" width="22" height="26" rx="2" fill="#fff" stroke="#1d1e20" strokeWidth="2.5" />
        <path d="M11 13h12M11 18h12M11 23h7" stroke="#683ee6" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  if (nombre === "Automatizamos")
    return (
      <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden>
        <circle cx="17" cy="18" r="9" fill="#48c9b0" stroke="#1d1e20" strokeWidth="2.5" />
        <path d="M17 4v5M17 27v5M3 18h5M26 18h5" stroke="#1d1e20" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="17" cy="18" r="3" fill="#fff" stroke="#1d1e20" strokeWidth="2" />
      </svg>
    );
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden>
      <path d="M5 30h26" stroke="#1d1e20" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="8" y="18" width="5" height="10" fill="#683ee6" stroke="#1d1e20" strokeWidth="2" />
      <rect x="15.5" y="11" width="5" height="17" fill="#48c9b0" stroke="#1d1e20" strokeWidth="2" />
      <rect x="23" y="6" width="5" height="22" fill="#683ee6" stroke="#1d1e20" strokeWidth="2" />
    </svg>
  );
}

/** "Simplificamos la tecnología": cada ícono abre una ventana de sistema operativo viejo (aprobado 3 nov 2026). */
export default function Simplificamos() {
  const escenario = useRef<HTMLDivElement>(null);
  const cerrarRef = useRef<HTMLButtonElement>(null);
  const origen = useRef<HTMLButtonElement | null>(null);
  const arrastre = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

  const [abierta, setAbierta] = useState<Item | null>(null);
  const [zoom, setZoom] = useState<Marco | null>(null);
  const [escritos, setEscritos] = useState(0);
  const [mover, setMover] = useState({ x: 0, y: 0 });

  const texto = abierta ? [`C:\\> ${abierta.nombre.toLowerCase()}`, "", ...abierta.lineas].join("\n") : "";

  // Rectángulos que crecen del ícono a la ventana, como al abrir una carpeta en una Mac vieja.
  function abrir(item: Item, boton: HTMLButtonElement) {
    origen.current = boton;
    setAbierta(null);
    setMover({ x: 0, y: 0 });
    setEscritos(reducirMovimiento() ? Infinity : 0);
    const caja = escenario.current!.getBoundingClientRect();
    const icono = boton.firstElementChild!.getBoundingClientRect();
    const de: Marco = { x: icono.left - caja.left, y: icono.top - caja.top, w: icono.width, h: icono.height };
    const a: Marco = { x: MARGEN, y: ARRIBA, w: caja.width - MARGEN * 2, h: 210 };

    if (reducirMovimiento()) {
      setAbierta(item);
      return;
    }
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      const k = i / PASOS;
      setZoom({ x: de.x + (a.x - de.x) * k, y: de.y + (a.y - de.y) * k, w: de.w + (a.w - de.w) * k, h: de.h + (a.h - de.h) * k });
      if (i === PASOS) {
        clearInterval(id);
        setTimeout(() => {
          setZoom(null);
          setAbierta(item);
        }, 50);
      }
    }, 35);
  }

  function cerrar() {
    setAbierta(null);
    origen.current?.focus();
  }

  // Al abrir: foco al botón de cerrar y el texto se escribe solo, como terminal.
  useEffect(() => {
    if (!abierta) return;
    cerrarRef.current?.focus();
    const largo = texto.length;
    if (reducirMovimiento()) return;
    const id = setInterval(() => {
      setEscritos((n) => {
        if (n + 2 >= largo) clearInterval(id);
        return Math.min(largo, n + 2);
      });
    }, 16);
    return () => clearInterval(id);
  }, [abierta, texto]);

  const visible = texto.slice(0, escritos).split("\n");

  return (
    <div
      ref={escenario}
      className="escritorio borde relative min-h-[440px] overflow-hidden p-4"
      onKeyDown={(e) => {
        if (e.key === "Escape" && abierta) cerrar();
      }}
    >
      <h2 id="simplificamos" className="titulo-seccion text-blanco">
        Simplificamos la tecnología para pymes y emprendedores.
      </h2>

      <div className="mt-5 grid grid-cols-3 gap-2">
        {simplificamos.map((item) => (
          <button
            key={item.nombre}
            type="button"
            aria-haspopup="dialog"
            onClick={(e) => abrir(item, e.currentTarget)}
            className="group flex flex-col items-center gap-1.5 p-1 text-xs font-extrabold text-blanco"
          >
            <span className="nin mb-[5px] grid size-[60px] place-items-center rounded-[6px] bg-blanco group-active:translate-y-[5px] group-active:shadow-none">
              <IconoApp nombre={item.nombre} />
            </span>
            <span className="bg-tinta px-1.5">{item.nombre}</span>
          </button>
        ))}
      </div>

      {zoom && (
        <div
          aria-hidden
          className="pointer-events-none absolute z-10 border-2 border-dotted border-blanco"
          style={{ left: zoom.x, top: zoom.y, width: zoom.w, height: zoom.h }}
        />
      )}

      {abierta && (
        <section
          role="dialog"
          aria-labelledby="simplificamos-titulo"
          className="absolute z-20 rounded-[4px] border-2 border-tinta bg-blanco shadow-[5px_5px_0_var(--color-tinta)]"
          style={{ left: MARGEN, right: MARGEN, top: ARRIBA, transform: `translate(${mover.x}px, ${mover.y}px)` }}
        >
          <div
            className="barra-titulo relative h-[30px] cursor-grab border-b-2 border-tinta active:cursor-grabbing"
            onPointerDown={(e) => {
              if (e.target !== e.currentTarget) return;
              e.currentTarget.setPointerCapture(e.pointerId);
              arrastre.current = { x: e.clientX, y: e.clientY, ox: mover.x, oy: mover.y };
            }}
            onPointerMove={(e) => {
              const a = arrastre.current;
              if (!a || !e.currentTarget.hasPointerCapture(e.pointerId)) return;
              const alto = escenario.current!.clientHeight;
              setMover({
                x: Math.max(-MARGEN, Math.min(MARGEN, a.ox + e.clientX - a.x)),
                y: Math.max(-ARRIBA + 8, Math.min(alto - ARRIBA - 80, a.oy + e.clientY - a.y)),
              });
            }}
            onPointerUp={() => (arrastre.current = null)}
          >
            <button
              ref={cerrarRef}
              type="button"
              onClick={cerrar}
              aria-label="Cerrar ventana"
              className="absolute top-[3px] left-2 size-5 border-2 border-tinta bg-blanco p-0 active:bg-tinta"
            />
            <span
              id="simplificamos-titulo"
              className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blanco px-2 text-[13px] font-extrabold whitespace-nowrap"
            >
              {abierta.nombre.toLowerCase()}.exe
            </span>
          </div>

          <p className="sr-only">{abierta.lineas.filter(Boolean).join(" ").replace(/> /g, "")}</p>
          <div aria-hidden className="min-h-[136px] p-3 font-mono text-[13px] leading-normal">
            {visible.map((linea, i) => (
              <div key={i} className={`min-h-[1.5em] ${linea.startsWith("C:") || linea.startsWith(">") ? "font-bold text-violeta" : ""}`}>
                {linea}
                {i === visible.length - 1 && <span className="cursor-terminal ml-0.5 inline-block h-3.5 w-2 translate-y-0.5 bg-tinta" />}
              </div>
            ))}
          </div>

          <div className="flex justify-between border-t-2 border-tinta bg-turquesa px-2 py-1 text-[11px] font-bold">
            <span>{abierta.lineas.filter((l) => l.startsWith(">")).length} herramientas</span>
            <span>listo</span>
          </div>
        </section>
      )}
    </div>
  );
}
