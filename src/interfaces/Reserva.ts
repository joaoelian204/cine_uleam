export interface Reserva {
  id: string;
  usuario_id: string;
  pelicula_id: string;
  asiento_id: string;
  asiento_numero: string;
  fecha_creacion?: string;
  fecha_reserva?: string;
  asistencia_confirmada: boolean;
  qr_code?: string;
}
