"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as PE } from "react";
import { calculadora, diagnostico, linkWhatsApp } from "@/lib/site";

const { personas: P, horas: H, costo: C } = calculadora;
const pesos = (n: number) => `$${Math.round(n).toLocaleString("es-MX")}`;
const relleno = (v: number, min: number, max: number) => ({ "--p": `${((v - min) / (max - min)) * 100}%` }) as CSSProperties;
const pregunta = "flex items-baseline justify-between gap-3 text-[17px] font-extrabold";

function reducirMovimiento() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Número que cuenta hacia el valor nuevo, como contador. */
function useContador(objetivo: number) {
  const [mostrado, setMostrado] = useState(objetivo);
  const actual = useRef(objetivo);
  useEffect(() => {
    const duracion = reducirMovimiento() ? 0 : 350;
    const desde = actual.current;
    const t0 = performance.now();
    let id = 0;
    const paso = (t: number) => {
      const k = duracion === 0 ? 1 : Math.min(1, (t - t0) / duracion);
      actual.current = desde + (objetivo - desde) * (1 - Math.pow(1 - k, 3));
      setMostrado(actual.current);
      if (k < 1) id = requestAnimationFrame(paso);
    };
    id = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(id);
  }, [objetivo]);
  return mostrado;
}

function Perilla({ valor, onCambio }: { valor: number; onCambio: (v: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const fijar = (v: number) => onCambio(Math.min(H.max, Math.max(H.min, Math.round(v / H.paso) * H.paso)));
  const desdePunto = (e: PE<HTMLDivElement>) => {
    const r = ref.current!.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    const angulo = Math.max(-135, Math.min(135, (Math.atan2(dx, -dy) * 180) / Math.PI));
    fijar(H.min + ((angulo + 135) / 270) * (H.max - H.min));
  };
  const angulo = -135 + ((valor - H.min) / (H.max - H.min)) * 270;

  return (
    <div
      ref={ref}
      role="slider"
      tabIndex={0}
      aria-label="Horas al día, cada persona"
      aria-valuemin={H.min}
      aria-valuemax={H.max}
      aria-valuenow={valor}
      aria-valuetext={`${valor} horas`}
      className="perilla relative size-[116px] shrink-0 cursor-grab rounded-full border-2 border-tinta active:cursor-grabbing"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        desdePunto(e);
      }}
      onPointerMove={(e) => {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) desdePunto(e);
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowUp" || e.key === "ArrowRight") fijar(valor + H.paso);
        else if (e.key === "ArrowDown" || e.key === "ArrowLeft") fijar(valor - H.paso);
        else if (e.key === "Home") fijar(H.min);
        else if (e.key === "End") fijar(H.max);
        else return;
        e.preventDefault();
      }}
    >
      <div
        className="absolute inset-[14px] rounded-full border-2 border-tinta bg-blanco shadow-[0_4px_0_var(--color-tinta)]"
        style={{ transform: `rotate(${angulo}deg)` }}
      >
        <div className="absolute top-1.5 left-1/2 -ml-[5px] h-[26px] w-2.5 rounded-[3px] border-2 border-tinta bg-violeta" />
      </div>
    </div>
  );
}

function Monito() {
  return (
    <svg width="20" height="24" viewBox="0 0 20 24" className="brota" aria-hidden>
      <circle cx="10" cy="6" r="5" fill="#48c9b0" stroke="#1d1e20" strokeWidth="2" />
      <path d="M2 23c0-5 3.5-8 8-8s8 3 8 8z" fill="#683ee6" stroke="#1d1e20" strokeWidth="2" />
    </svg>
  );
}

