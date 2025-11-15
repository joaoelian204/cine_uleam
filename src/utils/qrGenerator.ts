export interface TicketQRData {
  // Identificadores únicos
  reserva_id: string;
  usuario_id: string;
  pelicula_id: string;
  asiento_id: string;

  // Información detallada para mostrar
  usuario_nombre: string;
  usuario_email: string;
  pelicula_nombre: string;
  pelicula_idioma?: string;
  sala_nombre: string;
  asiento_fila: string;
  asiento_numero: number;
  fecha_proyeccion: string;

  // Metadatos del QR
  tipo: "ticket";
  version: "1.0";
  generado_en: string; // ISO timestamp

  // Campo para validación
  checksum?: string;
}

export interface ReservationData {
  id: string;
  usuario_id: string;
  usuario_nombre: string;
  usuario_email: string;
  pelicula_id: string;
  pelicula_nombre: string;
  pelicula_idioma?: string;
  asiento_id: string;
  asiento_fila: string;
  asiento_numero: number;
  sala_nombre: string;
  fecha_proyeccion: string;
}

/**
 * Genera un objeto QR estandarizado para tickets de cine
 */
export const generateTicketQRData = (
  reservationData: ReservationData
): TicketQRData => {
  const qrData: TicketQRData = {
    // IDs únicos para identificación en BD
    reserva_id: reservationData.id,
    usuario_id: reservationData.usuario_id,
    pelicula_id: reservationData.pelicula_id,
    asiento_id: reservationData.asiento_id,

    // Información legible para el usuario
    usuario_nombre: reservationData.usuario_nombre,
    usuario_email: reservationData.usuario_email,
    pelicula_nombre: reservationData.pelicula_nombre,
    pelicula_idioma: reservationData.pelicula_idioma || "No especificado",
    sala_nombre: reservationData.sala_nombre,
    asiento_fila: reservationData.asiento_fila,
    asiento_numero: reservationData.asiento_numero,
    fecha_proyeccion: reservationData.fecha_proyeccion,

    // Metadatos
    tipo: "ticket",
    version: "1.0",
    generado_en: new Date().toISOString(),
  };

  // Generar checksum simple para validación
  qrData.checksum = generateChecksum(qrData);

  return qrData;
};

/**
 * Convierte los datos QR a string JSON
 */
export const generateQRString = (reservationData: ReservationData): string => {
  const qrData = generateTicketQRData(reservationData);
  return JSON.stringify(qrData);
};

/**
 * Valida si un QR escaneado es válido
 */
export const validateQRData = (
  qrString: string
): { isValid: boolean; data?: TicketQRData; error?: string } => {
  try {
    const qrData: TicketQRData = JSON.parse(qrString);

    // Validar campos requeridos
    if (!qrData.reserva_id || !qrData.usuario_id || !qrData.pelicula_id) {
      return { isValid: false, error: "Faltan campos requeridos en el QR" };
    }

    // Validar tipo
    if (qrData.tipo !== "ticket") {
      return { isValid: false, error: "Tipo de QR no válido" };
    }

    // Validar checksum si existe
    if (qrData.checksum) {
      const expectedChecksum = generateChecksum(qrData);
      if (qrData.checksum !== expectedChecksum) {
        return {
          isValid: false,
          error: "Checksum no válido - QR posiblemente corrupto",
        };
      }
    }

    return { isValid: true, data: qrData };
  } catch (error) {
    return { isValid: false, error: "Formato de QR no válido" };
  }
};

/**
 * Genera un checksum simple para validación
 */
function generateChecksum(qrData: TicketQRData): string {
  const dataStr = `${qrData.reserva_id}|${qrData.usuario_id}|${qrData.pelicula_id}|${qrData.asiento_id}`;
  let hash = 0;
  for (let i = 0; i < dataStr.length; i++) {
    const char = dataStr.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
}

/**
 * Formatea la información del ticket para mostrar al usuario
 */
export const formatTicketInfo = (qrData: TicketQRData): string => {
  const fecha = new Date(qrData.fecha_proyeccion).toLocaleString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return `🎬 ${qrData.pelicula_nombre}
🏛️ ${qrData.sala_nombre}
🪑 Asiento ${qrData.asiento_fila}${qrData.asiento_numero}
📅 ${fecha}
👤 ${qrData.usuario_nombre}
📧 ${qrData.usuario_email}
🆔 ${qrData.reserva_id.substring(0, 8)}`;
};

/**
 * Genera un QR de demostración para testing
 */
export const generateDemoQR = (): string => {
  const demoData: ReservationData = {
    id: "demo-123-456-789",
    usuario_id: "user-demo-123",
    usuario_nombre: "Juan Demo",
    usuario_email: "demo@uleam.edu.ec",
    pelicula_id: "movie-demo-456",
    pelicula_nombre: "Avatar: El Camino del Agua",
    pelicula_idioma: "Español",
    asiento_id: "asiento-demo-789",
    asiento_fila: "A",
    asiento_numero: 15,
    sala_nombre: "Sala Premium 1",
    fecha_proyeccion: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Mañana
  };

  return generateQRString(demoData);
};
