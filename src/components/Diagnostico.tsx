"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useReducedMotion } from "motion/react";
import { Check } from "lucide-react";
import { dolores, linkWhatsApp } from "@/lib/site";

const SEMANAS_POR_MES = 4.33;
const mxn = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });

function Cifra({ valor, className }: { valor: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const previo = useRef(valor);
  const reducir = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reducir) {
      el.textContent = mxn.format(valor);
      previo.current = valor;
      return;
    }
    const control = animate(previo.current, valor, {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => (el.textContent = mxn.format(v)),
    });
    previo.current = valor;
    return () => control.stop();
  }, [valor, reducir]);

  return (
    <span ref={ref} className={`cifra ${className ?? ""}`}>
      {mxn.format(valor)}
    </span>
  );
}

function Rango(props: {
  id: string;
  etiqueta: string;
  valor: number;
  min: number;
  max: number;
  paso: number;
  formato: (v: number) => string;
  onChange: (v: number) => void;
}) {
  const p = ((props.valor - props.min) / (props.max - props.min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={props.id} className="text-[15px] text-white/75">
          {props.etiqueta}
        </label>
        <output htmlFor={props.id} className="cifra text-lg font-bold text-white">
          {props.formato(props.valor)}
        </output>
      </div>
      <input
        id={props.id}
        type="range"
        className="rango"
        min={props.min}
        max={props.max}
        step={props.paso}
        value={props.valor}
        style={{ ["--p" as string]: `${p}%` }}
        onChange={(e) => props.onChange(Number(e.target.value))}
      />
    </div>
  );
}

export default function Diagnostico() {
  const [marcados, setMarcados] = useState<string[]>(["whatsapp", "excel"]);
  const [personas, setPersonas] = useState(3);
  const [costoHora, setCostoHora] = useState(100);
  const [nombre, setNombre] = useState("");
  const [giro, setGiro] = useState("");

  const { horasMes, perdidaMes } = useMemo(() => {
    const horasSemana = dolores
      .filter((d) => marcados.includes(d.id))
      .reduce((s, d) => s + d.horasPorPersona * personas, 0);
    const horasMes = Math.round(horasSemana * SEMANAS_POR_MES);
    return { horasMes, perdidaMes: Math.round(horasMes * costoHora) };
  }, [marcados, personas, costoHora]);

  const seleccion = dolores.filter((d) => marcados.includes(d.id));

  function alternar(id: string) {
    setMarcados((m) => (m.includes(id) ? m.filter((x) => x !== id) : [...m, id]));
  }

  const mensaje = [
    `Hola Moon Launch, soy ${nombre.trim() || "[tu nombre]"}${giro.trim() ? ` de ${giro.trim()}` : ""}.`,
    `Hice el diagnóstico en su página:`,
    ...seleccion.map((d) => `• ${d.problema}`),
    `Equipo afectado: ${personas} ${personas === 1 ? "persona" : "personas"}.`,
    `Resultado: ~${horasMes} horas y ${mxn.format(perdidaMes)} al mes.`,
    `Me gustaría ver cómo lo resolvemos.`,
  ].join("\n");

  const listoParaEnviar = nombre.trim().length > 1 && seleccion.length > 0;

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_minmax(0,26rem)] lg:gap-14">
      {/* Columna de preguntas */}
      <div>
        <fieldset>
          <legend className="text-lg font-bold text-white">¿Qué pasa en tu negocio?</legend>
          <p className="mt-1 text-[15px] text-white/65">Marca todo lo que te suene.</p>
          <ul className="mt-5 grid gap-2.5">
            {dolores.map((d) => {
              const activo = marcados.includes(d.id);
              return (
                <li key={d.id}>
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={activo}
                    onClick={() => alternar(d.id)}
                    className={`flex min-h-14 w-full items-start gap-3.5 rounded-2xl border px-4 py-3.5 text-left text-[15px] leading-snug transition-colors ${
                      activo
                        ? "border-turquesa bg-turquesa/12 text-white"
                        : "border-white/15 bg-white/[0.04] text-white/80 active:bg-white/10"
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border-2 transition-colors ${
                        activo ? "border-turquesa bg-turquesa text-noche" : "border-white/40"
                      }`}
                    >
                      {activo && <Check size={14} strokeWidth={3.5} />}
                    </span>
                    {d.problema}
                  </button>
                </li>
              );
            })}
          </ul>
        </fieldset>

        <div className="mt-8 grid gap-4">
          <Rango
            id="personas"
            etiqueta="Personas que lo sufren"
            valor={personas}
            min={1}
            max={30}
            paso={1}
            formato={(v) => String(v)}
            onChange={setPersonas}
          />
          <Rango
            id="costo"
            etiqueta="Lo que cuesta una hora de tu equipo"
            valor={costoHora}
            min={50}
            max={500}
            paso={10}
            formato={(v) => mxn.format(v)}
            onChange={setCostoHora}
          />
        </div>
      </div>

      {/* Resultado */}
      <div className="lg:sticky lg:top-8 lg:self-start">
        <div className="rounded-[28px] bg-white p-6 text-tinta sm:p-8">
          <p className="text-[15px] text-tinta/70">El caos te cuesta al mes</p>
          <Cifra
            valor={perdidaMes}
            className="mt-1 block text-[clamp(2.75rem,13vw,4.5rem)] leading-[0.95] font-extrabold tracking-[-0.04em] text-naranja"
          />
          <p className="mt-3 text-[15px] text-tinta/70">
            <span className="cifra font-bold text-tinta">{horasMes} horas</span> de tu equipo en tareas que un sistema
            puede hacer solo.
          </p>

          <AnimatePresence initial={false}>
            {seleccion.length > 0 && (
              <motion.div
                key="plan"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <h3 className="mt-7 border-t border-linea pt-5 text-base font-bold">Lo que haríamos</h3>
                <ul className="mt-3 grid gap-3">
                  <AnimatePresence initial={false}>
                    {seleccion.map((d) => (
                      <motion.li
                        key={d.id}
                        layout
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 8 }}
                        className="flex gap-3"
                      >
                        <span aria-hidden className="mt-1.5 size-2.5 shrink-0 rounded-full bg-turquesa" />
                        <span className="text-[15px] leading-snug">
                          <strong className="font-bold">{d.solucion}.</strong>{" "}
                          <span className="text-tinta/70">{d.detalle}</span>
                        </span>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-7 grid gap-3 border-t border-linea pt-6">
            <label className="grid gap-1.5 text-sm font-medium">
              Tu nombre
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                autoComplete="name"
                className="h-12 rounded-xl border border-linea bg-lavanda px-4 text-base outline-none focus:border-violeta"
              />
            </label>
            <label className="grid gap-1.5 text-sm font-medium">
              Tu negocio <span className="font-normal text-tinta/55">(opcional)</span>
              <input
                value={giro}
                onChange={(e) => setGiro(e.target.value)}
                placeholder="Ej. fábrica de brownies en Saltillo"
                className="h-12 rounded-xl border border-linea bg-lavanda px-4 text-base outline-none placeholder:text-tinta/35 focus:border-violeta"
              />
            </label>
            <a
              href={listoParaEnviar ? linkWhatsApp(mensaje) : undefined}
              aria-disabled={!listoParaEnviar}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => !listoParaEnviar && e.preventDefault()}
              className={`mt-2 flex h-14 items-center justify-center rounded-2xl text-base font-bold transition-colors ${
                listoParaEnviar
                  ? "bg-violeta text-white active:bg-noche"
                  : "cursor-not-allowed bg-linea text-tinta/45"
              }`}
            >
              Enviar mi diagnóstico por WhatsApp
            </a>
            <p className="text-xs leading-relaxed text-tinta/55">
              {listoParaEnviar
                ? "Se abre WhatsApp con tu resultado ya escrito. Tú decides si lo mandas."
                : seleccion.length === 0
                  ? "Marca al menos un problema para armar tu diagnóstico."
                  : "Escribe tu nombre para armar el mensaje."}
            </p>
          </div>
        </div>
        <p className="mt-3 px-2 text-xs leading-relaxed text-white/50">
          Estimación con horas promedio por problema. En la llamada lo medimos con tus números reales.
        </p>
      </div>
    </div>
  );
}
