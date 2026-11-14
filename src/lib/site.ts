// Todo el texto editable del sitio vive aquí.
// Lo que va entre corchetes [así] está pendiente de Diego y debe llenarse antes de publicar.

export const contacto = {
  whatsapp: "525568761133",
  telefonoVisible: "+52 55 6876 1133",
  email: "contacto@moonlaunch.mx",
  direccion: "Anáhuac 6, Roma Sur, CDMX",
};

export function linkWhatsApp(texto: string) {
  return `https://wa.me/${contacto.whatsapp}?text=${encodeURIComponent(texto)}`;
}

export const waAgendar = linkWhatsApp("Hola Moon Launch, quiero agendar mi videollamada sin costo.");

export const menu = [
  { href: "/", label: "Inicio" },
  { href: "/servicios", label: "Servicios" },
  { href: "/casos", label: "Casos" },
  { href: "/blog", label: "Blog" },
  { href: "/contacto", label: "Contacto" },
];

// Rutas de íconos de línea (viewBox 24x24, trazo 2.2)
export const iconos = {
  chat: "M4 5h16v11H9l-5 4z",
  nota: "M6 2h9l4 4v16H6z M14 2v5h5 M9 13h7 M9 17h5",
  calculadora: "M5 2h14v20H5z M8 6h8v4H8z M8 14h2 M14 14h2 M8 18h2 M14 18h2",
  persona: "M8 8a4 4 0 1 0 8 0a4 4 0 1 0 -8 0 M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6",
  caja: "M3 7l9-4 9 4v10l-9 4-9-4z M3 7l9 4 9-4 M12 11v10",
  billete: "M2 6h20v12H2z M9 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0",
  barras: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  escalera: "M4 20h4v-4h4v-4h4V8h4V4",
  archivo: "M6 2h9l4 4v16H6z M14 2v5h5 M9 13h7 M9 17h5",
  tabla: "M3 4h18v16H3z M3 10h18 M3 15h18 M9 4v16",
  maletin: "M4 7h16v12H4z M9 7V4h6v3",
  engranes: "M7 7h4v4H7z M13 13h4v4h-4z M11 9h4v4",
  celular: "M7 2h10v20H7z M11 18h2",
  video: "M3 6h13v12H3z M16 10l5-3v10l-5-3",
  enviar: "M12 19V5M5 12l7-7 7 7",
};

/** Las piezas del switch "Tu operación / Con Moon Launch". x, y, r = posición regada. */
export const piezas = [
  { caos: "Pedido por WhatsApp", orden: "Pedido en 3 toques", icono: iconos.chat, x: 14, y: 26, r: -8, turquesa: false },
  { caos: "Nota en un papel", orden: "Almacén lo ve al momento", icono: iconos.nota, x: 172, y: 10, r: 6, turquesa: true },
  { caos: "«Mañana te cotizo»", orden: "Cotización en segundos", icono: iconos.calculadora, x: 104, y: 118, r: -13, turquesa: false },
  { caos: "«Pregúntale al jefe»", orden: "Aprobación automática", icono: iconos.persona, x: 6, y: 214, r: 9, turquesa: false },
  { caos: "Caja olvidada", orden: "Entrega revisada", icono: iconos.caja, x: 176, y: 200, r: -5, turquesa: true },
  { caos: "Cobranza tarde", orden: "Cobro a tiempo", icono: iconos.billete, x: 84, y: 318, r: 11, turquesa: false },
];

export const dolores = ["Pedidos perdidos en WhatsApp.", "Cotizaciones que tardan un día.", "Todo pasa por ti."];

export const diagnostico = {
  areas: ["Ventas y pedidos", "Inventario", "Cobranza", "Producción", "Atención a clientes", "Administración"],
  herramientas: ["WhatsApp", "Excel o Sheets", "Papel o pizarrón", "Shopify", "Odoo", "Otra"],
  diasHabiles: 22,
};

