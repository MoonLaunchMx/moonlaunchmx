"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as EventoPuntero } from "react";
import { abrirAgenda } from "@/components/Agenda";
import { agenda, escritorio, hero } from "@/lib/site";

/**
 * Hero "la compu de tu negocio" (aprobado 13 nov 2026), en escritorio y en celular.
 * Paso 0: archivos regados que se arrastran y se pican. "Despegar" corre:
 * 1 Ordena (cada archivo a su carpeta), 2 Automatiza (árbol de áreas y su gente), 3 Despega (tu-negocio.app).
 *
 * Todo se mide en unidades de un diseño fijo. Escritorio: 1440 de ancho y --u escala con la pantalla.
 * Celular: el escenario llena lo que queda de la pantalla bajo el titular; --u escala con el ancho
 * (390) y --v con el alto (400), para que se vea entero en cualquier teléfono.
 */

type Modo = "escritorio" | "celular";
type Paso = 0 | 1 | 2 | 3;
type XY = { x: number; y: number };
type XYR = XY & { r: number };
type ModuloId = keyof typeof escritorio.modulos;

type Disposicion = {
  ancho: number;
  alto: number;
  limiteY: number;
  carpeta: { w: number; icono: number; etiqueta: number; alto: number };
  archivo: { w: number; icono: number; etiqueta: number; notaW: number; notaLetra: number };
  caos: Record<string, XYR>;
  orden: Record<string, XY>;
  raiz: XY & { w: number; alto: number; barra: number; letra: number };
  barraY: number;
  columnas: Record<string, number>;
  carpetaY: number;
  gente: { y: number; dy: number; w: number; letra: number };
  lema: XY & { w: number; letra: number };
  app: XY & { w: number; lateral: boolean };
  alerta: XY & { w: number };
  pasos: XY & { w: number };
  enApp: XY & { dy: number };
};

const ESCRITORIO: Disposicion = {
  ancho: 1440,
  alto: 780,
  limiteY: 670,
  carpeta: { w: 124, icono: 80, etiqueta: 14, alto: 104 },
  archivo: { w: 132, icono: 60, etiqueta: 12, notaW: 136, notaLetra: 19 },
  caos: Object.fromEntries([
    ...escritorio.carpetas.map((c) => [c.id, c.caos]),
    ...escritorio.archivos.map((f) => [f.id, { x: f.x, y: f.y, r: f.r }]),
  ]),
  orden: Object.fromEntries(escritorio.carpetas.map((c) => [c.id, c.orden])),
  raiz: { x: 960, y: 8, w: 200, alto: 76, barra: 22, letra: 19 },
  barraY: 120,
  columnas: Object.fromEntries(escritorio.carpetas.map((c) => [c.id, c.arbol.x])),
  carpetaY: 154,
  gente: { y: 292, dy: 50, w: 142, letra: 14 },
  lema: { x: 750, y: 420, w: 622, letra: 17 },
  app: { x: 760, y: 30, w: 600, lateral: true },
  alerta: { x: 820, y: 200, w: 400 },
  pasos: { x: 760, y: 600, w: 600 },
  enApp: { x: 760, y: 100, dy: 56 },
};

const CELULAR: Disposicion = {
  ancho: 390,
  alto: 400,
  limiteY: 320,
  carpeta: { w: 84, icono: 50, etiqueta: 11, alto: 66 },
  archivo: { w: 88, icono: 38, etiqueta: 9.5, notaW: 96, notaLetra: 14 },
  caos: {
    ventas: { x: 296, y: 4, r: -6 },
    compras: { x: 8, y: 196, r: 8 },
    inventario: { x: 298, y: 198, r: -10 },
    cobranza: { x: 150, y: 282, r: 5 },
    xls1: { x: 6, y: 6, r: -8 },
    csv: { x: 104, y: 0, r: -12 },
    sh1: { x: 200, y: 40, r: 6 },
    xls2: { x: 110, y: 112, r: -4 },
    pdf1: { x: 12, y: 112, r: 10 },
    wa: { x: 296, y: 112, r: 7 },
    pdf2: { x: 212, y: 140, r: -9 },
    doc: { x: 22, y: 280, r: -12 },
    sh2: { x: 272, y: 284, r: 9 },
    nota: { x: 110, y: 192, r: -7 },
  },
  orden: { ventas: { x: 60, y: 30 }, compras: { x: 246, y: 30 }, inventario: { x: 60, y: 190 }, cobranza: { x: 246, y: 190 } },
  raiz: { x: 125, y: 0, w: 140, alto: 54, barra: 18, letra: 15 },
  barraY: 78,
  columnas: { ventas: 7, compras: 104, inventario: 202, cobranza: 299 },
  carpetaY: 98,
  gente: { y: 188, dy: 40, w: 92, letra: 11 },
  lema: { x: 12, y: 284, w: 366, letra: 13 },
  app: { x: 12, y: 0, w: 366, lateral: false },
  alerta: { x: 20, y: 90, w: 350 },
  pasos: { x: 0, y: 358, w: 390 },
  enApp: { x: 30, y: 40, dy: 24 },
};

