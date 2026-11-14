import CalculadoraCaos from "@/components/CalculadoraCaos";
import Escritorio from "@/components/Escritorio";
import Header from "@/components/Header";
import MoonOS from "@/components/MoonOS";
import OperacionSwitch from "@/components/OperacionSwitch";
import Simplificamos from "@/components/Simplificamos";
import SimplificamosBanner from "@/components/SimplificamosBanner";
import type { CSSProperties } from "react";
import { datos, dolores, modalidades, waAgendar } from "@/lib/site";

const contenedor = "mx-auto max-w-2xl px-4";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        {/* Escritorio: la compu de tu negocio, a todo lo ancho, debajo de la navbar flotante. */}
        <section
          aria-label="Ordena. Automatiza. Despega."
          className="escritorio-claro relative isolate hidden pb-8 [container-type:inline-size] lg:-mt-20 lg:block lg:pt-[104px]"
        >
          <div style={{ "--u": "min(1px, calc(100cqw / 1440))" } as CSSProperties}>
            <Escritorio modo="escritorio" />
          </div>
        </section>

        {/* Celular: el mismo hero, del alto de la pantalla (debajo de la navbar flotante). */}
        <section
          aria-label="Ordena. Automatiza. Despega."
          className="escritorio-claro relative isolate -mt-[74px] h-svh min-h-[640px] pt-[86px] pb-3 lg:hidden"
        >
          <div className="mx-auto h-full max-w-2xl">
            <Escritorio modo="celular" />
          </div>
        </section>

        {/* Simplificamos. Celular: la caja con ventanas, después del hero. Escritorio: banner compacto con pestañas. */}
        <section className="mx-auto max-w-2xl px-4 pb-10 lg:hidden" aria-labelledby="simplificamos">
          <Simplificamos />
        </section>
        <section className="mx-auto hidden max-w-6xl px-6 pt-10 pb-16 lg:block" aria-labelledby="simplificamos-banner">
          <SimplificamosBanner />
        </section>

        <section className={`${contenedor} flex flex-col gap-[18px] pb-10`} aria-labelledby="te-suena">
          <h2 id="te-suena" className="titulo-seccion">
            ¿Te suena?
          </h2>
          <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
            {dolores.map((d) => (
              <li key={d} className="text-[22px] leading-[1.15] font-extrabold tracking-[-0.02em]">
                {d}
              </li>
            ))}
          </ul>
          <OperacionSwitch />
        </section>

        <section className={`${contenedor} flex flex-col gap-3.5 pb-12`} aria-labelledby="caos">
          <h2 id="caos" className="titulo-seccion">
            ¿Cuánto te cuesta el caos?
          </h2>
          <CalculadoraCaos />
        </section>

        <section className={`${contenedor} flex flex-col gap-3.5 pb-12`} aria-labelledby="os">
          <h2 id="os" className="titulo-seccion scroll-mt-4">
            Cuéntanos tu caso.
          </h2>
          <p className="m-0 text-base text-tinta/70">3 preguntas. 1 minuto.</p>
          <MoonOS />
        </section>

        <section className={`${contenedor} flex flex-col gap-3.5 pb-12`} aria-labelledby="letras">
          <h2 id="letras" className="titulo-seccion">
            Sin letras chiquitas.
          </h2>
          <dl className="m-0 grid grid-cols-2 gap-3">
            {datos.map((d) => (
              <div key={d.valor} className="borde sombra flex flex-col-reverse p-3.5">
                <dd className="m-0 mt-1.5 text-sm text-tinta/70">{d.texto}</dd>
                <dt className="text-2xl leading-none font-extrabold tracking-[-0.02em]">{d.valor}</dt>
              </div>
            ))}
          </dl>
        </section>

        <section className={`${contenedor} flex flex-col gap-3.5 pb-12`} aria-labelledby="app">
          <h2 id="app" className="titulo-seccion">
            ¿App? Tú eliges.
          </h2>
          {modalidades.map((m) => (
            <div
              key={m.nombre}
              className={`borde flex items-baseline justify-between gap-3 px-3.5 py-4 ${
                m.acento === "violeta" ? "shadow-[4px_4px_0_var(--color-violeta)]" : "shadow-[4px_4px_0_var(--color-turquesa)]"
              }`}
            >
              <div>
                <h3 className={`m-0 text-[22px] font-extrabold ${m.acento === "violeta" ? "text-violeta" : ""}`}>{m.nombre}</h3>
                <span className="text-[15px]">{m.frase}</span>
              </div>
              <span className="font-bold whitespace-nowrap">{m.precio}</span>
            </div>
          ))}
        </section>

        <section id="contacto" className="bg-violeta text-blanco">
          <div className={`${contenedor} flex flex-col gap-[18px] pt-10 pb-12`}>
            <div className="flex items-center gap-3">
              <div className="grid size-14 shrink-0 place-items-center rounded-[4px] border-2 border-dashed border-blanco text-[10px]">
                [foto]
              </div>
              <span className="text-base">
                Te atiende <strong>Diego Garza</strong>, fundador.
              </span>
            </div>
            <h2 className="m-0 text-[46px] leading-[0.92] font-extrabold tracking-[-0.045em]">¿Despegamos?</h2>
            <a href={waAgendar} target="_blank" rel="noopener noreferrer" className="btn bg-blanco text-tinta">
              Agendar videollamada sin costo
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
