"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "@/components/Logo";
import { menu, waAgendar } from "@/lib/site";

const pildoraBtn = "nin flex min-h-10 items-center rounded-full px-3.5 text-sm font-extrabold";

/** Navbar en píldora flotante arriba (aprobado 2 nov 2026). */
export default function Header({ volverA }: { volverA?: { href: string; label: string } }) {
  const [abierto, setAbierto] = useState(false);
  const ruta = usePathname();

  // iOS solo aplica :active (el "piquete" de los botones) si hay un listener táctil.
  useEffect(() => {
    const nada = () => {};
    document.addEventListener("touchstart", nada, { passive: true });
    return () => document.removeEventListener("touchstart", nada);
  }, []);

  return (
    <header className="sticky top-2.5 z-30 mx-auto mt-2.5 max-w-2xl px-2.5">
      <div className="flex items-center justify-between gap-2 rounded-full border-2 border-tinta bg-blanco py-1.5 pr-1.5 pl-2.5 shadow-[0_4px_0_var(--color-tinta)]">
        <Logo />
        <div className="flex items-center gap-1.5 pb-[5px]">
          <a href={waAgendar} target="_blank" rel="noopener noreferrer" className={`${pildoraBtn} bg-violeta text-blanco`}>
            Agendar
          </a>
          {volverA ? (
            <Link href={volverA.href} className={`${pildoraBtn} bg-blanco text-tinta`}>
              ← {volverA.label}
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setAbierto((v) => !v)}
              aria-expanded={abierto}
              aria-controls="menu-principal"
              className={`${pildoraBtn} bg-blanco text-tinta`}
            >
              {abierto ? "Cerrar" : "Menú"}
            </button>
          )}
        </div>
      </div>

      {abierto && (
        <nav
          id="menu-principal"
          aria-label="Menú principal"
          className="borde sombra absolute top-[calc(100%+10px)] right-2.5 left-2.5 overflow-hidden bg-blanco"
        >
          {menu.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              onClick={() => setAbierto(false)}
              aria-current={ruta === m.href ? "page" : undefined}
              className={`flex min-h-[52px] items-center border-b-[1.5px] border-tinta/20 px-4 text-xl font-extrabold ${
                ruta === m.href ? "text-violeta" : "text-tinta"
              }`}
            >
              {m.label}
            </Link>
          ))}
          <div className="p-3">
            <a href={waAgendar} target="_blank" rel="noopener noreferrer" className="btn bg-violeta text-blanco">
              Agendar videollamada sin costo
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
