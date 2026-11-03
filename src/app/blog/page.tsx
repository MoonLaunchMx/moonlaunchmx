import type { Metadata } from "next";
import Link from "next/link";
import CtaFinal from "@/components/CtaFinal";
import Header from "@/components/Header";
import { posts } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog",
  description: "Respuestas cortas a dudas reales sobre Odoo, Excel, automatización y apps para pymes en México.",
  alternates: { canonical: "/blog" },
};

const tarjeta = "borde sombra flex flex-col gap-2 bg-blanco px-3.5 py-4 text-tinta no-underline";

export default function Blog() {
  return (
    <>
      <Header />
      <main>
        <section className="mx-auto flex max-w-2xl flex-col gap-3.5 px-4 pt-6 pb-8">
          <h1 className="m-0 text-[42px] leading-[0.93] font-extrabold tracking-[-0.045em]">Blog</h1>
          <p className="m-0 text-[19px] leading-tight font-semibold">Respuestas cortas a dudas reales.</p>
        </section>
        <section className="mx-auto flex max-w-2xl flex-col gap-3.5 px-4 pb-12">
          {posts.map((p) =>
            p.slug ? (
              <Link key={p.titulo} href={`/blog/${p.slug}`} className={tarjeta}>
                <strong className="text-xl leading-tight">{p.titulo}</strong>
                <span className="text-[13px] text-tinta/70">{p.minutos} min</span>
              </Link>
            ) : (
              <div key={p.titulo} className={`${tarjeta} opacity-60`}>
                <strong className="text-xl leading-tight">{p.titulo}</strong>
                <span className="text-[13px] text-tinta/70">Próximamente</span>
              </div>
            ),
          )}
        </section>
        <CtaFinal titulo="¿Mejor lo vemos con tu caso?" />
      </main>
    </>
  );
}
