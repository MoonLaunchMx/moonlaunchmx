"use client";

import type { CSSProperties } from "react";
import { abrirAgenda } from "@/components/Agenda";
import { agenda } from "@/lib/site";

export function IconoCalendario({ tam }: { tam: string }) {
  return (
    <svg viewBox="0 0 24 24" style={{ width: tam, height: tam }} className="shrink-0" aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="2" fill="#fff" stroke="#1d1e20" strokeWidth="2" />
      <path d="M3 10h18M8 3v4M16 3v4" stroke="#1d1e20" strokeWidth="2" strokeLinecap="round" />
      <rect x="13" y="13" width="4" height="4" fill="#48c9b0" stroke="#1d1e20" strokeWidth="1.5" />
    </svg>
  );
}

/** Botón "Hablemos": abre la agenda. */
export default function BotonHablemos({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <button type="button" onClick={abrirAgenda} aria-haspopup="dialog" className={`btn gap-2 bg-violeta text-blanco ${className}`} style={style}>
      <IconoCalendario tam="20px" />
      {agenda.boton}
    </button>
  );
}