const u = (n: number) => `calc(var(--u) * ${n})`;
const EASE = "cubic-bezier(.2,.9,.2,1)";

const BANDA: Record<string, [string, string]> = {
  XLS: ["#48c9b0", "#1d1e20"],
  SHEETS: ["#48c9b0", "#1d1e20"],
  CSV: ["#ffffff", "#1d1e20"],
  PDF: ["#683ee6", "#ffffff"],
  DOC: ["#683ee6", "#ffffff"],
  IMG: ["#1d1e20", "#ffffff"],
};
const TONO = { t: "bg-turquesa text-tinta", v: "bg-violeta text-blanco", b: "bg-blanco text-tinta" } as const;

const PASOS = [
  { n: 1 as const, etiqueta: "Ordena" },
  { n: 2 as const, etiqueta: "Automatiza" },
  { n: 3 as const, etiqueta: "Despega" },
];

function IconoCarpeta({ ancho, relleno = "#48c9b0", trazo = 3 }: { ancho: number; relleno?: string; trazo?: number }) {
  return (
    <svg viewBox="0 0 80 66" style={{ width: u(ancho), height: u((ancho * 66) / 80) }} aria-hidden>
      <path d="M3 10h25l7 8h42v45H3z" fill={relleno} stroke="#1d1e20" strokeWidth={trazo} strokeLinejoin="round" />
      <path d="M3 26h74" stroke="#1d1e20" strokeWidth={trazo} />
    </svg>
  );
}

