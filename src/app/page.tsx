import Link from "next/link";
import Diagnostico from "@/components/Diagnostico";
import { contacto, linkWhatsApp, pasos, servicios } from "@/lib/site";

function Luna({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={className}>
      <circle cx="16" cy="16" r="13" fill="currentColor" />
      <circle cx="21" cy="12" r="11" fill="var(--color-noche)" />
    </svg>
  );
}

const waHola = linkWhatsApp("Hola Moon Launch, quiero platicar sobre mi negocio.");

export default function Home() {
  return (
    <>
      <header className="bg-noche">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-white">
            <Luna className="size-6 text-turquesa" />
            Moon Launch
          </Link>
          <a
            href={waHola}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/25 px-4 py-2 text-sm font-semibold text-white active:bg-white/10"
          >
            Hablemos
          </a>
        </div>
      </header>

      <main>
        {/* Hero = diagnóstico */}
        <section className="bg-noche pb-16 text-white sm:pb-24">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <h1 className="max-w-3xl pt-8 text-[clamp(2.6rem,11vw,5.5rem)] leading-[0.92] font-extrabold tracking-[-0.045em] sm:pt-14">
              ¿Cuánto te cuesta el caos de tu negocio?
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/75">
              Pedidos por WhatsApp, Excel por todos lados y nadie sabe quién debe. Marca lo que te pasa y en un minuto
              ves cuánto pierdes al mes.
            </p>
            <div className="mt-10 sm:mt-14">
              <Diagnostico />
            </div>
          </div>
        </section>

        {/* Qué hacemos */}
        <section aria-labelledby="que-hacemos" className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <h2 id="que-hacemos" className="max-w-2xl text-[clamp(2rem,7vw,3.5rem)] leading-[0.98] font-extrabold tracking-[-0.035em]">
            Simplificamos la tecnología para pymes y emprendedores.
          </h2>
          <dl className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
            {servicios.map((s) => (
              <div key={s.verbo} className="border-t-2 border-violeta pt-5">
                <dt className="text-2xl font-extrabold tracking-tight text-violeta">{s.verbo}</dt>
                <dd className="mt-3 max-w-sm text-[17px] leading-relaxed text-tinta/75">{s.texto}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Cómo trabajamos: es una secuencia real, por eso va numerada */}
        <section aria-labelledby="como" className="bg-white">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
            <h2 id="como" className="text-[clamp(2rem,7vw,3.5rem)] leading-[0.98] font-extrabold tracking-[-0.035em]">
              Cómo trabajamos
            </h2>
            <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {pasos.map((p, i) => (
                <li key={p.titulo} className="flex gap-4 lg:flex-col">
                  <span className="cifra grid size-11 shrink-0 place-items-center rounded-full bg-violeta text-lg font-extrabold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-xl font-bold tracking-tight">{p.titulo}</h3>
                    <p className="mt-2 text-[16px] leading-relaxed text-tinta/70">{p.texto}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Caso en curso */}
        <section aria-labelledby="caso" className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <p className="text-[15px] font-semibold text-violeta">Proyecto en curso</p>
          <h2 id="caso" className="mt-2 max-w-3xl text-[clamp(2rem,7vw,3.5rem)] leading-[0.98] font-extrabold tracking-[-0.035em]">
            Una fábrica de brownies que dejó el pizarrón.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-tinta/75">
            3,100 brownies al día, pedidos por WhatsApp y la producción en un pizarrón. Les estamos construyendo una app
            para pedidos, fábrica, reparto y cobranza.
          </p>
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl border border-linea bg-white p-6">
              <h3 className="font-bold text-naranja">Antes</h3>
              <ul className="mt-3 grid gap-2 text-[16px] leading-snug text-tinta/75">
                <li>Pedidos capturados de noche, uno por uno</li>
                <li>Cambios de sabor al pasar el pizarrón</li>
                <li>Cajas olvidadas en la mesa de enfriado</li>
                <li>Nadie sabe con certeza quién debe</li>
              </ul>
            </div>
            <div className="rounded-3xl bg-noche p-6 text-white">
              <h3 className="font-bold text-turquesa">Con su app</h3>
              <ul className="mt-3 grid gap-2 text-[16px] leading-snug text-white/85">
                <li>Cada cliente pide desde su propio link</li>
                <li>Charolas, tandas e insumos calculados solos</li>
                <li>Check de carga caja por caja</li>
                <li>Saldo por cliente al día</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-noche text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="text-[clamp(2rem,7vw,3rem)] leading-[0.98] font-extrabold tracking-[-0.035em]">
              Despega tu negocio digitalmente.
            </h2>
            <a
              href={waHola}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex h-14 items-center rounded-2xl bg-turquesa px-7 text-base font-bold text-noche active:bg-white"
            >
              Escríbenos por WhatsApp
            </a>
          </div>
          <address className="grid content-end gap-2 text-[16px] not-italic text-white/75">
            <a href={`tel:+${contacto.whatsapp}`} className="hover:text-white">{contacto.telefonoVisible}</a>
            <a href={`mailto:${contacto.email}`} className="hover:text-white">{contacto.email}</a>
            <span>{contacto.direccion}</span>
          </address>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-6xl items-center gap-2 px-5 py-5 text-sm text-white/45 sm:px-8">
            <Luna className="size-4 text-white/45" />
            Moon Launch, Ciudad de México
          </div>
        </div>
      </footer>
    </>
  );
}
