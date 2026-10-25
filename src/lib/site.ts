// Todo el contenido editable del sitio vive aquí.

export const contacto = {
  whatsapp: "525568761133",
  telefonoVisible: "+52 55 6876 1133",
  email: "contacto@moonlaunch.mx",
  direccion: "Anáhuac 6, Roma Sur, CDMX",
};

export function linkWhatsApp(texto: string) {
  return `https://wa.me/${contacto.whatsapp}?text=${encodeURIComponent(texto)}`;
}

export type Dolor = {
  id: string;
  problema: string;
  solucion: string;
  detalle: string;
  /** Horas que pierde a la semana UNA persona del equipo por este problema (estimación conservadora). */
  horasPorPersona: number;
};

export const dolores: Dolor[] = [
  {
    id: "whatsapp",
    problema: "Contestas las mismas preguntas en WhatsApp y redes todo el día",
    solucion: "Chatbot con IA",
    detalle: "Responde precios, horarios y disponibilidad con tu información, y te pasa la conversación cuando hace falta una persona.",
    horasPorPersona: 4,
  },
  {
    id: "excel",
    problema: "Muchas herramientas, muchos Excel y nadie sabe cuál es el bueno",
    solucion: "ERP o app a la medida",
    detalle: "Inventario, ventas, cobranza y producción en un solo lugar. Odoo cuando encaja, app propia cuando no.",
    horasPorPersona: 4,
  },
  {
    id: "seguimiento",
    problema: "Se te van clientes porque nadie les dio seguimiento",
    solucion: "CRM",
    detalle: "Cada prospecto con su siguiente paso y un aviso cuando un cliente lleva semanas sin comprar.",
    horasPorPersona: 2,
  },
  {
    id: "citas",
    problema: "Las citas se agendan en papel o en WhatsApp y se pierden",
    solucion: "Agenda digital",
    detalle: "Tus clientes reservan solos, reciben recordatorio y tú ves el día completo en el celular.",
    horasPorPersona: 2,
  },
  {
    id: "procesos",
    problema: "Cada persona nueva tarda semanas en aprender cómo se hacen las cosas",
    solucion: "Procesos documentados",
    detalle: "Manuales cortos y digitales de cada tarea, para que el conocimiento no se vaya con quien renuncia.",
    horasPorPersona: 1.5,
  },
];

export const servicios = [
  {
    verbo: "Digitalizamos",
    texto: "Implementamos sistemas que trabajan por ti: Odoo, Zoho o una app hecha para tu operación.",
  },
  {
    verbo: "Automatizamos",
    texto: "Conectamos tus herramientas y quitamos las tareas que hoy alguien hace a mano todos los días.",
  },
  {
    verbo: "Analizamos",
    texto: "Convertimos tus datos en números claros: cuánto vendes, cuánto te cuesta y quién te debe.",
  },
];

export const pasos = [
  { titulo: "Diagnóstico", texto: "Una videollamada para entender cómo trabajas hoy y dónde se te va el tiempo." },
  { titulo: "Diseño", texto: "Te mostramos cómo va a funcionar antes de construir. Lo apruebas y se congela el alcance." },
  { titulo: "Construcción por etapas", texto: "Entregamos primero lo que más te duele, para que lo uses desde las primeras semanas." },
  { titulo: "Arranque y soporte", texto: "Capacitamos a tu equipo, trabajamos en paralelo una semana y te acompañamos 30 días." },
];
