export interface Pelicula {
  id: string
  nombre: string
  descripcion?: string
  url_poster?: string
  idioma?: string
  fecha_hora_proyeccion: string
  sala_id: string
  sala?: {
    id: string
    nombre: string
    capacidad: number
  }
}