/** Calculadora "¿Cuánto te cuesta el caos?" (aprobada 3 nov 2026). Sin IA: la cuenta sale de lo que elige el cliente. */
export const calculadora = {
  areas: ["Pedidos", "Inventario", "Cobranza", "Cotizaciones", "Atención"],
  personas: { min: 1, max: 15, inicial: 3 },
  horas: { min: 0.5, max: 8, paso: 0.5, inicial: 2 },
  costo: { min: 50, max: 400, paso: 10, inicial: 100 },
};

/** Hero (aprobado 13 nov 2026). */
export const hero = {
  titular: ["Ordena.", "Automatiza.", "Despega."],
  subtitulo: "No necesitas saber de tecnología. Nosotros la simplificamos y la ponemos a trabajar en tu negocio.",
};

/**
 * Hero de escritorio "la compu de tu negocio" (aprobado 13 nov 2026). Mockup:
 * https://claude.ai/artifact/NRvvy4x6GpMWkz3uDfNGJv
 * Coordenadas en px de un diseño de 1440 de ancho; el escenario escala con la pantalla.
 */
export const escritorio = {
  carpetas: [
    { id: "ventas", nombre: "Ventas", caos: { x: 1180, y: 18, r: -6 }, orden: { x: 860, y: 90 }, arbol: { x: 758, y: 154 }, gente: ["Vendedores", "Clientes"] },
    { id: "compras", nombre: "Compras", caos: { x: 820, y: 470, r: 8 }, orden: { x: 1100, y: 90 }, arbol: { x: 918, y: 154 }, gente: ["Proveedores", "Tú apruebas"] },
    { id: "inventario", nombre: "Inventario", caos: { x: 1280, y: 400, r: -10 }, orden: { x: 860, y: 330 }, arbol: { x: 1078, y: 154 }, gente: ["Almacén", "Reparto"] },
    { id: "cobranza", nombre: "Cobranza", caos: { x: 610, y: 645, r: 5 }, orden: { x: 1100, y: 330 }, arbol: { x: 1238, y: 154 }, gente: ["Contador", "Bancos"] },
  ],
  archivos: [
    { id: "xls1", nombre: "ventas_FINAL_v3.xlsx", tipo: "XLS", carpeta: "ventas", x: 790, y: 28, r: -8, duda: "¿Esta es la buena o era la v2?" },
    { id: "csv", nombre: "existencias_marzo.csv", tipo: "CSV", carpeta: "inventario", x: 985, y: 10, r: -14, duda: "Es de marzo. ¿Alguien la actualizó?" },
    { id: "sh1", nombre: "Compras 2026", tipo: "SHEETS", carpeta: "compras", x: 975, y: 162, r: 6, duda: "La llenan tres personas. Cada quien a su modo." },
    { id: "xls2", nombre: "inventario copia (2).xlsx", tipo: "XLS", carpeta: "inventario", x: 1130, y: 230, r: -4, duda: "¿Copia de qué? ¿Y dónde quedó la (1)?" },
    { id: "pdf1", nombre: "factura_0031.pdf", tipo: "PDF", carpeta: "cobranza", x: 850, y: 300, r: 12, duda: "¿Ya la pagaron? Toca revisar el banco." },
    { id: "wa", nombre: "pedido WhatsApp.jpg", tipo: "IMG", carpeta: "ventas", x: 1295, y: 190, r: 7, duda: "Una captura de un pedido. Ojalá alguien lo haya anotado." },
    { id: "pdf2", nombre: "estado_de_cuenta.pdf", tipo: "PDF", carpeta: "cobranza", x: 720, y: 420, r: -9, duda: "Lo descargas cada mes, a mano." },
    { id: "doc", nombre: "cotizacion_nueva.docx", tipo: "DOC", carpeta: "ventas", x: 1185, y: 605, r: -12, duda: "Se tardó un día. El cliente ya compró en otro lado." },
    { id: "sh2", nombre: "proveedores", tipo: "SHEETS", carpeta: "compras", x: 930, y: 635, r: 9, duda: "Los teléfonos están en otra hoja. Creo." },
    { id: "nota", nombre: "¡Cobrar el jueves!", tipo: "NOTA", carpeta: "cobranza", x: 1030, y: 460, r: -7, duda: "¿Cuál jueves? ¿A quién?" },
  ],
  arbolLema: "Cada quien ve lo suyo. Lo que se repite entre áreas, se hace solo.",
  /** Ventana tu-negocio.app del paso 3. Datos de ejemplo, nunca de clientes reales. */
  modulos: {
    ventas: {
      titulo: "Pedidos de hoy",
      auto: "Cada pedido de WhatsApp entra aquí solo.",
      filas: [
        { texto: "Pedido 104 · 3 cajas", estado: "listo", tono: "t" },
        { texto: "Pedido 105 · por WhatsApp", estado: "nuevo", tono: "v" },
        { texto: "Cotización enviada", estado: "en 30 s", tono: "b" },
      ],
    },
    compras: {
      titulo: "Proveedores",
      auto: "Al llegar al mínimo, la orden de compra sale sola.",
      filas: [
        { texto: "Materia prima", estado: "se pide el lunes", tono: "b" },
        { texto: "Empaques", estado: "llega mañana", tono: "t" },
        { texto: "Orden 22", estado: "enviada sola", tono: "v" },
      ],
    },
    inventario: {
      titulo: "Existencias",
      auto: "Cada venta descuenta del inventario al momento.",
      filas: [
        { texto: "Producto A · 120 piezas", estado: "bien", tono: "t" },
        { texto: "Producto B · quedan 8", estado: "pedir", tono: "v" },
        { texto: "Producto C · 46 piezas", estado: "bien", tono: "t" },
      ],
    },
    cobranza: {
      titulo: "Quién te debe",
      auto: "Los recordatorios de pago salen solos por WhatsApp.",
      filas: [
        { texto: "Cliente A · vence hoy", estado: "recordatorio enviado", tono: "v" },
        { texto: "Cliente B", estado: "pagado", tono: "t" },
        { texto: "Cliente C · vence el viernes", estado: "en espera", tono: "b" },
      ],
    },
  },
} as const;

