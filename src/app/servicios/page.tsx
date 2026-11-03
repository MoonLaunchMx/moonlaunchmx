import type { Metadata } from "next";
import CtaFinal from "@/components/CtaFinal";
import Header from "@/components/Header";
import Icono from "@/components/Icono";
import { dudas, modalidades, servicios, soporte } from "@/lib/site";

export const metadata: Metadata = {
  title: "Servicios",
  description: "Excel que trabaja solo, herramientas listas, automatizaciones con n8n y Make, o tu propia app en suscripción o compra.",
  alternates: { canonical: "/servicios" },
};

const contenedor = "mx-auto max-w-2xl px-4";

export default function Servicios() {
  return (
    <>
      <Header />
      <main>
        <section className={`${contenedor} flex flex-col gap-3.5 pt-6 pb-8`}>
          <h1 className="m-0 text-[44px] leading-[0.93] font-extrabold tracking-[-0.045em]">Automatizamos tu operación.</h1>
          <p className="m-0 text-[19px] leading-tight font-semibold">Si un Excel lo resuelve, no te vendemos una app.</p>
        </section>

        <section className={`${contenedor} flex flex-col gap-3.5 pb-11`}>
          {servicios.map((s) => (
            <div
              key={s.titulo}
              className={`borde flex items-center gap-3.5 bg-blanco p-3.5 ${
                s.destacado ? "shadow-[4px_4px_0_var(--color-violeta)]" : "sombra"
              }`}
            >
              <span className={`borde grid size-12 shrink-0 place-items-center ${s.destacado ? "bg-violeta" : ""}`}>
                <Icono d={s.icono} color={s.destacado ? "#ffffff" : "#683ee6"} />
              </span>
              <div>
                <h2 className="m-0 text-[19px] font-extrabold">{s.titulo}</h2>
                <span className="mt-[3px] block text-[13px] text-tinta/70">{s.herr}</span>
              </div>
            </div>
          ))}
        </section>

        <section className={`${contenedor} flex flex-col gap-3 pb-11`} aria-labelledby="app">
          <h2 id="app" className="titulo-seccion">
            ¿App? Tú eliges.
          </h2>
          {modalidades.map((m) => (
            <div
              key={m.nombre}
              className={`borde flex items-baseline justify-between gap-3 p-3.5 ${
                m.acento === "violeta" ? "shadow-[4px_4px_0_var(--color-violeta)]" : "shadow-[4px_4px_0_var(--color-turquesa)]"
              }`}
            >
              <div>
                <h3 className={`m-0 text-[21px] font-extrabold ${m.acento === "violeta" ? "text-violeta" : ""}`}>{m.nombre}</h3>
                <span className="text-[15px]">{m.frase}</span>
              </div>
              <span className="font-bold whitespace-nowrap">{m.precio}</span>
            </div>
          ))}
          <div className="borde flex items-baseline justify-between gap-3 bg-turquesa p-3.5">
            <div>
              <h3 className="m-0 text-[21px] font-extrabold">{soporte.nombre}</h3>
              <span className="text-[15px]">{soporte.frase}</span>
            </div>
            <span className="font-bold whitespace-nowrap">{soporte.precio}</span>
          </div>
        </section>

        <section className={`${contenedor} pb-12`} aria-labelledby="dudas">
          <h2 id="dudas" className="titulo-seccion mb-1.5">
            Dudas rápidas
          </h2>
          <dl className="m-0">
            {dudas.map((d) => (
              <div key={d.p} className="border-b-[1.5px] border-tinta/20 py-3">
                <dt className="text-base font-bold">{d.p}</dt>
                <dd className="m-0 mt-0.5 text-lg font-extrabold text-violeta">{d.r}</dd>
              </div>
            ))}
          </dl>
        </section>

        <CtaFinal titulo="¿No sabes por dónde empezar?" />
      </main>
    </>
  );
}
