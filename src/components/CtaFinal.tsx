import { waAgendar } from "@/lib/site";

export default function CtaFinal({ titulo }: { titulo: string }) {
  return (
    <section className="bg-violeta text-blanco">
      <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 pt-10 pb-12">
        <h2 className="m-0 text-4xl leading-[0.95] font-extrabold tracking-[-0.04em]">{titulo}</h2>
        <a href={waAgendar} target="_blank" rel="noopener noreferrer" className="btn bg-blanco text-tinta">
          Agendar videollamada sin costo
        </a>
      </div>
    </section>
  );
}
