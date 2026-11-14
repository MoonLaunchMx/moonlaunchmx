"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as EventoPuntero } from "react";
import { abrirAgenda } from "@/components/Agenda";
import { agenda, escritorio, hero } from "@/lib/site";

/**
 * Hero de escritorio "la compu de tu negocio" (aprobado 13 nov 2026).
 * Paso 0: archivos regados que se arrastran y se pican. "Ver lo que hacemos" corre:
 * 1 Ordena (cada archivo a su carpeta), 2 Automatiza (árbol de áreas y su gente), 3 Despega (tu-negocio.app).
 * Todo se mide en px de un diseño de 1440: --u vale 1px a 1440 de ancho o más y se encoge con la pantalla.
 */

type Paso = 0 | 1 | 2 | 3;
type Punto = { x: number; y: number };
type Carpeta = (typeof escritorio.carpetas)[number];
type ModuloId = keyof typeof escritorio.modulos;

const u = (n: number) => `calc(var(--u) * ${n})`;
const EASE = "cubic-bezier(.2,.9,.2,1)";
const RAIZ: Punto = { x: 998, y: 8 };
const ANCHO = 1440;
const ALTO = 780;

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

export default function Escritorio() {
  const escenario = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const arrastre = useRef<{ id: string; sx: number; sy: number; ox: number; oy: number; k: number; movido: boolean } | null>(null);
  const seMovio = useRef(false);
  const zTop = useRef(30);
  const origenAlerta = useRef<HTMLButtonElement | null>(null);
  const niIdea = useRef<HTMLButtonElement>(null);

  const [paso, setPaso] = useState<Paso>(0);
  const [arbolAbierto, setArbolAbierto] = useState(false);
  const [pos, setPos] = useState<Record<string, Punto>>({});
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
    e.currentTarget.setPointerCapture(e.pointerId);
    const k = escenario.current!.getBoundingClientRect().width / ANCHO;
    arrastre.current = { id, sx: e.clientX, sy: e.clientY, ox: x, oy: y, k, movido: false };
    const nz = ++zTop.current;
    setZ((prev) => ({ ...prev, [id]: nz }));
  }
  function mover(e: EventoPuntero<HTMLDivElement>) {
    const d = arrastre.current;
    if (!d) return;
    const dx = (e.clientX - d.sx) / d.k;
    const dy = (e.clientY - d.sy) / d.k;
    if (!d.movido && Math.abs(dx) + Math.abs(dy) < 5) return;
    d.movido = true;
    setArrastrando(d.id);
    setPos((prev) => ({
      ...prev,
      [d.id]: { x: Math.max(0, Math.min(ANCHO - 130, d.ox + dx)), y: Math.max(0, Math.min(ALTO - 110, d.oy + dy)) },
    }));
  }
  function soltar() {
    const d = arrastre.current;
    if (!d) return;
    arrastre.current = null;
    seMovio.current = d.movido;
    setArrastrando(null);
  }
  // Un clic sin arrastre (o Enter/Espacio con teclado) abre la duda del archivo.
  function picar(e: React.MouseEvent<HTMLButtonElement>, id: string) {
    if (seMovio.current) {
      seMovio.current = false;
      return;
    }
    origenAlerta.current = e.currentTarget;
    setAlerta(id);
  }

  const donde = (c: Carpeta): Punto | null => {
    if (paso === 1) return c.orden;
    if (paso === 2 && !arbolAbierto) return RAIZ;
    if (paso >= 2) return c.arbol;
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

  const palabra = (n: number) => {
    const activa = paso === n;
    return `inline-block -ml-[0.1em] px-[0.1em] transition-colors duration-300 ${
      activa ? "bg-turquesa text-tinta" : n === 3 ? "text-violeta" : "text-tinta"
    }`;
  };

  return (
    <div
      ref={escenario}
      className="relative mx-auto"
      style={{ width: u(ANCHO), height: u(ALTO) } as CSSProperties}
      onPointerMove={mover}
      onPointerUp={soltar}
      onPointerCancel={soltar}
      onKeyDown={(e) => {
        if (e.key === "Escape" && laAlerta) cerrarAlerta();
      }}
    >
      {/* Titular */}
      <div className="absolute z-40 flex flex-col" style={{ left: u(96), top: u(70), width: u(620), gap: u(26) }}>
        <h1 className="m-0 font-extrabold tracking-[-0.045em]" style={{ fontSize: u(104), lineHeight: 0.92 }}>
          {hero.titular.map((t, i) => (
            <span key={t}>
              <span className={palabra(i + 1)}>{t}</span>
              {i < 2 && <br />}
            </span>
          ))}
        </h1>
        <p className="m-0 leading-[1.2] font-semibold" style={{ fontSize: u(25), maxWidth: u(540) }}>
          {hero.subtitulo}
        </p>
        <div className="flex items-center" style={{ gap: u(14) }}>
          <button
            type="button"
            onClick={abrirAgenda}
            aria-haspopup="dialog"
            className="btn bg-violeta text-blanco"
            style={{ minHeight: u(56), fontSize: u(18), paddingInline: u(24), gap: u(10) }}
          >
            <svg viewBox="0 0 24 24" style={{ width: u(20), height: u(20) }} aria-hidden>
              <rect x="3" y="5" width="18" height="16" rx="2" fill="#fff" stroke="#1d1e20" strokeWidth="2" />
              <path d="M3 10h18M8 3v4M16 3v4" stroke="#1d1e20" strokeWidth="2" strokeLinecap="round" />
              <rect x="13" y="13" width="4" height="4" fill="#48c9b0" stroke="#1d1e20" strokeWidth="1.5" />
            </svg>
            {agenda.boton}
          </button>
          <button
            type="button"
            onClick={paso === 0 ? empezar : volver}
            className="btn bg-blanco text-tinta"
            style={{ minHeight: u(56), fontSize: u(18), paddingInline: u(22) }}
          >
            {paso === 0 ? "Despegar" : "Volver al caos"}
          </button>
        </div>
        {paso === 0 && (
          <p className="m-0 flex items-center font-semibold text-tinta/75" style={{ gap: u(8), fontSize: u(15) }}>
            <svg viewBox="0 0 24 24" style={{ width: u(18), height: u(18) }} aria-hidden>
              <path d="M8 3v11l3-3 2.5 6 2.5-1-2.5-6H18z" fill="#48c9b0" stroke="#1d1e20" strokeWidth="1.8" strokeLinejoin="round" />
            </svg>
            Arrastra y pica los archivos. Así se ve la compu de muchos negocios.
          </p>
        )}
      </div>

      {/* Pasos: del lado derecho, debajo de la animación */}
      {paso > 0 && (
        <div
          role="group"
          aria-label="Pasos"
          className="asoma absolute z-40 flex justify-center"
          style={{ left: u(760), top: u(600), width: u(600), gap: u(10) }}
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
              style={{ minHeight: 44, paddingInline: u(16), fontSize: u(15) }}
            >
              {p.etiqueta}
            </button>
          ))}
        </div>
      )}

      {/* Paso 2: "Tu negocio" se divide en 4 áreas y de cada una sale su gente */}
      {paso === 2 && (
        <section
          aria-label="Tu negocio"
          className="abre absolute z-30 rounded-[4px] border-2 border-tinta bg-blanco shadow-[4px_4px_0_var(--color-tinta)]"
          style={{ left: u(960), top: u(RAIZ.y), width: u(200) }}
        >
          <div
            className="flex items-center justify-center border-b-2 border-tinta bg-violeta font-marca text-blanco italic"
            style={{ height: u(22), fontSize: u(11) }}
          >
            tu-negocio
          </div>
          <div className="text-center font-extrabold tracking-[-0.02em]" style={{ padding: u(10), fontSize: u(19) }}>
            Tu negocio
          </div>
        </section>
      )}
      {paso === 2 && arbolAbierto && (
        <>
          <div aria-hidden>
            <div className="linea-y absolute bg-tinta" style={{ left: u(1059), top: u(84), width: u(3), height: u(36) }} />
            <div className="linea-x absolute bg-tinta" style={{ left: u(820), top: u(120), width: u(483), height: u(3), animationDelay: ".15s" }} />
            <i
              className="punto-baja absolute box-border rounded-full border-2 border-tinta bg-turquesa"
              style={{ left: u(1054), top: u(86), width: u(13), height: u(13) }}
            />
            {escritorio.carpetas.map((c, i) => (
              <span key={c.id}>
                <div className="linea-y absolute bg-tinta" style={{ left: u(c.arbol.x + 61), top: u(120), width: u(3), height: u(34), animationDelay: ".3s" }} />
                <div className="linea-y absolute bg-tinta" style={{ left: u(c.arbol.x + 61), top: u(258), width: u(3), height: u(32), animationDelay: ".75s" }} />
                <i
                  className="punto-baja absolute box-border rounded-full border-2 border-tinta bg-turquesa"
                  style={{ left: u(c.arbol.x + 56), top: u(260), width: u(13), height: u(13), animationDelay: `${0.9 + i * 0.15}s` }}
                />
              </span>
            ))}
          </div>
          <ul className="m-0 list-none p-0" aria-label="Quién participa en cada área">
            {escritorio.carpetas.flatMap((c, i) =>
              c.gente.map((nombre, j) => (
                <li
                  key={`${c.id}-${nombre}`}
                  className="abre absolute z-20 box-border flex items-center rounded-[4px] border-2 border-tinta bg-blanco font-extrabold"
                  style={{
                    left: u(c.arbol.x - 9),
                    top: u(292 + j * 50),
                    width: u(142),
                    minHeight: u(40),
                    gap: u(7),
                    padding: `${u(6)} ${u(9)}`,
                    fontSize: u(14),
                    animationDelay: `${0.85 + i * 0.1 + j * 0.12}s`,
                  }}
                >
                  <svg viewBox="0 0 24 24" style={{ width: u(18), height: u(18) }} className="shrink-0" aria-hidden>
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
            style={{ left: u(750), top: u(420), width: u(622), gap: u(12), padding: `${u(14)} ${u(16)}`, fontSize: u(17), animationDelay: "1.5s" }}
          >
            <Robot />
            {escritorio.arbolLema}
          </p>
        </>
      )}

      {/* Carpetas */}
      {escritorio.carpetas.map((c, i) => {
        const p = pos[c.id];
        const destino = donde(c);
        const x = destino ? destino.x : (p?.x ?? c.caos.x);
        const y = destino ? destino.y : (p?.y ?? c.caos.y);
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
              left: u(enApp ? 760 : x),
              top: u(enApp ? 100 + i * 56 : y),
              width: u(124),
              padding: u(4),
              gap: u(6),
              transform: `rotate(${paso === 0 ? c.caos.r : 0}deg) scale(${enApp ? 0.4 : juntas ? 0.5 : 1})`,
              opacity: enApp || juntas ? 0 : 1,
              zIndex: z[c.id] ?? 20,
              pointerEvents: paso === 0 ? "auto" : "none",
              transition: transicion(arrastrando === c.id, retraso),
            }}
          >
            <span className="relative block transition-transform duration-150 hover:-translate-y-[3px]">
              <IconoCarpeta ancho={80} />
              {paso >= 1 && (
                <span
                  className="asoma absolute box-border grid place-items-center rounded-full border-2 border-tinta bg-blanco font-extrabold text-tinta"
                  style={{ right: u(-8), top: u(-6), minWidth: u(26), height: u(26), padding: `0 ${u(6)}`, fontSize: u(13) }}
                >
                  {cuenta}
                </span>
              )}
            </span>
            <span className="bg-tinta font-extrabold text-blanco" style={{ padding: `${u(2)} ${u(6)}`, fontSize: u(14) }}>
              {c.nombre}
            </span>
          </button>
        );
      })}

      {/* Archivos regados */}
      {escritorio.archivos.map((f, i) => {
        const p = pos[f.id];
        const c = escritorio.carpetas.find((k) => k.id === f.carpeta)!;
        const destino = donde(c);
        const x0 = p?.x ?? f.x;
        const y0 = p?.y ?? f.y;
        const [banda, letra] = BANDA[f.tipo] ?? ["#ffffff", "#1d1e20"];
        const retraso = paso >= 1 ? i * 70 : 0;
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
              left: u(destino ? destino.x + 10 : x0),
              top: u(destino ? destino.y + 4 : y0),
              width: u(132),
              padding: u(4),
              gap: u(6),
              transform: `rotate(${destino ? 0 : f.r}deg) scale(${destino ? 0.25 : 1})`,
              opacity: destino ? 0 : 1,
              zIndex: z[f.id] ?? 25,
              pointerEvents: paso === 0 ? "auto" : "none",
              transition: transicion(arrastrando === f.id, retraso, 450),
            }}
          >
            {f.tipo === "NOTA" ? (
              <span
                className="block box-border border-2 border-tinta bg-blanco text-left leading-[1.1] font-extrabold text-tinta shadow-[4px_4px_0_var(--color-tinta)] transition-transform duration-150 group-hover:-translate-y-[3px]"
                style={{ width: u(136), padding: `0 ${u(12)} ${u(18)}`, fontSize: u(19) }}
              >
                <span className="block border-b-2 border-tinta bg-turquesa" style={{ height: u(8), margin: `0 ${u(-12)} ${u(10)}` }} />
                {f.nombre}
              </span>
            ) : (
              <>
                <svg
                  viewBox="0 0 60 72"
                  className="transition-transform duration-150 group-hover:-translate-y-[3px]"
                  style={{ width: u(60), height: u(72) }}
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
                  style={{ maxWidth: u(128), padding: `${u(2)} ${u(6)}`, fontSize: u(12) }}
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
          aria-labelledby="alerta-titulo"
          aria-describedby="alerta-duda"
          className="abre absolute z-[80] rounded-[4px] border-2 border-tinta bg-blanco shadow-[5px_5px_0_var(--color-tinta)]"
          style={{ left: u(820), top: u(200), width: u(400) }}
        >
          <div className="relative border-b-2 border-tinta bg-violeta" style={{ height: u(30) }}>
            <button
              type="button"
              onClick={cerrarAlerta}
              aria-label="Cerrar ventana"
              className="absolute cursor-pointer border-2 border-tinta bg-blanco p-0 active:bg-tinta"
              style={{ left: u(8), top: u(3), width: u(20), height: u(20) }}
            />
            <span
              id="alerta-titulo"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-marca whitespace-nowrap text-blanco italic"
              style={{ fontSize: u(13) }}
            >
              alerta.exe
            </span>
          </div>
          <div className="flex" style={{ gap: u(14), padding: `${u(18)} ${u(18)} ${u(8)}` }}>
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
              <span id="alerta-duda" className="leading-[1.35]" style={{ fontSize: u(17) }}>
                {laAlerta.duda}
              </span>
            </div>
          </div>
          <div className="flex justify-end" style={{ gap: u(10), padding: `${u(12)} ${u(18)} ${u(18)}` }}>
            <button ref={niIdea} type="button" onClick={cerrarAlerta} className="btn bg-blanco text-tinta" style={{ minHeight: 44, fontSize: u(15) }}>
              Ni idea
            </button>
            <button type="button" onClick={empezar} className="btn bg-turquesa text-tinta" style={{ minHeight: 44, fontSize: u(15) }}>
              Ordénalo por mí
            </button>
          </div>
        </section>
      )}

      {/* Paso 3: todo se vuelve una app */}
      {enApp && (
        <section
          aria-label="Tu negocio en una app"
          className="abre absolute z-50 rounded-[4px] border-2 border-tinta bg-blanco shadow-[6px_6px_0_var(--color-tinta)]"
          style={{ left: u(760), top: u(30), width: u(600) }}
        >
          <div className="relative border-b-2 border-tinta bg-violeta" style={{ height: u(32) }}>
            <span
              aria-hidden
              className="absolute box-border border-2 border-tinta bg-blanco"
              style={{ left: u(8), top: u(4), width: u(20), height: u(20) }}
            />
            <span
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-marca whitespace-nowrap text-blanco italic"
              style={{ fontSize: u(14) }}
            >
              tu-negocio.app
            </span>
          </div>
          <div className="flex" style={{ minHeight: u(470) }}>
            <nav aria-label="Módulos" className="flex shrink-0 flex-col border-r-2 border-tinta" style={{ width: u(170), gap: u(8), padding: `${u(14)} ${u(12)}` }}>
              {escritorio.carpetas.map((c) => {
                const activo = modulo === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setModulo(c.id)}
                    aria-pressed={activo}
                    className={`flex cursor-pointer items-center rounded-[4px] border-2 border-tinta text-left font-extrabold text-tinta ${
                      activo ? "bg-turquesa" : "bg-blanco shadow-[0_3px_0_var(--color-tinta)]"
                    }`}
                    style={{ minHeight: 44, gap: u(8), paddingInline: u(10), fontSize: u(15) }}
                  >
                    <IconoCarpeta ancho={22} relleno="#fff" trazo={6} />
                    {c.nombre}
                  </button>
                );
              })}
            </nav>
            <div className="flex min-w-0 flex-1 flex-col" style={{ gap: u(14), padding: `${u(20)} ${u(22)}` }}>
              <div className="flex items-baseline justify-between" style={{ gap: u(12) }}>
                <h2 className="m-0 leading-[1.05] font-extrabold tracking-[-0.03em]" style={{ fontSize: u(26) }}>
                  {mod.titulo}
                </h2>
                <span className="text-tinta/70" style={{ fontSize: u(12) }}>
                  Datos de ejemplo
                </span>
              </div>
              <ul className="m-0 flex list-none flex-col p-0" style={{ gap: u(8) }}>
                {mod.filas.map((fila) => (
                  <li
                    key={`${modulo}-${fila.texto}`}
                    className="asoma flex items-center justify-between rounded-[4px] border-2 border-tinta font-semibold"
                    style={{ gap: u(10), padding: `${u(12)} ${u(14)}`, fontSize: u(16) }}
                  >
                    <span>{fila.texto}</span>
                    <span
                      className={`shrink-0 rounded-full border-2 border-tinta font-extrabold ${TONO[fila.tono]}`}
                      style={{ padding: `${u(3)} ${u(9)}`, fontSize: u(12) }}
                    >
                      {fila.estado}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="m-0 flex items-center rounded-[4px] bg-tinta font-bold text-blanco" style={{ gap: u(10), padding: `${u(12)} ${u(14)}`, fontSize: u(15) }}>
                <Robot />
                {mod.auto}
              </p>
            </div>
          </div>
          <div className="flex justify-between border-t-2 border-tinta bg-turquesa font-extrabold" style={{ padding: `${u(5)} ${u(10)}`, fontSize: u(12) }}>
            <span>4 áreas, un solo lugar</span>
            <span>en línea</span>
          </div>
        </section>
      )}
    </div>
  );
}
