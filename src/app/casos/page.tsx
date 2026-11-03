import type { Metadata } from "next";
import CtaFinal from "@/components/CtaFinal";
import Header from "@/components/Header";
import { casos } from "@/lib/site";

export const metadata: Metadata = {
  title: "Casos",
  description: "Negocios que ordenaron su operación con Moon Launch: apps propias, Odoo, Google Sheets y automatizaciones.",
  alternates: { canonical: "/casos" },
};

export default function Casos() {
  return (
    <>
      <Header />
      <main>
        <section className="mx-auto max-w-2xl px-4 pt-6 pb-8">
          <h1 className="m-0 text-[44px] leading-[0.93] font-extrabold tracking-[-0.045em]">Ya despegaron.</h1>
        </section>
        <section className="mx-auto flex max-w-2xl flex-col gap-3.5 px-4 pb-12">
          {casos.map((c) => (
            <article key={c.nombre} className="borde sombra flex flex-col gap-2 bg-blanco px-3.5 py-4">
              <h2 className="m-0 text-xl font-extrabold">{c.nombre}</h2>
              <p className="m-0 text-[15px] leading-snug font-semibold">{c.linea}</p>
              <span className="text-[13px] font-bold text-violeta">{c.herr}</span>
            </article>
          ))}
        </section>
        <CtaFinal titulo="¿Sigues tú?" />
      </main>
    </>
  );
}