/**
 * Agenda "Hablemos" (aprobada 13 nov 2026): el cliente elige día y hora y se abre WhatsApp con el mensaje listo.
 * No revisa la disponibilidad real de Diego; él confirma por WhatsApp. Pendiente: Programa de citas de Google.
 */
export const agenda = {
  boton: "Hablemos",
  titulo: "Agenda tu videollamada",
  nota: "Diagnóstico de 45 min, sin costo. Diego te confirma por WhatsApp.",
  /** [Pendiente de Diego: confirmar horarios reales] Hora de CDMX, lunes a viernes. */
  horas: ["10:00", "11:00", "12:00", "13:00", "16:00", "17:00"],
  diasAdelante: 30,
  mensaje: (nombre: string, negocio: string, fecha: string, hora: string) =>
    `Hola Diego, soy ${nombre}${negocio ? ` de ${negocio}` : ""}. Quisiera agendar una videollamada contigo el ${fecha} a las ${hora} (hora de CDMX).`,
};

/**
 * Sección "Simplificamos". Celular: cada ícono abre su ventana (las líneas con ">" son herramientas).
 * Escritorio: banner con pestañas pegadas a una ventana a todo lo ancho (aprobado 13 nov 2026).
 */
export const simplificamos = [
  {
    nombre: "Digitalizamos",
    lineas: ["Del papel y el Excel", "a un sistema que todos ven.", "", "> Google Sheets", "> Odoo", "> App propia"],
    que: "Del papel y los Excel sueltos a un sistema que todo tu equipo ve.",
    ejemplo: "El inventario que llevabas en un cuaderno pasa a una hoja que todos ven desde el celular.",
    gana: "Nada se pierde y nadie pregunta «¿en qué va?».",
    herramientas: ["Google Sheets", "Odoo", "App propia"],
  },
  {
    nombre: "Automatizamos",
    lineas: ["Lo que hoy alguien copia a mano,", "se hace solo.", "", "> n8n", "> Make", "> WhatsApp Business"],
    que: "Lo que hoy alguien copia y pega todos los días, se hace solo.",
    ejemplo: "Registras una venta y esa pieza se descuenta sola del inventario.",
    gana: "Horas libres cada semana para vender.",
    herramientas: ["n8n", "Make", "WhatsApp Business"],
  },
  {
    nombre: "Analizamos",
    lineas: ["Cuánto vendes, cuánto te cuesta", "y quién te debe.", "", "> Tableros", "> Reportes automáticos"],
    que: "Tus números claros: cuánto vendes, cuánto te cuesta y quién te debe.",
    ejemplo: "Cada lunes te llega un resumen de la semana y lo que falta cobrar.",
    gana: "Decides con datos, no con corazonadas.",
    herramientas: ["Tu Google Sheets o Excel", "Tableros", "Reportes automáticos"],
  },
] as const;

