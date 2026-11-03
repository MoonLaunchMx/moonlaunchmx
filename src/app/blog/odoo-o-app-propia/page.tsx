import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";

const titulo = "¿Odoo o una app a la medida? Cómo decidir en 5 preguntas";
const resumen =
  "Si tu proceso es común (vender, facturar, controlar inventario), Odoo suele bastar y sale más rápido. Si tu proceso es lo que te hace distinto, una app a la medida te ahorra pelearte con el sistema. Y si son pocas personas, a veces un Google Sheets bien hecho es suficiente.";

export const metadata: Metadata = {
  title: "¿Odoo o app propia?",
  description: resumen,
  alternates: { canonical: "/blog/odoo-o-app-propia" },
  openGraph: { type: "article", title: titulo, description: resumen },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: titulo,
  description: resumen,
  inLanguage: "es-MX",
  author: { "@type": "Person", name: "Diego Garza", jobTitle: "Fundador de Moon Launch" },
  publisher: { "@type": "Organization", name: "Moon Launch", url: "https://www.moonlaunch.mx" },
  mainEntityOfPage: "https://www.moonlaunch.mx/blog/odoo-o-app-propia",
};

const h2 = "mt-7 mb-2.5 text-2xl leading-[1.1] font-extrabold tracking-[-0.02em]";
const p = "m-0 mb-3.5 text-[17px] leading-relaxed";

export default function Articulo() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header volverA={{ href: "/blog", label: "Blog" }} />
      <main>
        <article className="mx-auto max-w-2xl px-4 pt-4 pb-10">
          <div className="mb-3.5 text-[13px] text-tinta/70">6 min de lectura · [fecha]</div>
          <h1 className="m-0 mb-[18px] text-4xl leading-[0.98] font-extrabold tracking-[-0.035em]">{titulo}</h1>

          <div className="borde mb-2 px-3.5 py-4 shadow-[4px_4px_0_var(--color-violeta)]">
            <strong className="mb-1.5 block text-[15px] text-violeta">En corto</strong>
            <p className="m-0 text-base leading-relaxed">{resumen}</p>
          </div>

          <h2 className={h2}>¿Tu proceso es común o es tu ventaja?</h2>
          <p className={p}>
            Odoo trae resuelto lo que hacen casi todas las empresas: ventas, compras, inventario y facturación. Si tu forma de
            trabajar se parece a la de los demás, configurarlo es más rápido y más barato que construir.
          </p>
          <p className={p}>
            Si tu proceso es raro a propósito, porque así le ganas a tu competencia, forzarlo a un sistema estándar te va a
            costar más en parches que una app hecha para ti.
          </p>

          <h2 className={h2}>¿Cuántas personas lo van a usar?</h2>
          <p className={p}>[Sección del artículo: licencias por usuario contra usuarios ilimitados.]</p>

          <h2 className={h2}>¿Qué pasa si no hay señal?</h2>
          <p className={p}>[Sección del artículo: repartidores, fábricas y bodegas sin internet.]</p>

          <div className="mt-7 rounded-[4px] bg-violeta px-4 py-[18px] text-blanco">
            <p className="m-0 mb-3 text-[17px] font-bold">¿No sabes cuál es tu caso? Contesta 5 preguntas y te lo decimos.</p>
            <Link href="/#os" className="btn bg-blanco text-tinta">
              Hacer mi diagnóstico
            </Link>
          </div>

          <h2 className={h2}>Preguntas frecuentes</h2>
          <p className={p}>
            <strong>¿Odoo es gratis?</strong>
            <br />
            [Respuesta corta y precisa.]
          </p>
          <p className={p}>
            <strong>¿Puedo empezar con Sheets y después pasarme a una app?</strong>
            <br />
            [Respuesta corta y precisa.]
          </p>

          <div className="mt-7 flex items-center gap-3.5 border-t-2 border-tinta pt-5">
            <div className="grid size-16 shrink-0 place-items-center rounded-[4px] border-2 border-dashed border-tinta text-center text-[10px] text-tinta/70">
              [foto de Diego]
            </div>
            <p className="m-0 text-[15px] leading-snug">
              <strong>Diego Garza</strong>
              <br />
              Fundador de Moon Launch. Implementa Odoo y construye apps a la medida para pymes en México.
            </p>
          </div>
        </article>
      </main>
    </>
  );
}
