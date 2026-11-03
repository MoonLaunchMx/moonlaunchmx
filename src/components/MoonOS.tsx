"use client";

import { useState } from "react";
import Icono from "@/components/Icono";
import { casosMini, diagnostico, iconos, linkWhatsApp, niveles, preguntasSugeridas } from "@/lib/site";

type App = "diagnostico" | "servicios" | "pregunta" | "casos";

const apps: { id: App; label: string; titulo: string; icono: string; turquesa?: boolean }[] = [
  { id: "diagnostico", label: "diagnóstico", titulo: "diagnostico.exe", icono: iconos.barras },
  { id: "servicios", label: "qué hacemos", titulo: "que_hacemos", icono: iconos.escalera },
  { id: "pregunta", label: "pregúntale", titulo: "moonlaunch.exe", icono: iconos.chat, turquesa: true },
  { id: "casos", label: "casos", titulo: "casos", icono: iconos.archivo },
];

const chip = "nin mb-[5px] inline-flex min-h-11 items-center rounded-full px-3.5 text-[15px] font-semibold";
const h3 = "m-0 text-[22px] leading-[1.1] font-extrabold";

function Diagnostico({ onSalir }: { onSalir: () => void }) {
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
        <button
          type="button"
          onClick={() => (paso === 1 ? onSalir() : setPaso(paso - 1))}
          className="btn flex-1 bg-blanco text-tinta"
        >
          Atrás
        </button>
        <button type="button" onClick={() => setPaso(paso + 1)} className="btn flex-[2] bg-violeta text-blanco">
          {paso === 3 ? "Ver resultado" : "Siguiente"}
        </button>
      </div>
    </div>
  );
}

function Pregunta() {
  const [texto, setTexto] = useState("");
  const enviar = (q: string) =>
    window.open(linkWhatsApp(`Hola Moon Launch, tengo una pregunta: ${q}`), "_blank", "noopener,noreferrer");

  return (
    <div className="flex flex-col gap-3 text-[15px] leading-snug">
      <div className="borde max-w-[88%] px-3 py-2.5">¿Qué quieres saber?</div>
      <div className="flex flex-wrap gap-2">
        {preguntasSugeridas.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => enviar(q)}
            className="nin mb-[5px] inline-flex min-h-11 items-center rounded-full bg-blanco px-3 text-sm font-semibold"
          >
            {q}
          </button>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (texto.trim()) enviar(texto.trim());
        }}
        className="borde flex min-h-12 items-center gap-2 py-1 pr-1 pl-3"
      >
        <label htmlFor="pregunta" className="sr-only">
          Escribe tu pregunta
        </label>
        <input
          id="pregunta"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escribe tu pregunta…"
          className="min-w-0 flex-1 border-0 py-2.5 text-base outline-none"
        />
        <button type="submit" aria-label="Enviar pregunta" className="grid size-10 place-items-center rounded-[4px] bg-violeta active:bg-tinta">
          <Icono d={iconos.enviar} size={18} color="#ffffff" grosor={2.5} />
        </button>
      </form>
      <p className="m-0 text-sm text-tinta/70">Te contestamos por WhatsApp.</p>
    </div>
  );
}

export default function MoonOS() {
  const [abierta, setAbierta] = useState<App | null>(null);
  const app = apps.find((a) => a.id === abierta);

  return (
    <div className="escritorio borde sombra relative h-[560px] overflow-hidden">
      <div className="flex h-9 items-center justify-between bg-tinta px-2.5 font-marca text-sm text-blanco italic">
        <span>Moon OS</span>
        <span aria-hidden className="size-2.5 rounded-full bg-turquesa" />
      </div>

      <nav aria-label="Apps de Moon OS" className="grid grid-cols-2 gap-y-7 px-6 py-10">
        {apps.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => setAbierta(a.id)}
            className="flex flex-col items-center gap-1.5 text-[13px] font-semibold text-blanco"
          >
            <span
              className={`nin grid size-[68px] place-items-center rounded-[6px] ${
                a.turquesa ? "bg-turquesa" : "bg-blanco"
              }`}
            >
              <Icono d={a.icono} size={30} color={a.turquesa ? "#1d1e20" : "#683ee6"} />
            </span>
            {a.label}
          </button>
        ))}
      </nav>

      {app && (
        <section
          role="dialog"
          aria-label={app.titulo}
          className="borde sombra absolute top-[46px] right-3 bottom-3 left-2 flex flex-col bg-blanco"
        >
          <div className="flex items-center justify-between border-b-2 border-tinta bg-violeta py-1 pr-1 pl-2.5 font-marca text-sm text-blanco italic">
            <span>{app.titulo}</span>
            <button
              type="button"
              onClick={() => setAbierta(null)}
              aria-label="Cerrar"
              className="nin mb-[5px] grid size-9 place-items-center rounded-[6px] bg-blanco"
            >
              <Icono d="M6 6l12 12M18 6L6 18" size={16} color="#1d1e20" grosor={3} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-3.5 pt-4 pb-5">
            {abierta === "diagnostico" && <Diagnostico onSalir={() => setAbierta(null)} />}
            {abierta === "servicios" && (
              <ol className="m-0 flex list-none flex-col gap-2.5 p-0">
                {niveles.map((n, i) => (
                  <li key={n.titulo} className="borde flex items-center gap-3 p-3">
                    <span className="grid size-[30px] shrink-0 place-items-center rounded-[4px] bg-violeta font-extrabold text-blanco">
                      {i + 1}
                    </span>
                    <span>
                      <strong className="block text-[17px]">{n.titulo}</strong>
                      <span className="text-[13px] text-tinta/70">{n.herr}</span>
                    </span>
                  </li>
                ))}
              </ol>
            )}
            {abierta === "pregunta" && <Pregunta />}
            {abierta === "casos" && (
              <div className="flex flex-col gap-2.5 text-[15px] leading-snug">
                {casosMini.map((c) => (
                  <div key={c.nombre} className="borde p-3">
                    <strong>{c.nombre}</strong>
                    <br />
                    {c.linea}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
