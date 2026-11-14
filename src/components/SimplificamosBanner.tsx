"use client";

import { useEffect, useRef, useState } from "react";
import { IconoApp } from "@/components/Simplificamos";
import { simplificamos } from "@/lib/site";

type Item = (typeof simplificamos)[number];

/**
 * Banner de escritorio de "Simplificamos" (aprobado 13 nov 2026): pestañas pegadas a una ventana
 * a todo lo ancho. La primera ya está abierta; al picar otra, "qué hacemos" se escribe solo como terminal.
 */
export default function SimplificamosBanner() {
  const [activa, setActiva] = useState<Item>(simplificamos[0]);
  const [escritos, setEscritos] = useState<number>(simplificamos[0].que.length);
  const tecleo = useRef<number | undefined>(undefined);

  useEffect(() => () => clearInterval(tecleo.current), []);

  function elegir(item: Item) {
    clearInterval(tecleo.current);
    setActiva(item);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setEscritos(item.que.length);
      return;
    }
    setEscritos(0);
    tecleo.current = window.setInterval(() => {
      setEscritos((n) => {
        if (n + 2 >= item.que.length) clearInterval(tecleo.current);
        return Math.min(item.que.length, n + 2);
      });
    }, 18);
  }

  const panel = `panel-${activa.nombre.toLowerCase()}`;

  return (
    <div className="flex flex-col gap-5">
      <h2 id="simplificamos-banner" className="titulo-seccion !text-4xl">
        Así te ayudamos.
      </h2>

      <div>
        <div role="tablist" aria-label="Lo que hacemos" className="relative z-10 grid grid-cols-3 gap-2.5">
          {simplificamos.map((item) => {
            const sel = item.nombre === activa.nombre;
            return (
              <button
                key={item.nombre}
                type="button"
                role="tab"
                id={`tab-${item.nombre.toLowerCase()}`}
                aria-selected={sel}
                aria-controls={`panel-${item.nombre.toLowerCase()}`}
                onClick={() => elegir(item)}
                className={`-mb-0.5 flex min-h-[60px] cursor-pointer items-center gap-3 rounded-t-[6px] border-2 border-tinta px-4 py-2 text-left ${
                  sel ? "border-b-blanco bg-blanco" : "bg-turquesa"
                }`}
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-[4px] border-2 border-tinta bg-blanco [&_svg]:size-7">
                  <IconoApp nombre={item.nombre} />
                </span>
                <span className="text-xl font-extrabold tracking-[-0.02em]">{item.nombre}</span>
              </button>
            );
          })}
        </div>

        <section
          role="tabpanel"
          id={panel}
          aria-labelledby={`tab-${activa.nombre.toLowerCase()}`}
          className="relative rounded-b-[4px] border-2 border-tinta bg-blanco shadow-[5px_5px_0_var(--color-tinta)]"
        >
          <div className="barra-titulo relative h-[26px] border-b-2 border-tinta">
            <span className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blanco px-2 text-[13px] font-extrabold whitespace-nowrap">
              {activa.nombre.toLowerCase()}.exe
            </span>
          </div>
          <div className="grid min-h-[132px] grid-cols-[1.3fr_1fr_1fr] gap-7 px-6 pt-5 pb-[22px]">
            <div>
              <p className="sr-only">{activa.que}</p>
              <div aria-hidden className="font-mono text-[15px] leading-normal">
                <div className="font-bold text-violeta">C:\&gt; {activa.nombre.toLowerCase()}</div>
                <div className="text-[17px] font-bold">
                  {activa.que.slice(0, escritos)}
                  <span className="cursor-terminal ml-0.5 inline-block h-4 w-[9px] translate-y-0.5 bg-tinta" />
                </div>
              </div>
            </div>
            <div key={`ej-${activa.nombre}`} className="asoma flex flex-col gap-1.5">
              <span className="text-[13px] font-extrabold text-tinta/70">Por ejemplo</span>
              <span className="text-base leading-[1.4]">{activa.ejemplo}</span>
            </div>
            <div key={`gana-${activa.nombre}`} className="asoma flex flex-col gap-2">
              <span className="text-[13px] font-extrabold text-tinta/70">Lo que ganas</span>
              <span className="text-base leading-[1.4] font-bold">{activa.gana}</span>
              <ul className="m-0 mt-1 flex list-none flex-wrap gap-1.5 p-0" aria-label="Herramientas">
                {activa.herramientas.map((h) => (
                  <li key={h} className="rounded-full border-2 border-tinta bg-turquesa px-2.5 py-0.5 text-[13px] font-extrabold">
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