/** "¿Cuánto te cuesta el caos?": cada pregunta se contesta distinto (botón, barra, perilla, barra). */
export default function CalculadoraCaos() {
  const [area, setArea] = useState(calculadora.areas[0]);
  const [personas, setPersonas] = useState(P.inicial);
  const [horas, setHoras] = useState(H.inicial);
  const [costo, setCosto] = useState(C.inicial);

  const horasMes = personas * horas * diagnostico.diasHabiles;
  const total = horasMes * costo;
  const mostrado = useContador(total);
  const masP = personas === P.max ? "+" : "";
  const masC = costo === C.max ? "+" : "";

  const mensaje = [
    "Hola Moon Launch, hice la calculadora del caos.",
    `Área: ${area.toLowerCase()}`,
    `${personas}${masP} personas, ${horas} h al día cada una, a $${costo}${masC} la hora.`,
    `Me sale en ${pesos(total)} al mes. Quiero agendar mi videollamada.`,
  ].join("\n");

  return (
    <div className="borde sombra flex flex-col gap-6 bg-blanco p-4">
      <fieldset className="m-0 flex flex-col gap-2.5 border-0 p-0">
        <legend className={`${pregunta} mb-2.5 p-0`}>¿Qué te quita más tiempo?</legend>
        <div className="flex flex-wrap gap-2">
          {calculadora.areas.map((a) => (
            <button
              key={a}
              type="button"
              aria-pressed={area === a}
              onClick={() => setArea(a)}
              className={`nin mb-[5px] inline-flex min-h-11 items-center rounded-[6px] px-3.5 text-[15px] font-bold ${
                area === a ? "bg-turquesa" : "bg-blanco"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-2">
        <label htmlFor="calc-personas" className={pregunta}>
          ¿Cuántas personas lo hacen?
          <output htmlFor="calc-personas" className="text-xl text-violeta">
            {personas}
            {masP}
          </output>
        </label>
        <div className="flex min-h-6 flex-wrap gap-[3px]">
          {Array.from({ length: personas }, (_, i) => (
            <Monito key={i} />
          ))}
        </div>
        <input
          id="calc-personas"
          type="range"
          className="barra"
          min={P.min}
          max={P.max}
          value={personas}
          style={relleno(personas, P.min, P.max)}
          onChange={(e) => setPersonas(Number(e.target.value))}
        />
      </div>

      <div className="flex flex-col gap-3">
        <span className={pregunta}>¿Cuántas horas al día cada una?</span>
        <div className="flex items-center gap-5">
          <Perilla valor={horas} onCambio={setHoras} />
          <div className="text-[15px] leading-snug">
            <strong className="block text-[34px] leading-none tracking-[-0.03em]">
              {horas}
              {horas === H.max ? "+" : ""} h
            </strong>
            al día. Gira la perilla.
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="calc-costo" className={pregunta}>
          ¿Cuánto le pagas por hora?
          <output htmlFor="calc-costo" className="text-xl text-violeta">
            ${costo}
            {masC}
          </output>
        </label>
        <input
          id="calc-costo"
          type="range"
          className="barra"
          min={C.min}
          max={C.max}
          step={C.paso}
          value={costo}
          style={relleno(costo, C.min, C.max)}
          onChange={(e) => setCosto(Number(e.target.value))}
        />
      </div>

      <div className="rounded-[6px] bg-tinta p-4 text-blanco" aria-live="polite">
        <span className="block text-sm text-turquesa">Se te van en {area.toLowerCase()}</span>
        <strong className="mt-1 block text-[40px] leading-none tracking-[-0.04em] tabular-nums">
          <span className="sr-only">{pesos(total)}</span>
          <span aria-hidden>{pesos(mostrado)}</span> <span className="text-lg font-medium tracking-normal">al mes</span>
        </strong>
        <span className="mt-2 block text-[13px] opacity-80">
          {Math.round(horasMes)} horas al mes · {personas} × {horas} h × {diagnostico.diasHabiles} días × ${costo}
        </span>
      </div>

      <a href={linkWhatsApp(mensaje)} target="_blank" rel="noopener noreferrer" className="btn -mt-1 bg-violeta text-blanco">
        Agendar mi videollamada
      </a>
    </div>
  );
}
