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

const chip = "inline-flex min-h-11 items-center rounded-full border-2 border-tinta px-3.5 text-[15px] font-semibold";
const h3 = "m-0 text-[22px] leading-[1.1] font-extrabold";

function Contador({ valor, onMenos, onMas, etiqueta }: { valor: number; onMenos: () => void; onMas: () => void; etiqueta: string }) {
  const btn = "borde grid size-12 place-items-center bg-blanco text-2xl font-bold";
  return (
    <div className="flex items-center gap-4">
      <button type="button" className={btn} onClick={onMenos} aria-label={`Menos ${etiqueta}`}>
        −
      </button>
      <output className="min-w-16 text-center text-5xl font-extrabold" aria-live="polite">
        {valor}
      </output>
      <button type="button" className={btn} onClick={onMas} aria-label={`Más ${etiqueta}`}>
        +
      </button>
    </div>
  );
}

function Diagnostico({ onSalir }: { onSalir: () => void }) {
  const [paso, setPaso] = useState(1);
  const [area, setArea] = useState<string | null>(null);
  const [herr, setHerr] = useState<string[]>([]);
  const [personas, setPersonas] = useState(2);
  const [horas, setHoras] = useState(2);
  const [problema, setProblema] = useState("");

  const horasMes = personas * horas * diagnostico.diasHabiles;
  const resumen = [
    "Hola Moon Launch, hice el diagnóstico.",
    `Área: ${area ?? "sin elegir"}`,
    `Herramientas: ${herr.length ? herr.join(", ") : "ninguna"}`,
    `Personas: ${personas}, ${horas} h al día cada una (${horasMes} h al mes)`,
    problema.trim() ? `Problema: ${problema.trim()}` : "",
    "Quiero agendar mi videollamada.",
  ]
    .filter(Boolean)
    .join("\n");

  function reiniciar() {
    setPaso(1);
    setArea(null);
    setHerr([]);
    setPersonas(2);
    setHoras(2);
    setProblema("");
  }

  if (paso === 6) {
    return (
      <div className="flex flex-col gap-3.5">
        <div className="rounded-[4px] bg-tinta p-4 text-blanco">
          <div className="text-sm text-turquesa">Tu equipo dedica a {area ? area.toLowerCase() : "esa tarea"}</div>
          <div className="mt-1.5 text-[46px] leading-none font-extrabold tracking-[-0.04em]">
            {horasMes} h <span className="text-lg font-medium tracking-normal">al mes</span>
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
        aria-valuemax={5}
        aria-valuenow={paso}
        aria-label={`Pregunta ${paso} de 5`}
      >
        <div className="h-full bg-violeta" style={{ width: `${paso * 20}%` }} />
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
          <h3 className={h3}>¿Cuántas personas?</h3>
          <Contador
            valor={personas}
            etiqueta="personas"
            onMenos={() => setPersonas((v) => Math.max(1, v - 1))}
            onMas={() => setPersonas((v) => Math.min(50, v + 1))}
          />
        </>
      )}
      {paso === 4 && (
        <>
          <h3 className={h3}>¿Horas al día, cada una?</h3>
          <Contador
            valor={horas}
            etiqueta="horas"
            onMenos={() => setHoras((v) => Math.max(1, v - 1))}
            onMas={() => setHoras((v) => Math.min(10, v + 1))}
          />
        </>
      )}
      {paso === 5 && (
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
          {paso === 5 ? "Ver resultado" : "Siguiente"}
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
            className="inline-flex min-h-11 items-center rounded-full border-[1.5px] border-tinta bg-blanco px-3 text-sm font-semibold"
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
        <button type="submit" aria-label="Enviar pregunta" className="grid size-10 place-items-center rounded-[4px] bg-violeta">
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
            className="group flex flex-col items-center gap-1.5 text-[13px] font-semibold text-blanco"
          >
            <span
              className={`borde sombra grid size-[68px] place-items-center group-active:translate-x-0.5 group-active:translate-y-0.5 group-active:shadow-[2px_2px_0_var(--color-tinta)] ${
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
              className="borde grid size-10 place-items-center bg-blanco"
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
