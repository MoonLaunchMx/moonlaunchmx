import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Sitio casi 100% estático: sin caché incremental en R2 por ahora.
export default defineCloudflareConfig({});
