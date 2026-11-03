"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "@/components/Logo";
import { menu, waAgendar } from "@/lib/site";

export default function Header({ volverA }: { volverA?: { href: string; label: string } }) {
  const [abierto, setAbierto] = useState(false);
  const ruta = usePathname();

  return (
    <header className="relative mx-auto flex max-w-2xl items-center justify-between px-4 py-3.5">
      <Logo />
      {volverA ? (
        <Link href={volverA.href} className="py-3 text-[15px] font-bold text-violeta">
          ← {volverA.label}
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => setAbierto((v) => !v)}
          aria-expanded={abierto}
          aria-controls="menu-principal"
          className="borde min-h-11 bg-blanco px-3.5 text-[15px] font-bold"
        >
          {abierto ? "Cerrar" : "Menú"}
        </button>
      )}

      {abierto && (
        <nav
          id="menu-principal"
          aria-label="Menú principal"
          className="borde sombra absolute top-[76px] right-4 left-3 z-20 overflow-hidden bg-blanco"
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
