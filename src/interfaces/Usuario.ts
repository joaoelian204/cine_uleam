export interface Usuario {
  id: string
  nombre: string
  correo_institucional: string
  tipo: 'estudiante' | 'admin'
}
