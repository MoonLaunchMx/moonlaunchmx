"use client";

import { useState } from "react";
import { diagnostico, linkWhatsApp } from "@/lib/site";

const chip = "nin mb-[5px] inline-flex min-h-11 items-center rounded-full px-3.5 text-[15px] font-semibold";
const h3 = "m-0 text-[22px] leading-[1.1] font-extrabold";

function Diagnostico() {
  const [paso, setPaso] = useState(1);
  const [area, setArea] = useState<string | null>(null);
  const [herr, setHerr] = useState<string[]>([]);
  const [problema, setProblema] = useState("");

  const resumen = [
    "Hola Moon Launch, hice el diagnóstico.",
    `Área: ${area ?? "sin elegir"}`,
    `Herramientas: ${herr.length ? herr.join(", ") : "ninguna"}`,
    problema.trim() ? `Problema: ${problema.trim()}` : "",
    "Quiero agendar mi videollamada.",
  ]
    .filter(Boolean)
    .join("\n");

  function reiniciar() {
    setPaso(1);
    setArea(null);
    setHerr([]);
    setProblema("");
  }

  if (paso === 4) {
    return (
      <div className="flex flex-col gap-3.5">
        <div className="rounded-[4px] bg-tinta p-4 text-blanco">
          <div className="text-sm text-turquesa">Listo, ya tenemos tu caso.</div>
          <div className="mt-1.5 text-[28px] leading-tight font-extrabold tracking-[-0.03em]">
            Lo revisamos en 45 min, sin costo.
          </div>
        </div>
        <a href={linkWhatsApp(resumen)} target="_blank" rel="noopener noreferrer" className="btn bg-violeta text-blanco">
          Agendar mi videollamada
        </a>
        <button type="button" onClick={reiniciar} className="btn bg-blanco text-tinta">
          Volver a empezar
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3.5">
      <div
        className="borde h-2 overflow-hidden"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={3}
        aria-valuenow={paso}
        aria-label={`Pregunta ${paso} de 3`}
      >
        <div className="h-full bg-violeta" style={{ width: `${(paso / 3) * 100}%` }} />
      </div>

      {paso === 1 && (
        <>
          <h3 className={h3}>¿Qué te quita más tiempo?</h3>
          <div className="flex flex-wrap gap-2">
            {diagnostico.areas.map((a) => (
              <button
                key={a}
                type="button"
                aria-pressed={area === a}
                onClick={() => setArea(a)}
                className={`${chip} ${area === a ? "bg-turquesa" : "bg-blanco"}`}
              >
                {a}
              </button>
            ))}
          </div>
        </>
      )}
      {paso === 2 && (
        <>
          <h3 className={h3}>¿Con qué lo resuelves hoy?</h3>
          <div className="flex flex-wrap gap-2">
            {diagnostico.herramientas.map((h) => {
              const on = herr.includes(h);
              return (
                <button
                  key={h}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setHerr(on ? herr.filter((x) => x !== h) : [...herr, h])}
                  className={`${chip} ${on ? "bg-turquesa" : "bg-blanco"}`}
                >
                  {h}
                </button>
              );
            })}
          </div>
        </>
      )}
      {paso === 3 && (
        <>
          <h3 className={h3}>Tu problema, en una frase</h3>
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Tu problema
            <textarea
              value={problema}
              onChange={(e) => setProblema(e.target.value)}
              rows={3}
              placeholder="Ej. Shopify me sale carísimo"
              className="borde resize-none p-3 text-base font-normal"
            />
          </label>
        </>
      )}

      <div className="flex gap-2.5">
        {paso > 1 && (
          <button type="button" onClick={() => setPaso(paso - 1)} className="btn flex-1 bg-blanco text-tinta">
            Atrás
          </button>
        )}
        <button type="button" onClick={() => setPaso(paso + 1)} className="btn flex-[2] bg-violeta text-blanco">
          {paso === 3 ? "Ver resultado" : "Siguiente"}
        </button>
      </div>
    </div>
  );
}

/** "Cuéntanos tu caso": la ventana de Moon OS con el diagnóstico directo (17 nov 2026, sin los 4 íconos). */
export default function MoonOS() {
  return (
    <div className="borde sombra overflow-hidden bg-blanco">
      <div className="flex h-9 items-center justify-between bg-tinta px-2.5 font-marca text-sm text-blanco italic">
        <span>diagnostico.exe</span>
        <span aria-hidden className="size-2.5 rounded-full bg-turquesa" />
      </div>
      <div className="px-3.5 pt-4 pb-5">
        <Diagnostico />
      </div>
    </div>
  );
}
