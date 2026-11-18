"use client";

import { useState, type UIEvent } from "react";
import BotonHablemos from "@/components/BotonHablemos";
import Icono from "@/components/Icono";
import { consultoria } from "@/lib/site";

function Palomita() {
  return (
    <svg viewBox="0 0 24 24" className="mt-px size-[18px] shrink-0 lg:size-5" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="#48c9b0" stroke="#1d1e20" strokeWidth="2" />
      <path d="M7 12.5l3 3 7-7" fill="none" stroke="#1d1e20" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * "Consultoría en transformación digital" (aprobado 17 nov 2026): método + 3 planes + Hablemos.
 * Celular: las tarjetas se deslizan de lado. Escritorio: las 3 juntas, Copiloto un poco más arriba.
 */
export default function Planes() {
  const [actual, setActual] = useState(0);
  const { planes } = consultoria;

  function alDeslizar(e: UIEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    const primera = el.firstElementChild as HTMLElement | null;
    const ancho = primera ? primera.offsetWidth + 12 : 1;
    const n = Math.max(0, Math.min(planes.length - 1, Math.round(el.scrollLeft / ancho)));
    if (n !== actual) setActual(n);
  }

  return (
    <section
      aria-labelledby="consultoria"
      className="escritorio-claro flex flex-col gap-4 pt-8 pb-[26px] lg:gap-10 lg:px-[120px] lg:pt-[72px] lg:pb-16"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 lg:grid lg:grid-cols-2 lg:items-end lg:gap-12">
        <div className="flex flex-col gap-2 px-4 lg:gap-3 lg:px-0">
          <h2 id="consultoria" className="m-0 text-[34px] leading-[0.98] font-extrabold tracking-[-0.035em] text-balance lg:text-[56px] lg:leading-[0.95] lg:tracking-[-0.04em]">
            {consultoria.titulo}
          </h2>
          <p className="m-0 text-[15px] leading-snug text-tinta/75 lg:text-lg">{consultoria.linea}</p>
        </div>

        <ol
          aria-label={consultoria.metodoLabel}
          className="borde mx-4 grid list-none grid-cols-2 gap-2 bg-turquesa p-2.5 lg:mx-0 lg:grid-cols-4 lg:px-2.5 lg:py-4 lg:shadow-[4px_4px_0_var(--color-tinta)]"
        >
          {consultoria.metodo.map((p) => (
            <li
              key={p.nombre}
              className="flex min-w-0 items-center gap-1.5 rounded-[4px] border-2 border-tinta bg-blanco px-1.5 py-1.5 lg:flex-col lg:gap-1.5 lg:border-0 lg:bg-transparent lg:p-0 lg:text-center"
            >
              <span className="grid size-6 shrink-0 place-items-center rounded-[4px] bg-violeta lg:size-[42px] lg:rounded-[6px] lg:border-2 lg:border-tinta lg:bg-blanco">
                <span className="text-blanco lg:text-tinta [&>svg]:size-[15px] lg:[&>svg]:size-[22px]">
                  <Icono d={p.icono} />
                </span>
              </span>
              <span className="text-[13px] leading-[1.1] font-extrabold tracking-[-0.01em] lg:text-sm lg:tracking-[-0.01em]">{p.nombre}</span>
              <span className="hidden text-[12.5px] leading-tight lg:block">{p.linea}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="mx-auto w-full max-w-6xl">
        <div
          onScroll={alDeslizar}
          role="region"
          aria-label="Planes de consultoría"
          tabIndex={0}
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pt-4 pb-3 [scrollbar-width:none] lg:grid lg:grid-cols-3 lg:gap-7 lg:overflow-visible lg:px-0 lg:pt-6 [&::-webkit-scrollbar]:hidden"
        >
          {planes.map((p) => (
            <article
              key={p.nombre}
              className={`relative flex shrink-0 basis-[80%] snap-center flex-col gap-3 rounded-[6px] border-2 border-tinta bg-blanco px-3.5 py-4 lg:gap-4 lg:px-[22px] lg:py-6 ${
                p.recomendado
                  ? "shadow-[6px_6px_0_var(--color-violeta)] lg:-translate-y-3.5"
                  : "shadow-[4px_4px_0_var(--color-tinta)]"
              }`}
            >
              {p.recomendado && (
                <span className="absolute -top-[13px] right-3 rounded-full border-2 border-tinta bg-turquesa px-[9px] py-[3px] text-xs font-extrabold lg:-top-[15px] lg:right-[18px] lg:text-[13px]">
                  {consultoria.recomendado}
                </span>
              )}
              <div className="flex flex-col gap-0.5 lg:gap-1">
                <h3 className={`m-0 text-2xl leading-[1.05] font-extrabold tracking-[-0.025em] lg:text-[30px] ${p.recomendado ? "text-violeta" : ""}`}>
                  {p.nombre}
                </h3>
                <span className="text-[13px] font-semibold text-tinta/70 lg:text-sm">{p.para}</span>
              </div>
              <p className="m-0 flex flex-wrap items-baseline gap-1.5">
                {p.desde && <span className="text-[13px] font-bold lg:text-sm">{p.desde}</span>}
                <span className="text-[30px] leading-none font-extrabold tracking-[-0.03em] lg:text-[40px]">{p.precio}</span>
                <span className="text-[13px] font-bold lg:text-sm">{p.nota}</span>
              </p>
              <ul className="m-0 flex list-none flex-col gap-2 border-t-2 border-dashed border-tinta p-0 pt-3 lg:gap-2.5 lg:pt-4">
                {p.incluye.map((x, i) => (
                  <li key={x} className="flex items-start gap-2 text-[14.5px] leading-[1.3] lg:gap-2.5 lg:text-base">
                    <Palomita />
                    <span className={i === 0 && p.incluye[0].startsWith("Todo lo de") ? "font-extrabold" : ""}>{x}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="flex justify-center gap-1.5 lg:hidden" aria-hidden>
          {planes.map((p, i) => (
            <span
              key={p.nombre}
              className={`h-2 rounded-full border-2 border-tinta transition-[width] duration-200 ${i === actual ? "w-[22px] bg-violeta" : "w-2 bg-blanco"}`}
            />
          ))}
        </div>
      </div>

      <div className="px-4 lg:flex lg:justify-center lg:px-0">
        <BotonHablemos className="min-h-[54px] w-full text-lg font-extrabold lg:min-h-[58px] lg:w-auto lg:min-w-80 lg:px-8 lg:text-[19px]" />
      </div>
    </section>
  );
}
