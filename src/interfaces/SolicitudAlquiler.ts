export interface SolicitudAlquiler {
  id: string
  nombre_contacto: string
  email_contacto: string
  nombre_organizacion?: string
  tipo_evento: string
  fecha_evento_deseada: string
  hora_inicio_deseada: string
  hora_fin_deseada: string
  mensaje_adicional?: string
  fecha_solicitud: string
  estado: 'pendiente' | 'en_revision' | 'aprobada' | 'rechazada'
  notas_admin?: string
  created_at?: string
  updated_at?: string
}

export interface SolicitudAlquilerFormData {
  nombre_contacto: string
  email_contacto: string
  nombre_organizacion?: string
  tipo_evento: string
  fecha_evento_deseada: string
  hora_inicio_deseada: string
  hora_fin_deseada: string
  mensaje_adicional?: string
}