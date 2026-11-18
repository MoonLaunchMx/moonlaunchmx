import Icono from "@/components/Icono";
import { logos } from "@/lib/logos";
import { herramientas } from "@/lib/site";

type Herramienta = (typeof herramientas.lista)[number];

function Marca({ h }: { h: Herramienta }) {
  return (
    <li className="flex shrink-0 flex-col items-center gap-1 px-[18px] lg:px-[30px]">
      <span className="flex h-[34px] items-center gap-2 lg:h-10 lg:gap-2.5">
        {"logo" in h ? (
          <svg viewBox="0 0 24 24" className="size-6 shrink-0 fill-tinta lg:size-7" aria-hidden>
            <path d={logos[h.logo]} />
          </svg>
        ) : (
          <span className="shrink-0 [&>svg]:size-6 lg:[&>svg]:size-7">
            <Icono d={h.icono} color="#1d1e20" grosor={2} />
          </span>
        )}
        <span className="text-[19px] font-bold tracking-[-0.02em] whitespace-nowrap lg:text-2xl">{h.nombre}</span>
      </span>
      <span className="text-[9.5px] font-bold tracking-[0.08em] whitespace-nowrap text-tinta/70 uppercase lg:text-[10.5px]">
        {h.categoria}
      </span>
    </li>
  );
}

/** Banner en blanco y negro que corre solo (aprobado 17 nov 2026). La lista va dos veces para que el giro no se corte. */
export default function Herramientas() {
  return (
    <section
      aria-labelledby="herramientas"
      className="flex flex-col gap-3.5 border-y-2 border-tinta bg-blanco pt-[26px] pb-7 lg:items-center lg:gap-4 lg:pt-[30px] lg:pb-[34px]"
    >
      <h2
        id="herramientas"
        className="m-0 px-4 text-sm font-bold tracking-[0.06em] text-tinta/70 uppercase lg:px-0 lg:tracking-[0.08em]"
      >
        {herramientas.titulo}
      </h2>
      <div className="cinta w-full" tabIndex={0} aria-label={herramientas.titulo}>
        <div className="pista">
          <ul className="m-0 flex list-none p-0">
            {herramientas.lista.map((h) => (
              <Marca key={h.nombre} h={h} />
            ))}
          </ul>
          <ul className="copia m-0 flex list-none p-0" aria-hidden>
            {herramientas.lista.map((h) => (
              <Marca key={h.nombre} h={h} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
