"use client";

import { useState } from "react";
import { linkWhatsApp } from "@/lib/site";

const campo = "flex flex-col gap-1.5 text-sm font-semibold";
const input = "borde box-border min-h-12 px-3 py-2.5 text-base font-normal";

/** Arma el mensaje y lo abre en WhatsApp: el sitio todavía no guarda leads. */
export default function ContactoForm() {
  const [nombre, setNombre] = useState("");
  const [contacto, setContacto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (!nombre.trim() || !mensaje.trim()) {
          setError("Escribe tu nombre y qué quieres resolver.");
          return;
        }
        setError("");
        const texto = `Hola Moon Launch, soy ${nombre.trim()}.${contacto.trim() ? ` Mi contacto: ${contacto.trim()}.` : ""}\n${mensaje.trim()}`;
        window.open(linkWhatsApp(texto), "_blank", "noopener,noreferrer");
      }}
      className="borde sombra overflow-hidden"
    >
      <div className="border-b-2 border-tinta bg-violeta px-2.5 py-1.5 font-marca text-[13px] text-blanco italic">mensaje.txt</div>
      <div className="flex flex-col gap-3.5 p-4">
        <label className={campo}>
          Tu nombre
          <input className={input} value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="name" />
        </label>
        <label className={campo}>
          WhatsApp o correo
          <input className={input} value={contacto} onChange={(e) => setContacto(e.target.value)} autoComplete="email" />
        </label>
        <label className={campo}>
          ¿Qué quieres resolver?
          <textarea className={`${input} resize-none`} rows={3} value={mensaje} onChange={(e) => setMensaje(e.target.value)} />
        </label>
        {error && (
          <p role="alert" className="m-0 text-sm font-semibold text-violeta">
            {error}
          </p>
        )}
        <button type="submit" className="btn bg-violeta text-blanco">
          Enviar mensaje
        </button>
      </div>
    </form>
  );
}
