"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "motion/react";

type Cohete = { id: number; x: number; y: number; deriva: number; giro: number; duracion: number };

function CoheteSVG() {
  return (
    <svg viewBox="0 0 24 44" width="24" height="44" aria-hidden className="overflow-visible">
      {/* llama */}
      <motion.path
        d="M8 33 L12 44 L16 33 Z"
        fill="#48C9B0"
        animate={{ scaleY: [1, 1.5, 1] }}
        transition={{ duration: 0.15, repeat: Infinity }}
        style={{ originY: 0, originX: "50%" }}
      />
      {/* aletas */}
      <path d="M6 22 L1 32 L7 31 Z M18 22 L23 32 L17 31 Z" fill="#683EE6" stroke="#1D1E20" strokeWidth="1.5" strokeLinejoin="round" />
      {/* cuerpo */}
      <path d="M12 1 C18 7 19 15 18 33 L6 33 C5 15 6 7 12 1 Z" fill="#FFFFFF" stroke="#1D1E20" strokeWidth="1.5" strokeLinejoin="round" />
      {/* ventanilla */}
      <circle cx="12" cy="15" r="3.5" fill="#683EE6" stroke="#1D1E20" strokeWidth="1.5" />
    </svg>
  );
}

let siguienteId = 0;

export default function LogoExe() {
  const reducir = useReducedMotion();
  const ref = useRef<HTMLButtonElement>(null);
  const [cohetes, setCohetes] = useState<Cohete[]>([]);
  const [lanzamientos, setLanzamientos] = useState(0);

  const lanzar = useCallback(() => {
    setLanzamientos((n) => n + 1);
    if (reducir || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = r.left + 18 + Math.random() * Math.max(0, r.width - 36);
    setCohetes((c) => [
      ...c.slice(-11), // máximo 12 en pantalla
      {
        id: siguienteId++,
        x,
        y: r.bottom - 10,
        deriva: (Math.random() - 0.5) * 120,
        giro: (Math.random() - 0.5) * 24,
        duracion: 1.1 + Math.random() * 0.6,
      },
    ]);
  }, [reducir]);

  // Un solo despegue al cargar: el momento de entrada del sitio.
  useEffect(() => {
    const t = setTimeout(lanzar, 700);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const quitar = (id: number) => setCohetes((c) => c.filter((k) => k.id !== id));

  return (
    <>
      <motion.button
        ref={ref}
        type="button"
        onClick={lanzar}
        whileTap={{ x: 2, y: 2 }}
        aria-label="Moon Launch. Toca para lanzar un cohete"
        className="group block rounded-[5px] border-2 border-tinta bg-white text-left shadow-[4px_4px_0_var(--color-tinta)] transition-shadow active:shadow-[2px_2px_0_var(--color-tinta)]"
      >
        <span className="flex items-center justify-between gap-6 rounded-t-[3px] border-b-2 border-tinta bg-violeta px-1.5 py-[3px]">
          <span className="font-marca text-[11px] leading-none text-white italic">
            {lanzamientos > 1 ? `moonlaunch.exe (${lanzamientos})` : "moonlaunch.exe"}
          </span>
          <span className="flex gap-[3px]" aria-hidden>
            <i className="size-2 border-[1.5px] border-tinta bg-white" />
            <i className="size-2 border-[1.5px] border-tinta bg-turquesa" />
          </span>
        </span>
        <span className="block px-2.5 pt-1.5 pb-1 font-marca text-[19px] leading-none whitespace-nowrap text-tinta italic [text-shadow:2px_2px_0_var(--color-turquesa)]">
          MOON LAUNCH
        </span>
      </motion.button>

      {cohetes.length > 0 &&
        createPortal(
          <div aria-hidden className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
            {cohetes.map((k) => (
              <motion.div
                key={k.id}
                className="absolute"
                style={{ left: k.x - 12, top: k.y - 44 }}
                initial={{ y: 0, x: 0, rotate: 0, opacity: 1 }}
                animate={{
                  y: -(k.y + 160),
                  x: [0, k.deriva * 0.3, k.deriva],
                  rotate: [0, k.giro, k.giro * 0.5],
                }}
                transition={{ duration: k.duracion, ease: [0.55, 0, 0.75, 0.2] }}
                onAnimationComplete={() => quitar(k.id)}
              >
                <CoheteSVG />
                {/* estela de humo */}
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="absolute left-1/2 block -translate-x-1/2 rounded-full bg-white/70"
                    style={{ top: 48 + i * 12, width: 10 - i * 2, height: 10 - i * 2 }}
                    animate={{ opacity: [0.8, 0], scale: [1, 2.2] }}
                    transition={{ duration: 0.45, repeat: Infinity, delay: i * 0.12 }}
                  />
                ))}
              </motion.div>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
}
