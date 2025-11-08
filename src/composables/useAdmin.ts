import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'
import type { Pelicula } from '../interfaces/Pelicula'
import type { Usuario } from '../interfaces/Usuario'
import type { Reserva } from '../interfaces/Reserva'
import type { Sala } from '../interfaces/Sala'

export function useAdmin() {
  // Estado reactivo
  const peliculas = ref<Pelicula[]>([])
  const usuarios = ref<Usuario[]>([])
  const reservas = ref<Reserva[]>([])
  const salas = ref<Sala[]>([])

  // Estados de carga
  const isLoadingPeliculas = ref(false)
  const isLoadingSalas = ref(false)
  const isLoadingStats = ref(false)

  // Estadísticas calculadas
  const totalPeliculas = computed(() => peliculas.value.length)
  const totalUsuarios = computed(() => usuarios.value.length)
  const totalReservas = computed(() => reservas.value.length)
  const totalSalas = computed(() => salas.value.length)

  // ===== FUNCIONES DE CARGA =====

  const loadPeliculas = async () => {
    try {
      isLoadingPeliculas.value = true
      const { data, error } = await supabase
        .from('pelicula')
        .select('*')
        .order('fecha_hora_proyeccion', { ascending: true })

      if (error) throw error
      
      peliculas.value = data || []
    } catch (error) {
      console.error('Error al cargar películas:', error)
      throw error
    } finally {
      isLoadingPeliculas.value = false
    }
  }

  const loadSalas = async () => {
    try {
      isLoadingSalas.value = true
      const { data, error } = await supabase
        .from('sala')
        .select('*')
        .order('nombre', { ascending: true })

      if (error) throw error
      
      salas.value = data || []
    } catch (error) {
      console.error('Error al cargar salas:', error)
      throw error
    } finally {
      isLoadingSalas.value = false
    }
  }

  const loadStats = async () => {
    try {
      isLoadingStats.value = true
      
      // Cargar usuarios
      const { data: usuariosData, error: usuariosError } = await supabase
        .from('usuario')
        .select('*')
      
      if (usuariosError) throw usuariosError
      usuarios.value = usuariosData || []

      // Cargar reservas
      const { data: reservasData, error: reservasError } = await supabase
        .from('reserva')
        .select('*')
      
      if (reservasError) throw reservasError
      reservas.value = reservasData || []

    } catch (error) {
      console.error('Error al cargar estadísticas:', error)
      throw error
    } finally {
      isLoadingStats.value = false
    }
  }

  // ===== OPERACIONES CRUD PELÍCULAS =====

  const createMovie = async (movieData: Partial<Pelicula>) => {
    try {
      const { error } = await supabase
        .from('pelicula')
        .insert({
          nombre: movieData.nombre,
          descripcion: movieData.descripcion,
          url_poster: movieData.url_poster,
          idioma: movieData.idioma,
          fecha_hora_proyeccion: movieData.fecha_hora_proyeccion,
          sala_id: movieData.sala_id
        })

      if (error) throw error
      
      // Recargar las películas
      await loadPeliculas()
      return { success: true }
      
    } catch (error: any) {
      console.error('Error al crear película:', error)
      throw new Error(`No se pudo crear la película: ${error.message || 'Error desconocido'}`)
    }
  }

  const updateMovie = async (id: string, movieData: Partial<Pelicula>) => {
    try {
      const { error } = await supabase
        .from('pelicula')
        .update({
          nombre: movieData.nombre,
          descripcion: movieData.descripcion,
          url_poster: movieData.url_poster,
          idioma: movieData.idioma,
          fecha_hora_proyeccion: movieData.fecha_hora_proyeccion,
          sala_id: movieData.sala_id
        })
        .eq('id', id)

      if (error) throw error
      
      // Recargar las películas
      await loadPeliculas()
      return { success: true }
      
    } catch (error: any) {
      console.error('Error al actualizar película:', error)
      throw new Error(`No se pudo actualizar la película: ${error.message || 'Error desconocido'}`)
    }
  }

  const deleteMovie = async (id: string) => {
    try {
      const { error } = await supabase
        .from('pelicula')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      // Recargar las películas
      await loadPeliculas()
      return { success: true }
      
    } catch (error) {
      console.error('Error al eliminar película:', error)
      throw new Error('No se pudo eliminar la película')
    }
  }

  // ===== OPERACIONES CRUD SALAS =====

  const createSala = async (salaData: Partial<Sala>) => {
    try {
      const { error } = await supabase
        .from('sala')
        .insert({
          nombre: salaData.nombre,
          capacidad: salaData.capacidad
        })

      if (error) throw error
      
      // Recargar las salas
      await loadSalas()
      return { success: true }
      
    } catch (error: any) {
      console.error('Error al crear sala:', error)
      throw new Error(`No se pudo crear la sala: ${error.message || 'Error desconocido'}`)
    }
  }

  const updateSala = async (id: string, salaData: Partial<Sala>) => {
    try {
      const { error } = await supabase
        .from('sala')
        .update({
          nombre: salaData.nombre,
          capacidad: salaData.capacidad
        })
        .eq('id', id)

      if (error) throw error
      
      // Recargar las salas
      await loadSalas()
      return { success: true }
      
    } catch (error: any) {
      console.error('Error al actualizar sala:', error)
      throw new Error(`No se pudo actualizar la sala: ${error.message || 'Error desconocido'}`)
    }
  }

  const deleteSala = async (id: string) => {
    try {
      // Verificar si hay películas usando esta sala
      const { data: peliculasEnSala, error: checkError } = await supabase
        .from('pelicula')
        .select('id')
        .eq('sala_id', id)

      if (checkError) throw checkError

      if (peliculasEnSala && peliculasEnSala.length > 0) {
        throw new Error(`No se puede eliminar la sala porque tiene ${peliculasEnSala.length} película(s) programada(s).`)
      }

      const { error } = await supabase
        .from('sala')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      // Recargar las salas
      await loadSalas()
      return { success: true }
      
    } catch (error: any) {
      console.error('Error al eliminar sala:', error)
      throw new Error(error.message || 'No se pudo eliminar la sala')
    }
  }

  // ===== FUNCIONES DE UTILIDAD =====

  const loadAllData = async () => {
    await Promise.all([
      loadPeliculas(),
      loadSalas(),
      loadStats()
    ])
  }

  const getSalaName = (salaId: string) => {
    const sala = salas.value.find(s => s.id === salaId)
    return sala ? `${sala.nombre} (${sala.capacidad} asientos)` : `Sala: ${salaId}`
  }

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleString('es-ES')
  }

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return ''
    
    // Crear fecha desde el string ISO
    const date = new Date(dateString)
    
    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) return ''
    
    // Formatear para datetime-local input (YYYY-MM-DDTHH:mm)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  return {
    // Estado
    peliculas,
    usuarios,
    reservas,
    salas,
    
    // Estados de carga
    isLoadingPeliculas,
    isLoadingSalas,
    isLoadingStats,
    
    // Estadísticas
    totalPeliculas,
    totalUsuarios,
    totalReservas,
    totalSalas,
    
    // Funciones de carga
    loadPeliculas,
    loadSalas,
    loadStats,
    loadAllData,
    
    // CRUD Películas
    createMovie,
    updateMovie,
    deleteMovie,
    
    // CRUD Salas
    createSala,
    updateSala,
    deleteSala,
    
    // Utilidades
    getSalaName,
    formatDateForDisplay,
    formatDateForInput
  }
}