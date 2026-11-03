"use client";

import { useState } from "react";
import Icono from "@/components/Icono";
import { piezas } from "@/lib/site";

const segmento = "min-h-[52px] text-[15px] font-bold";

export default function OperacionSwitch() {
  const [conectado, setConectado] = useState(false);

  return (
    <div className="flex flex-col gap-[18px]">
      <div role="group" aria-label="Comparar tu operación" className="borde sombra grid grid-cols-2 overflow-hidden">
        <button
          type="button"
          onClick={() => setConectado(false)}
          aria-pressed={!conectado}
          className={`${segmento} ${conectado ? "bg-blanco text-tinta" : "bg-tinta text-blanco"}`}
        >
          Tu operación
        </button>
        <button
          type="button"
          onClick={() => setConectado(true)}
          aria-pressed={conectado}
          className={`${segmento} border-l-2 border-tinta ${conectado ? "bg-violeta text-blanco" : "bg-blanco text-tinta"}`}
        >
          Con Moon Launch
        </button>
      </div>

      <div
        className="punteado relative h-[430px] overflow-hidden rounded-[4px] border-2 border-dashed border-tinta/25 bg-blanco"
        aria-live="polite"
      >
        <div
          className="linea-viva absolute top-10 left-11 h-[350px] w-1 rounded-sm bg-turquesa"
          style={{ opacity: conectado ? 1 : 0 }}
          aria-hidden
        />
        {conectado &&
          [0, 0.87, 1.74].map((retraso, i) => (
            <span
              key={retraso}
              aria-hidden
              className={`pulso absolute top-[38px] left-10 z-0 size-3 rounded-full border-2 border-tinta ${
                i === 2 ? "bg-turquesa" : "bg-violeta"
              }`}
              style={{ animationDelay: `${retraso}s` }}
            />
          ))}

        <ul className="m-0 list-none p-0">
          {piezas.map((p, i) => (
            <li
              key={p.caos}
              className="pieza absolute top-0 left-0 z-[1] box-border flex min-h-[52px] items-center rounded-[4px] border-2 border-tinta px-3 py-2.5 shadow-[3px_3px_0_var(--color-tinta)]"
              style={{
                width: conectado ? "calc(100% - 32px)" : 168,
                transform: conectado
                  ? `translate(16px, ${16 + i * 68}px)`
                  : `translate(${p.x}px, ${p.y}px) rotate(${p.r}deg)`,
                transitionDelay: `${i * 60}ms`,
                backgroundColor: !conectado && p.turquesa ? "var(--color-turquesa)" : "var(--color-blanco)",
              }}
            >
              <span className="flex w-full items-center gap-2.5">
                <span
                  className={`grid size-[30px] shrink-0 place-items-center rounded-[4px] border-2 border-tinta ${
                    conectado ? "bg-violeta" : "bg-blanco"
                  }`}
                >
                  <Icono d={p.icono} size={18} color={conectado ? "#ffffff" : "#1d1e20"} />
                </span>
                {conectado ? (
                  <>
                    <strong className="flex-1 text-[15px] leading-tight">{p.orden}</strong>
                    <span
                      className="palomita grid size-6 shrink-0 place-items-center rounded-full border-2 border-tinta bg-turquesa"
                      style={{ animationDelay: `${500 + i * 120}ms` }}
                      aria-label="Listo"
                    >
                      <Icono d="M5 12l5 5L19 7" size={14} color="#1d1e20" grosor={3.5} />
                    </span>
                  </>
                ) : (
                  <span className="text-sm leading-tight font-bold">{p.caos}</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <p className="m-0 flex items-center justify-center gap-2 text-[17px] font-bold">
        {conectado && <span aria-hidden className="vivo size-2.5 rounded-full border-2 border-tinta bg-turquesa" />}
        {conectado ? "Todo conectado, en tiempo real." : "Así se ve hoy. Toca «Con Moon Launch»."}
      </p>
    </div>
  );
}
