import type { Metadata, Viewport } from "next";
import "@fontsource-variable/epilogue";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.moonlaunch.mx"),
  title: "Moon Launch · Tecnología simple para pymes",
  description:
    "Digitalizamos, automatizamos y analizamos la operación de pymes y emprendedores en México. Calcula en un minuto cuánto te cuesta el caos operativo.",
  keywords: ["transformación digital", "automatización de procesos", "apps a la medida", "Odoo", "pymes México"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: "Moon Launch",
    title: "¿Cuánto te cuesta el caos operativo?",
    description: "Calcula en un minuto cuánto pierde tu negocio cada mes y cómo recuperarlo.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#1f1346",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-MX" className="antialiased">
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