function Robot() {
  return (
    <svg viewBox="0 0 36 36" style={{ width: u(26), height: u(26) }} className="shrink-0" aria-hidden>
      <rect x="7" y="11" width="22" height="18" rx="3" fill="#48c9b0" stroke="#fff" strokeWidth="2.5" />
      <circle cx="13.5" cy="18.5" r="2.5" fill="#fff" />
      <circle cx="22.5" cy="18.5" r="2.5" fill="#fff" />
      <path d="M18 11V6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function IconoCalendario({ tam }: { tam: string }) {
  return (
    <svg viewBox="0 0 24 24" style={{ width: tam, height: tam }} className="shrink-0" aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="2" fill="#fff" stroke="#1d1e20" strokeWidth="2" />
      <path d="M3 10h18M8 3v4M16 3v4" stroke="#1d1e20" strokeWidth="2" strokeLinecap="round" />
      <rect x="13" y="13" width="4" height="4" fill="#48c9b0" stroke="#1d1e20" strokeWidth="1.5" />
    </svg>
  );
}

function Pista({ tam, corta = false }: { tam: string; corta?: boolean }) {
  return (
    <>
      <svg viewBox="0 0 24 24" style={{ width: tam, height: tam }} className="shrink-0" aria-hidden>
        <path d="M8 3v11l3-3 2.5 6 2.5-1-2.5-6H18z" fill="#48c9b0" stroke="#1d1e20" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
      {corta ? "Arrastra y pica los archivos." : "Arrastra y pica los archivos. Así se ve la compu de muchos negocios."}
    </>
  );
}

export default function Escritorio({ modo }: { modo: Modo }) {
  const d = modo === "escritorio" ? ESCRITORIO : CELULAR;
  const cel = modo === "celular";
  // En celular lo vertical se mide con --v (alto del escenario); en escritorio todo con --u.
  const uy = (n: number) => (cel ? `calc(var(--v) * ${n})` : u(n));
  const suma = (yv: number, yu: number) => (cel ? `calc(var(--v) * ${yv} + var(--u) * ${yu})` : u(yv + yu));
  // En celular lo horizontal se mide con --x (ancho del escenario); los tamaños con --u, que se encoge si el teléfono es bajito.
  const ux = (n: number) => (cel ? `calc(var(--x) * ${n})` : u(n));
  const centrado = (cx: number, w: number) => (cel ? `calc(var(--x) * ${cx} - var(--u) * ${w / 2})` : u(cx - w / 2));

  const escenario = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const arrastre = useRef<{
    id: string;
    el: HTMLButtonElement;
    sx: number;
    sy: number;
    ox: number;
    oy: number;
    kx: number;
    ky: number;
    umbral: number;
    movido: boolean;
  } | null>(null);
  const zTop = useRef(30);
  const origenAlerta = useRef<HTMLButtonElement | null>(null);
  const niIdea = useRef<HTMLButtonElement>(null);

  const [paso, setPaso] = useState<Paso>(0);
  const [arbolAbierto, setArbolAbierto] = useState(false);
  const [pos, setPos] = useState<Record<string, XY>>({});
  const [z, setZ] = useState<Record<string, number>>({});
  const [arrastrando, setArrastrando] = useState<string | null>(null);
  const [alerta, setAlerta] = useState<string | null>(null);
  const [modulo, setModulo] = useState<ModuloId>("ventas");

  function limpiar() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }
  function despues(ms: number, fn: () => void) {
    timers.current.push(window.setTimeout(fn, ms));
  }
  useEffect(() => {
    const t = timers;
    return () => t.current.forEach(clearTimeout);
  }, []);

  // Al abrir la alerta, el foco va a sus botones.
  useEffect(() => {
    if (alerta) niIdea.current?.focus();
  }, [alerta]);

  function empezar() {
    limpiar();
    arrastre.current = null;
    setAlerta(null);
    setArrastrando(null);
    setArbolAbierto(false);
    setPaso(1);
    despues(1500, () => setPaso(2));
    despues(2050, () => setArbolAbierto(true));
    despues(7600, () => setPaso(3)); // Automatiza se queda ~5.5 s para que se lea el árbol.
  }
  function volver() {
    limpiar();
    setPaso(0);
    setArbolAbierto(false);
    setPos({});
    setAlerta(null);
    setModulo("ventas");
  }
  function irPaso(n: Paso) {
    limpiar();
    setAlerta(null);
    setPaso(n);
    setArbolAbierto(n !== 2);
    if (n === 2) despues(550, () => setArbolAbierto(true));
  }
  function cerrarAlerta() {
    setAlerta(null);
    origenAlerta.current?.focus();
  }

  function bajar(e: EventoPuntero<HTMLButtonElement>, id: string, x: number, y: number) {
    if (paso !== 0 || e.button !== 0) return;
    const el = e.currentTarget;
    try {
      el.setPointerCapture(e.pointerId);
    } catch {}
    const caja = escenario.current!.getBoundingClientRect();
    arrastre.current = {
      id,
      el,
      sx: e.clientX,
      sy: e.clientY,
      ox: x,
      oy: y,
      kx: caja.width / d.ancho,
      ky: caja.height / d.alto,
      // Con el dedo hay más temblor: hace falta moverlo más para que cuente como arrastre.
      umbral: e.pointerType === "touch" ? 10 : 5,
      movido: false,
    };
    const nz = ++zTop.current;
    setZ((prev) => ({ ...prev, [id]: nz }));
  }
  function mover(e: EventoPuntero<HTMLDivElement>) {
    const a = arrastre.current;
    if (!a) return;
    if (!a.movido && Math.abs(e.clientX - a.sx) + Math.abs(e.clientY - a.sy) < a.umbral) return;
    a.movido = true;
    const dx = (e.clientX - a.sx) / a.kx;
    const dy = (e.clientY - a.sy) / a.ky;
    setArrastrando(a.id);
    setPos((prev) => ({
      ...prev,
      [a.id]: { x: Math.max(0, Math.min(d.ancho - d.carpeta.w, a.ox + dx)), y: Math.max(0, Math.min(d.limiteY, a.oy + dy)) },
    }));
  }
  // Al soltar sin haber arrastrado es un toque: se abre la duda del archivo. No esperamos el "click",
  // que algunos navegadores de celular no disparan después de capturar el puntero.
  function soltar() {
    const a = arrastre.current;
    if (!a) return;
    arrastre.current = null;
    setArrastrando(null);
    if (!a.movido) {
      origenAlerta.current = a.el;
      setAlerta(a.id);
    }
  }
  // El navegador se quedó con el gesto (por ejemplo, para hacer scroll): ni arrastre ni toque.
  function cancelar() {
    arrastre.current = null;
    setArrastrando(null);
  }
  // Teclado (Enter/Espacio): el clic llega sin puntero (detail 0) y abre la duda.
  function picar(e: React.MouseEvent<HTMLButtonElement>, id: string) {
    if (e.detail !== 0) return;
    origenAlerta.current = e.currentTarget;
    setAlerta(id);
  }

  const centro = (id: string) => d.columnas[id] + d.carpeta.w / 2;
  const raizCarpeta: XY = { x: d.raiz.x + d.raiz.w / 2 - d.carpeta.w / 2, y: d.raiz.y };
  const donde = (id: string): XY | null => {
    if (paso === 1) return d.orden[id];
    if (paso === 2 && !arbolAbierto) return raizCarpeta;
    if (paso >= 2) return { x: d.columnas[id], y: d.carpetaY };
    return null;
  };
  const juntas = paso === 2 && !arbolAbierto;
  const enApp = paso === 3;

  const transicion = (quieto: boolean, retraso: number, opacidadExtra = 0) =>
    quieto
      ? "none"
      : `left .7s ${EASE} ${retraso}ms, top .7s ${EASE} ${retraso}ms, transform .7s ${EASE} ${retraso}ms, opacity .3s ease ${retraso + opacidadExtra}ms`;

  const todos = [
    ...escritorio.archivos.map((f) => ({ id: f.id, nombre: f.nombre, duda: f.duda })),
    ...escritorio.carpetas.map((c) => ({ id: c.id, nombre: `Carpeta ${c.nombre}`, duda: "Está vacía. Todo sigue regado en el escritorio." })),
  ];
  const laAlerta = paso === 0 && alerta ? todos.find((t) => t.id === alerta) : undefined;
  const mod = escritorio.modulos[modulo];
  const primero = escritorio.carpetas[0].id;
  const ultimo = escritorio.carpetas[escritorio.carpetas.length - 1].id;

  const palabra = (n: number) => {
    const activa = paso === n;
    return `inline-block -ml-[0.1em] px-[0.1em] transition-colors duration-300 ${
      activa ? "bg-turquesa text-tinta" : n === 3 ? "text-violeta" : "text-tinta"
    }`;
  };

  const titular = (
    <h1 className={`m-0 font-extrabold tracking-[-0.045em] ${cel ? "text-[min(12vw,6.2svh,52px)] leading-[0.9]" : ""}`} style={cel ? undefined : { fontSize: u(104), lineHeight: 0.92 }}>
      {hero.titular.map((t, i) => (
        <span key={t}>
          <span className={palabra(i + 1)}>{t}</span>
          {i < 2 && <br />}
        </span>
      ))}
    </h1>
  );

  const botonHablemos = (estilo?: CSSProperties, clase = "") => (
    <button type="button" onClick={abrirAgenda} aria-haspopup="dialog" className={`btn bg-violeta text-blanco ${clase}`} style={estilo}>
      <IconoCalendario tam={cel ? "20px" : u(20)} />
      {agenda.boton}
    </button>
  );
  const botonDespegar = (estilo?: CSSProperties, clase = "") => (
    <button type="button" onClick={paso === 0 ? empezar : volver} className={`btn bg-blanco text-tinta ${clase}`} style={estilo}>
      {paso === 0 ? "Despegar" : "Volver al caos"}
    </button>
  );

  const escenarioContenido = (
    <>
      {/* Paso 2: "Tu negocio" se divide en 4 áreas y de cada una sale su gente */}
      {paso === 2 && (
        <section
          aria-label="Tu negocio"
          className="abre absolute z-30 rounded-[4px] border-2 border-tinta bg-blanco shadow-[4px_4px_0_var(--color-tinta)]"
          style={{ left: centrado(d.raiz.x + d.raiz.w / 2, d.raiz.w), top: uy(d.raiz.y), width: u(d.raiz.w) }}
        >
          <div
            className="flex items-center justify-center border-b-2 border-tinta bg-violeta font-marca text-blanco italic"
            style={{ height: u(d.raiz.barra), fontSize: u(d.raiz.barra / 2) }}
          >
            tu-negocio
          </div>
          <div className="text-center font-extrabold tracking-[-0.02em]" style={{ padding: u(d.raiz.letra / 2), fontSize: u(d.raiz.letra) }}>
            Tu negocio
          </div>
        </section>
      )}
      {paso === 2 && arbolAbierto && (
        <>
          <div aria-hidden>
            <div
              className="linea-y absolute bg-tinta"
              style={{ left: ux(d.raiz.x + d.raiz.w / 2 - 1), top: suma(d.raiz.y, d.raiz.alto), width: u(3), height: `calc(${uy(d.barraY)} - ${suma(d.raiz.y, d.raiz.alto)})` }}
            />
            <div
              className="linea-x absolute bg-tinta"
              style={{ left: ux(centro(primero) - 1), top: uy(d.barraY), width: ux(centro(ultimo) - centro(primero) + 3), height: u(3), animationDelay: ".15s" }}
            />
            <i
              className="punto-baja absolute box-border rounded-full border-2 border-tinta bg-turquesa"
              style={{ left: ux(d.raiz.x + d.raiz.w / 2 - 6), top: suma(d.raiz.y, d.raiz.alto + 2), width: u(13), height: u(13) }}
            />
            {escritorio.carpetas.map((c, i) => (
              <span key={c.id}>
                <div
                  className="linea-y absolute bg-tinta"
                  style={{ left: ux(centro(c.id) - 1), top: uy(d.barraY), width: u(3), height: uy(d.carpetaY - d.barraY), animationDelay: ".3s" }}
                />
                <div
                  className="linea-y absolute bg-tinta"
                  style={{ left: ux(centro(c.id) - 1), top: suma(d.carpetaY, d.carpeta.alto), height: `calc(${uy(d.gente.y)} - ${suma(d.carpetaY, d.carpeta.alto)})`, width: u(3), animationDelay: ".75s" }}
                />
                <i
                  className="punto-baja absolute box-border rounded-full border-2 border-tinta bg-turquesa"
                  style={{ left: ux(centro(c.id) - 6), top: suma(d.carpetaY, d.carpeta.alto + 2), width: u(13), height: u(13), animationDelay: `${0.9 + i * 0.15}s` }}
                />
              </span>
            ))}
          </div>
          <ul className="m-0 list-none p-0" aria-label="Quién participa en cada área">
            {escritorio.carpetas.flatMap((c, i) =>
              c.gente.map((nombre, j) => (
                <li
                  key={`${c.id}-${nombre}`}
                  className="abre absolute z-20 box-border flex items-center rounded-[4px] border-2 border-tinta bg-blanco leading-[1.1] font-extrabold"
                  style={{
                    left: centrado(centro(c.id), d.gente.w),
                    top: uy(d.gente.y + j * d.gente.dy),
                    width: u(d.gente.w),
                    minHeight: u(d.gente.letra * 2.7),
                    gap: u(d.gente.letra / 2),
                    padding: `${u(d.gente.letra / 2.5)} ${u(d.gente.letra / 1.6)}`,
                    fontSize: u(d.gente.letra),
                    animationDelay: `${0.85 + i * 0.1 + j * 0.12}s`,
                  }}
                >
                  <svg viewBox="0 0 24 24" style={{ width: u(d.gente.letra * 1.3), height: u(d.gente.letra * 1.3) }} className="shrink-0" aria-hidden>
                    <circle cx="12" cy="8" r="4" fill={j === 0 ? "#48c9b0" : "#fff"} stroke="#1d1e20" strokeWidth="2" />
                    <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6z" fill={j === 0 ? "#48c9b0" : "#fff"} stroke="#1d1e20" strokeWidth="2" strokeLinejoin="round" />
                  </svg>
                  {nombre}
                </li>
              )),
            )}
          </ul>
          <p
            className="abre absolute z-20 m-0 box-border flex items-center rounded-[4px] bg-tinta font-bold text-blanco"
            style={{
              left: ux(d.lema.x),
              top: uy(d.lema.y),
              width: ux(d.lema.w),
              gap: u(12),
              padding: `${u(d.lema.letra * 0.8)} ${u(d.lema.letra)}`,
              fontSize: u(d.lema.letra),
              animationDelay: "1.5s",
            }}
          >
            <Robot />
            {escritorio.arbolLema}
          </p>
        </>
      )}

      {/* Carpetas */}
      {escritorio.carpetas.map((c, i) => {
        const p = pos[c.id];
        const destino = donde(c.id);
        const caos = d.caos[c.id];
        const x = destino ? destino.x : (p?.x ?? caos.x);
        const y = destino ? destino.y : (p?.y ?? caos.y);
        const cuenta = escritorio.archivos.filter((f) => f.carpeta === c.id).length;
        const retraso = paso === 2 && arbolAbierto ? i * 90 : 0;
        return (
          <button
            key={c.id}
            type="button"
            tabIndex={paso === 0 ? 0 : -1}
            aria-hidden={paso !== 0 || undefined}
            aria-label={`Carpeta ${c.nombre}`}
            onPointerDown={(e) => bajar(e, c.id, x, y)}
            onClick={(e) => picar(e, c.id)}
            className="cosa mov absolute flex flex-col items-center border-0 bg-transparent"
            style={{
              left: ux(enApp ? d.enApp.x : x),
              top: uy(enApp ? d.enApp.y + i * d.enApp.dy : y),
              width: u(d.carpeta.w),
              padding: u(4),
              gap: u(d.carpeta.etiqueta / 2.4),
              transform: `rotate(${paso === 0 ? caos.r : 0}deg) scale(${enApp ? 0.4 : juntas ? 0.5 : 1})`,
              opacity: enApp || juntas ? 0 : 1,
              zIndex: z[c.id] ?? 20,
              pointerEvents: paso === 0 ? "auto" : "none",
              touchAction: cel ? "pan-y" : "none",
              transition: transicion(arrastrando === c.id, retraso),
            }}
          >
            <span className="relative block transition-transform duration-150 hover:-translate-y-[3px]">
              <IconoCarpeta ancho={d.carpeta.icono} />
              {paso >= 1 && (
                <span
                  className="asoma absolute box-border grid place-items-center rounded-full border-2 border-tinta bg-blanco font-extrabold text-tinta"
                  style={{ right: u(-8), top: u(-6), minWidth: u(24), height: u(24), padding: `0 ${u(5)}`, fontSize: u(12) }}
                >
                  {cuenta}
                </span>
              )}
            </span>
            <span className="bg-tinta font-extrabold text-blanco" style={{ padding: `${u(2)} ${u(6)}`, fontSize: u(d.carpeta.etiqueta) }}>
              {c.nombre}
            </span>
          </button>
        );
      })}

      {/* Archivos regados */}
      {escritorio.archivos.map((f, i) => {
        const p = pos[f.id];
        const destino = donde(f.carpeta);
        const caos = d.caos[f.id];
        const x0 = p?.x ?? caos.x;
        const y0 = p?.y ?? caos.y;
        const [banda, letra] = BANDA[f.tipo] ?? ["#ffffff", "#1d1e20"];
        const retraso = paso >= 1 ? i * 70 : 0;
        const kn = d.archivo.notaW / 136;
        return (
          <button
            key={f.id}
            type="button"
            tabIndex={paso === 0 ? 0 : -1}
            aria-hidden={paso !== 0 || undefined}
            aria-label={f.tipo === "NOTA" ? `Nota: ${f.nombre}` : `Archivo ${f.nombre}`}
            onPointerDown={(e) => bajar(e, f.id, x0, y0)}
            onClick={(e) => picar(e, f.id)}
            className="cosa mov group absolute flex flex-col items-center border-0 bg-transparent"
            style={{
              left: ux(destino ? destino.x + d.carpeta.w * 0.08 : x0),
              top: uy(destino ? destino.y + 4 : y0),
              width: u(d.archivo.w),
              padding: u(4),
              gap: u(d.archivo.etiqueta / 2),
              transform: `rotate(${destino ? 0 : caos.r}deg) scale(${destino ? 0.25 : 1})`,
              opacity: destino ? 0 : 1,
              zIndex: z[f.id] ?? 25,
              pointerEvents: paso === 0 ? "auto" : "none",
              touchAction: cel ? "pan-y" : "none",
              transition: transicion(arrastrando === f.id, retraso, 450),
            }}
          >
            {f.tipo === "NOTA" ? (
              <span
                className="block box-border border-2 border-tinta bg-blanco text-left leading-[1.1] font-extrabold text-tinta shadow-[4px_4px_0_var(--color-tinta)] transition-transform duration-150 group-hover:-translate-y-[3px]"
                style={{ width: u(d.archivo.notaW), padding: `0 ${u(12 * kn)} ${u(18 * kn)}`, fontSize: u(d.archivo.notaLetra) }}
              >
                <span className="block border-b-2 border-tinta bg-turquesa" style={{ height: u(8 * kn), margin: `0 ${u(-12 * kn)} ${u(10 * kn)}` }} />
                {f.nombre}
              </span>
            ) : (
              <>
                <svg
                  viewBox="0 0 60 72"
                  className="transition-transform duration-150 group-hover:-translate-y-[3px]"
                  style={{ width: u(d.archivo.icono), height: u((d.archivo.icono * 72) / 60) }}
                  aria-hidden
                >
                  <path d="M4 3h36l16 16v50H4z" fill="#fff" stroke="#1d1e20" strokeWidth="3" strokeLinejoin="round" />
                  <path d="M40 3v16h16" fill="none" stroke="#1d1e20" strokeWidth="3" strokeLinejoin="round" />
                  <path d="M12 22h18M12 30h26" stroke="#1d1e20" strokeWidth="2.5" strokeLinecap="round" />
                  <rect x="4" y="42" width="52" height="18" fill={banda} stroke="#1d1e20" strokeWidth="3" />
                  <text x="30" y="55.5" textAnchor="middle" fontSize="11" fontWeight="800" fill={letra} fontFamily="var(--font-sans)">
                    {f.tipo}
                  </text>
                </svg>
                <span
                  className="bg-tinta leading-[1.3] font-bold break-words text-blanco"
                  style={{ maxWidth: u(d.archivo.w - 4), padding: `${u(2)} ${u(5)}`, fontSize: u(d.archivo.etiqueta) }}
                >
                  {f.nombre}
                </span>
              </>
            )}
          </button>
        );
      })}

      {/* Alerta al picar un archivo */}
      {laAlerta && (
        <section
          role="dialog"
          aria-labelledby={`alerta-titulo-${modo}`}
          aria-describedby={`alerta-duda-${modo}`}
          className="abre absolute z-[80] rounded-[4px] border-2 border-tinta bg-blanco shadow-[5px_5px_0_var(--color-tinta)]"
          style={{ left: ux(d.alerta.x), top: uy(d.alerta.y), width: u(d.alerta.w) }}
        >
          <div className="relative border-b-2 border-tinta bg-violeta" style={{ height: u(30) }}>
            <span
              id={`alerta-titulo-${modo}`}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-marca whitespace-nowrap text-blanco italic"
              style={{ fontSize: u(13) }}
            >
              alerta.exe
            </span>
            <button
              type="button"
              onClick={cerrarAlerta}
              aria-label="Cerrar ventana"
              className="absolute cursor-pointer border-2 border-tinta bg-blanco p-0 active:bg-tinta"
              style={{ left: ux(8), top: u(3), width: u(20), height: u(20) }}
            />
          </div>
          <div className="flex" style={{ gap: u(14), padding: `${u(16)} ${u(16)} ${u(6)}` }}>
            <span
              aria-hidden
              className="grid shrink-0 place-items-center rounded-full border-2 border-tinta bg-turquesa font-extrabold"
              style={{ width: u(44), height: u(44), fontSize: u(26) }}
            >
              ?
            </span>
            <div className="flex flex-col" style={{ gap: u(6) }}>
              <strong className="break-words" style={{ fontSize: u(15) }}>
                {laAlerta.nombre}
              </strong>
              <span id={`alerta-duda-${modo}`} className="leading-[1.35]" style={{ fontSize: u(17) }}>
                {laAlerta.duda}
              </span>
            </div>
          </div>
          <div className="flex justify-end" style={{ gap: u(10), padding: `${u(12)} ${u(16)} ${u(16)}` }}>
            <button ref={niIdea} type="button" onClick={cerrarAlerta} className="btn bg-blanco text-tinta" style={{ minHeight: 44, fontSize: u(15), paddingInline: u(14) }}>
              Ni idea
            </button>
            <button type="button" onClick={empezar} className="btn bg-turquesa text-tinta" style={{ minHeight: 44, fontSize: u(15), paddingInline: u(14) }}>
              Ordénalo por mí
            </button>
          </div>
        </section>
      )}

      {/* Paso 3: todo se vuelve una app */}
      {enApp && (
        <section
          aria-label="Tu negocio en una app"
          className="abre absolute z-50 overflow-hidden rounded-[4px] border-2 border-tinta bg-blanco shadow-[6px_6px_0_var(--color-tinta)]"
          style={{ left: ux(d.app.x), top: uy(d.app.y), width: ux(d.app.w), maxHeight: cel ? "calc(100% - 56px)" : undefined }}
        >
          <div className="relative border-b-2 border-tinta bg-violeta" style={{ height: u(30) }}>
            <span
              aria-hidden
              className="absolute box-border border-2 border-tinta bg-blanco"
              style={{ left: ux(8), top: u(3), width: u(20), height: u(20) }}
            />
            <span
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-marca whitespace-nowrap text-blanco italic"
              style={{ fontSize: u(14) }}
            >
              tu-negocio.app
            </span>
          </div>
          <div className={d.app.lateral ? "flex" : "flex flex-col"} style={d.app.lateral ? { minHeight: u(470) } : undefined}>
            <nav
              aria-label="Módulos"
              className={d.app.lateral ? "flex shrink-0 flex-col border-r-2 border-tinta" : "grid grid-cols-4 border-b-2 border-tinta"}
              style={d.app.lateral ? { width: u(170), gap: u(8), padding: `${u(14)} ${u(12)}` } : { gap: u(6), padding: u(8) }}
            >
              {escritorio.carpetas.map((c) => {
                const activo = modulo === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setModulo(c.id)}
                    aria-pressed={activo}
                    className={`flex cursor-pointer items-center rounded-[4px] border-2 border-tinta font-extrabold text-tinta ${
                      d.app.lateral ? "text-left" : "justify-center"
                    } ${activo ? "bg-turquesa" : "bg-blanco shadow-[0_3px_0_var(--color-tinta)]"}`}
                    style={{ minHeight: d.app.lateral ? 44 : 40, gap: u(8), paddingInline: u(d.app.lateral ? 10 : 2), fontSize: u(d.app.lateral ? 15 : 12) }}
                  >
                    {d.app.lateral && <IconoCarpeta ancho={22} relleno="#fff" trazo={6} />}
                    {c.nombre}
                  </button>
                );
              })}
            </nav>
            <div
              className="flex min-w-0 flex-1 flex-col"
              style={d.app.lateral ? { gap: u(14), padding: `${u(20)} ${u(22)}` } : { gap: u(8), padding: `${u(12)} ${u(12)}` }}
            >
              <div className="flex items-baseline justify-between" style={{ gap: u(12) }}>
                <h2 className="m-0 leading-[1.05] font-extrabold tracking-[-0.03em]" style={{ fontSize: u(d.app.lateral ? 26 : 20) }}>
                  {mod.titulo}
                </h2>
                <span className="text-tinta/70" style={{ fontSize: u(11) }}>
                  Datos de ejemplo
                </span>
              </div>
              <ul className="m-0 flex list-none flex-col p-0" style={{ gap: u(d.app.lateral ? 8 : 6) }}>
                {mod.filas.map((fila) => (
                  <li
                    key={`${modulo}-${fila.texto}`}
                    className="asoma flex items-center justify-between rounded-[4px] border-2 border-tinta font-semibold"
                    style={{ gap: u(8), padding: d.app.lateral ? `${u(12)} ${u(14)}` : `${u(6)} ${u(10)}`, fontSize: u(d.app.lateral ? 16 : 13) }}
                  >
                    <span>{fila.texto}</span>
                    <span
                      className={`shrink-0 rounded-full border-2 border-tinta font-extrabold ${TONO[fila.tono]}`}
                      style={{ padding: `${u(2)} ${u(8)}`, fontSize: u(d.app.lateral ? 12 : 10.5) }}
                    >
                      {fila.estado}
                    </span>
                  </li>
                ))}
              </ul>
              <p
                className="m-0 flex items-center rounded-[4px] bg-tinta font-bold text-blanco"
                style={{ gap: u(10), padding: d.app.lateral ? `${u(12)} ${u(14)}` : `${u(6)} ${u(10)}`, fontSize: u(d.app.lateral ? 15 : 12.5) }}
              >
                <Robot />
                {mod.auto}
              </p>
            </div>
          </div>
          {d.app.lateral && (
            <div className="flex justify-between border-t-2 border-tinta bg-turquesa font-extrabold" style={{ padding: `${u(4)} ${u(10)}`, fontSize: u(11) }}>
              <span>4 áreas, un solo lugar</span>
              <span>en línea</span>
            </div>
          )}
        </section>
      )}

      {/* Pasos (después de Despegar) o la pista (en celular, antes) */}
      {paso > 0 ? (
        <div
          role="group"
          aria-label="Pasos"
          className="asoma absolute z-40 flex justify-center"
          style={cel ? { left: 0, right: 0, bottom: 2, gap: 8 } : { left: ux(d.pasos.x), top: uy(d.pasos.y), width: ux(d.pasos.w), gap: u(10) }}
        >
          {PASOS.map((p) => (
            <button
              key={p.n}
              type="button"
              onClick={() => irPaso(p.n)}
              aria-pressed={paso === p.n}
              className={`cursor-pointer rounded-full border-2 border-tinta font-extrabold text-tinta ${
                paso === p.n ? "bg-turquesa" : "bg-blanco"
              }`}
              style={cel ? { minHeight: 44, paddingInline: 14, fontSize: 14 } : { minHeight: 44, paddingInline: u(16), fontSize: u(15) }}
            >
              {p.etiqueta}
            </button>
          ))}
        </div>
      ) : (
        cel && (
          <p
            className="absolute z-10 m-0 flex items-center justify-center font-semibold text-tinta/75"
            style={{ left: ux(d.pasos.x), top: uy(d.pasos.y + 16), width: ux(d.pasos.w), gap: u(6), fontSize: u(13) }}
          >
            <Pista tam={u(15)} corta />
          </p>
        )
      )}
    </>
  );

  const eventosEscenario = {
    onPointerMove: mover,
    onPointerUp: soltar,
    onPointerCancel: cancelar,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Escape" && laAlerta) cerrarAlerta();
    },
  };

  if (cel) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex shrink-0 flex-col gap-[min(12px,1.4svh)] px-4">
          {titular}
          <p className="m-0 text-[clamp(14px,2.2svh,17px)] leading-[1.2] font-semibold">{hero.subtitulo}</p>
        </div>
        <div className="relative min-h-0 flex-1 [container-type:size]">
          <div
            ref={escenario}
            className="absolute inset-0"
            style={
              {
                "--x": `calc(100cqw / ${d.ancho})`,
                "--v": `calc(100cqh / ${d.alto})`,
                "--u": `min(calc(100cqw / ${d.ancho}), calc(100cqh / ${d.alto}))`,
              } as CSSProperties
            }
            {...eventosEscenario}
          >
            {escenarioContenido}
          </div>
        </div>
        <div className="flex shrink-0 gap-2.5 px-4 pt-2">
          {botonHablemos({ gap: 8, paddingInline: 10, marginBottom: 5 }, "flex-1 whitespace-nowrap text-[clamp(14px,4.3vw,16px)]")}
          {botonDespegar({ paddingInline: 10, marginBottom: 5 }, "flex-1 whitespace-nowrap text-[clamp(14px,4.3vw,16px)]")}
        </div>
      </div>
    );
  }

  return (
    <div ref={escenario} className="relative mx-auto" style={{ width: u(d.ancho), height: u(d.alto) }} {...eventosEscenario}>
      {/* Titular */}
      <div className="absolute z-40 flex flex-col" style={{ left: ux(96), top: u(70), width: u(620), gap: u(26) }}>
        {titular}
        <p className="m-0 leading-[1.2] font-semibold" style={{ fontSize: u(25), maxWidth: u(540) }}>
          {hero.subtitulo}
        </p>
        <div className="flex items-center" style={{ gap: u(14) }}>
          {botonHablemos({ minHeight: u(56), fontSize: u(18), paddingInline: u(24), gap: u(10) })}
          {botonDespegar({ minHeight: u(56), fontSize: u(18), paddingInline: u(22) })}
        </div>
        {paso === 0 && (
          <p className="m-0 flex items-center font-semibold text-tinta/75" style={{ gap: u(8), fontSize: u(15) }}>
            <Pista tam={u(18)} />
          </p>
        )}
      </div>
      {escenarioContenido}
    </div>
  );
}
