// =============================================================================
// CONFIG ÚNICA del evento. Editar aquí sin tocar componentes.
// Lo marcado TODO lo completa el usuario; NO inventar valores.
// =============================================================================

export const invitacion = {
  // --- Quinceañera ---
  nombre: "Sol Angélica",
  apellidos: "Suárez Osuna",
  nombreCompleto: "Sol Angélica Suárez Osuna",

  // --- Fecha y hora (America/Mexico_City) ---
  // TODO confirmar: el 5 de agosto de 2026 cae MIÉRCOLES.
  fechaISO: "2026-08-05T19:00:00-06:00",
  fechaTexto: "Miércoles 5 de Agosto de 2026",
  horaTexto: "19:00 hrs",

  frase:
    "Con la bendición de Dios y el amor de mi familia, me siento muy feliz al llegar a este momento de mi vida. Los invito a compartir este día tan especial.",

  // --- Padres y padrinos ---
  padres: [
    "Ing. Francisco Suárez Soto",
    "Dra. Itzetl Natxelly Osuna Laparra",
  ],
  padrinosVelacion: [
    "Ing. Oswaldo Osuna Laparra",
    "Sra. Adriana Gordillo Pérez",
  ],
  padrinosBrindis: [
    "Mvz. Rodolfo O. Briones Rodas",
    "L.A.E. Marta Yuri Méndez Barrios",
  ],

  // --- Itinerario --- TODO: confirmar horas exactas.
  itinerario: [
    { hora: "7:00 PM", titulo: "Misa de acción de gracias", icono: "misa" }, // TODO
    { hora: "8:30 PM", titulo: "Recepción", icono: "brindis" }, // TODO
    { hora: "9:00 PM", titulo: "Vals", icono: "vals" }, // TODO
    { hora: "9:30 PM", titulo: "Cena", icono: "cena" }, // TODO
    { hora: "10:30 PM", titulo: "Baile", icono: "baile" }, // TODO
  ],

  // --- Lugares --- TODO: direcciones exactas y links de Google Maps.
  lugares: [
    {
      tipo: "Celebración Religiosa",
      nombre: "Iglesia de San Francisco de Asís",
      direccion: "Av. Galeana No. 9, 30640 Huixtla, Chis.",
      hora: "7:00 PM",
      maps: "https://www.google.com/maps/search/?api=1&query=Parroquia+San+Francisco+de+As%C3%ADs+Huixtla+Chiapas",
    },
    {
      tipo: "Recepción",
      nombre: "Salón Ámbar",
      direccion: "San Francisco, 30640 Huixtla, Chis.",
      hora: "8:30 PM",
      maps: "https://maps.app.goo.gl/GzkCBdDLbN3AzPBX8",
    },
  ],

  // --- Código de vestimenta ---
  vestimenta: "Semiformal",
  vestimentaNota: "Vístete elegante y con estilo, sin llegar a etiqueta rigurosa.",
  colorReservado: { label: "Índigo (color de la quinceañera)", hex: "#1B0980" },

  // --- Mesa de regalos ---
  regalos: {
    texto: "Tu presencia es mi mejor regalo. Si deseas tener un detalle:",
    // Número de evento Liverpool (por si prefieren buscarla a mano).
    eventoLiverpool: "52000058",
    opciones: [
      {
        etiqueta: "Mesa de regalos Liverpool",
        url: "https://mesaderegalos.liverpool.com.mx/milistaderegalos/52000058",
      },
      // TODO opcional: { etiqueta: "Lluvia de sobres", url: "" }
    ] as { etiqueta: string; url: string }[],
  },

  // --- Confirmación ---
  whatsapp: "52TODO", // TODO: 52 + móvil, sin espacios ni símbolos
  fechaLimiteRSVP: "TODO",

  // --- Galería --- TODO: fotos verticales en public/img
  galeria: [] as string[],

  // --- Música --- arranca con el click del sobre, en loop.
  musica: [
    "/music/Chayanne_tiempo_de_vals.mp3",
    // "/music/SEGUNDA_CANCION.mp3", // TODO nombre/archivo
  ],

  // --- Personalización --- "generico" (default) | "porInvitado"
  personalizacion: "generico" as "generico" | "porInvitado",

  // --- Autor / créditos (sello + contacto para contrataciones) ---
  autor: {
    nombre: "Jesús Imanol Castillo Avendaño",
    whatsapp: "5219611798392", // 52 + 1 + 9611798392
    whatsappDisplay: "961 179 8392",
  },
} as const;

export type Invitacion = typeof invitacion;
