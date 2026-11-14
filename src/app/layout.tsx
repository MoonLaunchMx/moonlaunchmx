import type { Metadata, Viewport } from "next";
import "@fontsource-variable/epilogue";
import "./globals.css";
import Agenda from "@/components/Agenda";
import { contacto } from "@/lib/site";

const descripcion =
  "Automatizamos la operación de distribuidoras, fábricas, comercializadoras y servicios técnicos en México: del pedido al cobro, sin que nada se pierda.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.moonlaunch.mx"),
  title: { default: "Moon Launch · Ordena. Automatiza. Despega.", template: "%s · Moon Launch" },
  description: descripcion,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: "Moon Launch",
    title: "Moon Launch · Ordena. Automatiza. Despega.",
    description: descripcion,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#683ee6",
  width: "device-width",
  initialScale: 1,
};

const organizacion = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Moon Launch",
  url: "https://www.moonlaunch.mx",
  description: descripcion,
  email: contacto.email,
  telephone: `+${contacto.whatsapp}`,
  areaServed: "MX",
  address: { "@type": "PostalAddress", streetAddress: "Anáhuac 6, Roma Sur", addressLocality: "Ciudad de México", addressCountry: "MX" },
  founder: { "@type": "Person", name: "Diego Garza" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-MX" className="antialiased">
      <body className="min-h-dvh">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizacion) }} />
        {children}
        <Agenda />
      </body>
    </html>
  );
}
