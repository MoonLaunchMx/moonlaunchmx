import type { MetadataRoute } from "next";

const base = "https://www.moonlaunch.mx";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/servicios", "/casos", "/contacto", "/blog", "/blog/odoo-o-app-propia"].map((ruta) => ({
    url: `${base}${ruta}`,
  }));
}
