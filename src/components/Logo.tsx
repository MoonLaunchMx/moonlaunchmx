import Link from "next/link";

/** Logo moonlaunch.exe. La interacción con cohetes sigue pendiente de mockup. */
export default function Logo() {
  return (
    <Link
      href="/"
      aria-label="Moon Launch, inicio"
      className="inline-block rounded-[4px] border-2 border-tinta bg-blanco shadow-[3px_3px_0_var(--color-tinta)]"
    >
      <span className="flex items-center justify-between gap-[18px] border-b-2 border-tinta bg-violeta px-1.5 py-[3px] font-marca text-[10px] leading-none text-blanco italic">
        <span>moonlaunch.exe</span>
        <span className="flex items-center gap-[3px]" aria-hidden>
          <i className="block size-[7px] border-[1.5px] border-tinta bg-blanco" />
          <i className="block size-[7px] border-[1.5px] border-tinta bg-turquesa" />
        </span>
      </span>
      <span className="block px-[9px] pt-1.5 pb-1 font-marca text-base leading-none whitespace-nowrap text-tinta italic [text-shadow:2px_2px_0_var(--color-turquesa)]">
        MOON LAUNCH
      </span>
    </Link>
  );
}
