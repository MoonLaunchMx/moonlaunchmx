import type { Metadata } from "next";
import Link from "next/link";
import ContactoForm from "@/components/ContactoForm";
import Header from "@/components/Header";
import Icono from "@/components/Icono";
import { contacto, iconos, linkWhatsApp, waAgendar } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Agenda una videollamada de 45 minutos sin costo. Trabajamos con negocios de todo México.",
  alternates: { canonical: "/contacto" },
};

const opcion = "nin flex items-center gap-3.5 rounded-[6px] bg-blanco p-3.5 text-tinta no-underline";
const ico = "borde grid size-12 shrink-0 place-items-center";

export default function Contacto() {
  return (
    <>
      <Header />
      <main>
        <section className="mx-auto flex max-w-2xl flex-col gap-3.5 px-4 pt-6 pb-8">
          <h1 className="m-0 text-[42px] leading-[0.93] font-extrabold tracking-[-0.045em]">Hablemos de tu operación.</h1>
          <p className="m-0 text-[19px] leading-tight font-semibold">Todo México, por videollamada.</p>
        </section>

        <section className="mx-auto flex max-w-2xl flex-col gap-3.5 px-4 pb-10">
          <Link href="/#os" className={opcion}>
            <span className={`${ico} bg-violeta`}>
              <Icono d={iconos.barras} color="#ffffff" />
            </span>
            <span>
              <strong className="block text-lg">Hacer mi diagnóstico</strong>
              <span className="text-sm text-tinta/70">5 preguntas, 1 minuto.</span>
            </span>
          </Link>
          <a href={linkWhatsApp("Hola Moon Launch")} target="_blank" rel="noopener noreferrer" className={opcion}>
            <span className={`${ico} bg-turquesa`}>
              <Icono d={iconos.chat} color="#1d1e20" />
            </span>
            <span>
              <strong className="block text-lg">Escribir por WhatsApp</strong>
              <span className="text-sm text-tinta/70">{contacto.telefonoVisible} · [horario de respuesta]</span>
            </span>
          </a>
          <a href={waAgendar} target="_blank" rel="noopener noreferrer" className={opcion}>
            <span className={ico}>
              <Icono d={iconos.video} color="#683ee6" />
            </span>
            <span>
              <strong className="block text-lg">Agendar videollamada</strong>
              <span className="text-sm text-tinta/70">45 minutos, sin costo.</span>
            </span>
          </a>
        </section>

        <section className="mx-auto max-w-2xl px-4 pb-12">
          <ContactoForm />
        </section>

        <footer className="bg-tinta text-blanco">
          <address className="mx-auto flex max-w-2xl flex-col gap-1.5 px-4 pt-8 pb-10 text-base leading-normal not-italic">
            <a href={`mailto:${contacto.email}`} className="font-bold text-blanco">
              {contacto.email}
            </a>
            <a href={`tel:+${contacto.whatsapp}`} className="text-blanco">
              {contacto.telefonoVisible}
            </a>
            <span className="opacity-80">{contacto.direccion}</span>
          </address>
        </footer>
      </main>
    </>
  );
}