export const niveles = [
  { titulo: "Excel bien hecho", herr: "Google Sheets · Excel" },
  { titulo: "Herramientas listas", herr: "WhatsApp Business · Crisp · Odoo" },
  { titulo: "Automatizaciones", herr: "n8n · Make" },
  { titulo: "App a la medida", herr: "Suscripción o compra" },
];

export const preguntasSugeridas = ["¿Cómo dejo Shopify?", "¿App o Excel?", "¿Cuánto cuesta?"];

export const casosMini = [
  { nombre: "Fábrica de brownies", linea: "Del pizarrón a una app." },
  { nombre: "Renta de montacargas", linea: "Rentas y equipos en Odoo." },
  { nombre: "Salón de belleza", linea: "Corte y nómina que se calculan solos." },
];

export const datos = [
  { valor: "$0", texto: "Diagnóstico de 45 min" },
  { valor: "Meses", texto: "no años, para arrancar" },
  { valor: "Precio fijo", texto: "por etapa" },
  { valor: "Ilimitados", texto: "usuarios, sin cobro extra" },
];

export const modalidades = [
  { nombre: "Suscripción", frase: "Nosotros la mantenemos.", precio: "[$X/mes]", acento: "violeta" as const },
  { nombre: "Compra", frase: "Es tuya.", precio: "[desde $X]", acento: "turquesa" as const },
];

export const soporte = { nombre: "Soporte mensual", frase: "Tu área de sistemas, sin contratarla.", precio: "[$X/mes]" };

export const servicios = [
  { titulo: "Excel que trabaja solo", herr: "Google Sheets · Excel", icono: iconos.tabla, destacado: false },
  { titulo: "Herramientas listas", herr: "WhatsApp Business · Crisp · Odoo", icono: iconos.maletin, destacado: false },
  { titulo: "Cero copiar y pegar", herr: "n8n · Make", icono: iconos.engranes, destacado: false },
  { titulo: "Tu propia app", herr: "Celular, tablet y computadora", icono: iconos.celular, destacado: true },
];

export const dudas = [
  { p: "¿Cuánto cuesta el diagnóstico?", r: "Nada. 45 minutos." },
  { p: "¿Cuánto tarda?", r: "Meses, no años." },
  { p: "¿Cuánto cuesta el proyecto?", r: "Precio fijo por etapa." },
  { p: "¿Fuera de la CDMX?", r: "Sí, todo México." },
];

export const casos = [
  { nombre: "Fábrica de brownies", linea: "Del pizarrón a una app.", herr: "App propia" },
  { nombre: "Renta de montacargas", linea: "Rentas y equipos en un solo lugar.", herr: "Odoo" },
  { nombre: "Salón de belleza", linea: "Corte y nómina que se calculan solos.", herr: "Google Sheets" },
  { nombre: "Tienda con varias marcas", linea: "Cada mensaje llega a quien debe.", herr: "Crisp · Make" },
  { nombre: "Fábrica de tarimas", linea: "[resultado en una línea]", herr: "Odoo" },
];

export const posts = [
  { slug: "odoo-o-app-propia", titulo: "¿Odoo o app propia?", minutos: 6 },
  { slug: null, titulo: "Cómo salir de Shopify", minutos: 5 },
  { slug: null, titulo: "¿Mi Excel ya no da más?", minutos: 4 },
  { slug: null, titulo: "Qué automatizar primero", minutos: 5 },
];
