"use client";

import { useEffect, useRef, useState } from "react";
import { agenda, linkWhatsApp } from "@/lib/site";

/**
 * Agenda "Hablemos" (aprobada 13 nov 2026): ventana agenda.exe con calendario, hora y datos.
 * "Enviar por WhatsApp" abre WhatsApp a Diego con el mensaje ya escrito. Se monta una vez en el layout
 * y cualquier botón la abre con abrirAgenda().
 */

const EVENTO = "moonlaunch:abrir-agenda";
export function abrirAgenda() {
  window.dispatchEvent(new Event(EVENTO));
}

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const INICIALES = ["L", "M", "M", "J", "V", "S", "D"];

const soloFecha = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const mismoDia = (a: Date, b: Date) => a.getTime() === b.getTime();
const fechaLarga = (d: Date) => `${DIAS[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]}`;

const campo = "min-h-11 rounded-[4px] border-2 border-tinta px-3 text-base font-normal";

export default function Agenda() {
  const ventana = useRef<HTMLDialogElement>(null);
  const [hoy, setHoy] = useState<Date | null>(null);
  const [mes, setMes] = useState(0);
  const [dia, setDia] = useState<Date | null>(null);
  const [hora, setHora] = useState<string | null>(null);
  const [nombre, setNombre] = useState("");
  const [negocio, setNegocio] = useState("");

  useEffect(() => {
    const abrir = () => {
      setHoy(soloFecha(new Date()));
      ventana.current?.showModal();
    };
    window.addEventListener(EVENTO, abrir);
    return () => window.removeEventListener(EVENTO, abrir);
  }, []);

  const cerrar = () => ventana.current?.close();

  let celdas: (Date | null)[] = [];
  let manana = new Date(0);
  let limite = new Date(0);
  let base = new Date(0);
  let ultimoMes = 0;
  if (hoy) {
    manana = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1);
    limite = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + agenda.diasAdelante);
    ultimoMes = (limite.getFullYear() - hoy.getFullYear()) * 12 + limite.getMonth() - hoy.getMonth();
    base = new Date(hoy.getFullYear(), hoy.getMonth() + mes, 1);
    const hueco = (base.getDay() + 6) % 7;
    const diasMes = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
    celdas = [
      ...Array.from({ length: hueco }, () => null),
      ...Array.from({ length: diasMes }, (_, i) => new Date(base.getFullYear(), base.getMonth(), i + 1)),
    ];
  }

  const nombreLimpio = nombre.trim();
  const listo = Boolean(dia && hora && nombreLimpio);
  const mensaje = agenda.mensaje(nombreLimpio || "[tu nombre]", negocio.trim(), dia ? fechaLarga(dia) : "[día]", hora ?? "[hora]");

  return (
    <dialog
      ref={ventana}
      aria-labelledby="agenda-titulo"
      className="m-auto max-h-[calc(100dvh-24px)] w-[min(760px,calc(100vw-24px))] overflow-y-auto rounded-[4px] border-2 border-tinta bg-blanco p-0 text-tinta shadow-[6px_6px_0_var(--color-tinta)] backdrop:bg-tinta/45"
      onClick={(e) => {
        if (e.target === e.currentTarget) cerrar();
      }}
    >
      <div className="relative h-8 border-b-2 border-tinta bg-violeta">
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-marca text-sm whitespace-nowrap text-blanco italic">
          agenda.exe
        </span>
        <button
          type="button"
          onClick={cerrar}
          aria-label="Cerrar agenda"
          className="absolute top-1 right-2 size-5 cursor-pointer border-2 border-tinta bg-blanco p-0 active:bg-tinta"
        />
      </div>

      <div className="flex flex-col gap-1 px-4 pt-5 pb-2 md:px-6">
        <h2 id="agenda-titulo" className="m-0 text-[28px] leading-[1.05] font-extrabold tracking-[-0.03em]">
          {agenda.titulo}
        </h2>
        <p className="m-0 text-[15px] text-tinta/70">{agenda.nota}</p>
      </div>

      <div className="grid gap-6 px-4 py-3.5 md:grid-cols-[1.15fr_1fr] md:px-6">
        {/* 1. Día */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setMes((m) => Math.max(0, m - 1))}
              disabled={mes === 0}
              aria-label="Mes anterior"
              className="size-11 cursor-pointer rounded-[4px] border-2 border-tinta bg-blanco font-extrabold disabled:cursor-default disabled:opacity-35"
            >
              ‹
            </button>
            <strong className="text-[17px]" aria-live="polite">
              1. {MESES[base.getMonth()]} {base.getFullYear()}
            </strong>
            <button
              type="button"
              onClick={() => setMes((m) => Math.min(ultimoMes, m + 1))}
              disabled={mes >= ultimoMes}
              aria-label="Mes siguiente"
              className="size-11 cursor-pointer rounded-[4px] border-2 border-tinta bg-blanco font-extrabold disabled:cursor-default disabled:opacity-35"
            >
              ›
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-extrabold text-tinta/70" aria-hidden>
            {INICIALES.map((l, i) => (
              <span key={i}>{l}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {celdas.map((d, i) => {
              if (!d) return <span key={`h${i}`} />;
              const finde = d.getDay() === 0 || d.getDay() === 6;
              const apagado = finde || d < manana || d > limite;
              const activo = dia !== null && mismoDia(dia, d);
              return (
                <button
                  key={d.getTime()}
                  type="button"
                  disabled={apagado}
                  aria-pressed={activo}
                  aria-label={fechaLarga(d)}
                  onClick={() => {
                    setDia(d);
                    setHora(null);
                  }}
                  className={`h-10 cursor-pointer rounded-[4px] border-2 p-0 text-sm font-extrabold disabled:cursor-default disabled:border-tinta/15 disabled:text-tinta/35 ${
                    activo ? "border-tinta bg-violeta text-blanco" : "border-tinta bg-blanco"
                  }`}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Hora y 3. Datos */}
        <div className="flex flex-col gap-3.5">
          <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
            <legend className="mb-2 p-0 text-[17px] font-extrabold">
              2. Hora <span className="text-sm font-normal text-tinta/70">(hora de CDMX)</span>
            </legend>
            {dia ? (
              <div className="grid grid-cols-3 gap-1.5">
                {agenda.horas.map((h) => (
                  <button
                    key={h}
                    type="button"
                    aria-pressed={hora === h}
                    onClick={() => setHora(h)}
                    className={`min-h-11 cursor-pointer rounded-[4px] border-2 border-tinta text-[15px] font-extrabold ${
                      hora === h ? "bg-turquesa" : "bg-blanco"
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            ) : (
              <p className="m-0 rounded-[4px] border-2 border-dashed border-tinta/40 p-3 text-sm text-tinta/70">Primero elige un día.</p>
            )}
          </fieldset>
          <div className="flex flex-col gap-2">
            <strong className="text-[17px]">3. Tus datos</strong>
            <label className="flex flex-col gap-1 text-[13px] font-extrabold">
              Tu nombre
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ana López"
                autoComplete="name"
                className={campo}
              />
            </label>
            <label className="flex flex-col gap-1 text-[13px] font-extrabold">
              <span>
                Tu negocio <span className="font-normal text-tinta/70">(opcional)</span>
              </span>
              <input
                type="text"
                value={negocio}
                onChange={(e) => setNegocio(e.target.value)}
                placeholder="Panadería La Espiga"
                autoComplete="organization"
                className={campo}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t-2 border-tinta px-4 py-3.5 md:flex-row md:items-center md:gap-4 md:px-6">
        <p className="m-0 flex-1 rounded-[4px_4px_4px_0] border-2 border-tinta bg-turquesa px-3 py-2.5 text-sm leading-[1.35]" aria-live="polite">
          {mensaje}
        </p>
        {listo ? (
          <a href={linkWhatsApp(mensaje)} target="_blank" rel="noopener noreferrer" onClick={cerrar} className="btn shrink-0 bg-violeta text-blanco">
            Enviar por WhatsApp
          </a>
        ) : (
          <button type="button" disabled className="btn shrink-0 cursor-not-allowed bg-blanco text-tinta/45">
            Enviar por WhatsApp
          </button>
        )}
      </div>
    </dialog>
  );
}
