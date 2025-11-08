<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 class="text-xl sm:text-2xl font-bold text-gray-900">
            Solicitudes de Alquiler
          </h2>
          <p class="text-sm sm:text-base text-gray-600 mt-1">
            Gestiona las solicitudes de alquiler de salas recibidas
          </p>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-sm text-gray-500">
            Total: {{ solicitudes.length }}
          </span>
          <button
            @click="loadSolicitudes"
            :disabled="isLoading"
            class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            <svg class="w-4 h-4" :class="{ 'animate-spin': isLoading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Actualizar
          </button>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Estado
          </label>
          <select
            v-model="filtroEstado"
            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="en_revision">En Revisión</option>
            <option value="aprobada">Aprobada</option>
            <option value="rechazada">Rechazada</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Evento
          </label>
          <select
            v-model="filtroTipoEvento"
            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los tipos</option>
            <option value="conferencia">Conferencia</option>
            <option value="presentacion_corporativa">Presentación Corporativa</option>
            <option value="evento_academico">Evento Académico</option>
            <option value="capacitacion">Capacitación</option>
            <option value="seminario">Seminario</option>
            <option value="graduacion">Graduación</option>
            <option value="evento_social">Evento Social</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Buscar
          </label>
          <input
            v-model="busqueda"
            type="text"
            placeholder="Nombre, email, organización..."
            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div class="flex items-end">
          <button
            @click="limpiarFiltros"
            class="w-full px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="solicitudesFiltradas.length === 0" class="bg-white rounded-lg shadow-sm p-8 text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No hay solicitudes</h3>
      <p class="mt-1 text-sm text-gray-500">
        {{ solicitudes.length === 0 ? 'No se han recibido solicitudes de alquiler aún.' : 'No hay solicitudes que coincidan con los filtros.' }}
      </p>
    </div>

    <!-- Solicitudes List -->
    <div v-else class="space-y-4">
      <div
        v-for="solicitud in solicitudesFiltradas"
        :key="solicitud.id"
        class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      >
        <div class="p-4 sm:p-6">
          <!-- Header de la solicitud -->
          <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <h3 class="text-lg font-semibold text-gray-900">
                  {{ solicitud.nombre_contacto }}
                </h3>
                <span
                  :class="[
                    'px-2 py-1 text-xs font-medium rounded-full',
                    getEstadoClasses(solicitud.estado)
                  ]"
                >
                  {{ getEstadoLabel(solicitud.estado) }}
                </span>
              </div>
              <div class="text-sm text-gray-600 space-y-1">
                <p>{{ solicitud.email_contacto }}</p>
                <p v-if="solicitud.nombre_organizacion">
                  <span class="font-medium">Organización:</span> {{ solicitud.nombre_organizacion }}
                </p>
              </div>
            </div>
            <div class="text-right text-sm text-gray-500">
              <p>Solicitado el {{ formatDate(solicitud.fecha_solicitud) }}</p>
              <p class="text-xs">{{ formatTime(solicitud.fecha_solicitud) }}</p>
            </div>
          </div>

          <!-- Detalles del evento -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <span class="text-sm font-medium text-gray-700">Tipo de Evento:</span>
              <p class="text-sm text-gray-900 capitalize">{{ formatTipoEvento(solicitud.tipo_evento) }}</p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-700">Fecha Deseada:</span>
              <p class="text-sm text-gray-900">{{ formatDate(solicitud.fecha_evento_deseada) }}</p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-700">Horario:</span>
              <p class="text-sm text-gray-900">
                {{ solicitud.hora_inicio_deseada }} - {{ solicitud.hora_fin_deseada }}
              </p>
            </div>
          </div>

          <!-- Mensaje adicional -->
          <div v-if="solicitud.mensaje_adicional" class="mb-4">
            <span class="text-sm font-medium text-gray-700">Mensaje adicional:</span>
            <p class="text-sm text-gray-900 mt-1 p-3 bg-gray-50 rounded-lg">
              {{ solicitud.mensaje_adicional }}
            </p>
          </div>

          <!-- Notas del admin -->
          <div v-if="solicitud.notas_admin" class="mb-4">
            <span class="text-sm font-medium text-gray-700">Notas del administrador:</span>
            <p class="text-sm text-gray-900 mt-1 p-3 bg-blue-50 rounded-lg">
              {{ solicitud.notas_admin }}
            </p>
          </div>

          <!-- Actions -->
          <div class="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
            <button
              v-if="solicitud.estado === 'pendiente'"
              @click="cambiarEstado(solicitud.id, 'en_revision')"
              class="px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors"
            >
              Marcar en Revisión
            </button>
            
            <button
              v-if="['pendiente', 'en_revision'].includes(solicitud.estado)"
              @click="cambiarEstado(solicitud.id, 'aprobada')"
              class="px-3 py-1.5 text-sm font-medium text-green-700 bg-green-100 hover:bg-green-200 rounded-md transition-colors"
            >
              Aprobar
            </button>
            
            <button
              v-if="['pendiente', 'en_revision'].includes(solicitud.estado)"
              @click="cambiarEstado(solicitud.id, 'rechazada')"
              class="px-3 py-1.5 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-md transition-colors"
            >
              Rechazar
            </button>

            <button
              @click="editarNotas(solicitud)"
              class="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              {{ solicitud.notas_admin ? 'Editar Notas' : 'Agregar Notas' }}
            </button>

            <button
              @click="eliminarSolicitud(solicitud.id)"
              class="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para editar notas -->
    <div
      v-if="showNotasModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          Editar Notas Administrativas
        </h3>
        <textarea
          v-model="notasTemp"
          rows="4"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Agregar notas internas sobre esta solicitud..."
        ></textarea>
        <div class="flex justify-end gap-3 mt-4">
          <button
            @click="cancelarEdicionNotas"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="guardarNotas"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../../lib/supabase'
import type { SolicitudAlquiler } from '../../interfaces'

// Props
defineProps<{}>()

// Emits
const emit = defineEmits<{
  showToast: [title: string, message: string, type: 'success' | 'error' | 'warning' | 'info']
}>()

// State
const solicitudes = ref<SolicitudAlquiler[]>([])
const isLoading = ref(false)
const filtroEstado = ref('')
const filtroTipoEvento = ref('')
const busqueda = ref('')

// Modal state
const showNotasModal = ref(false)
const solicitudEditando = ref<SolicitudAlquiler | null>(null)
const notasTemp = ref('')

// Computed
const solicitudesFiltradas = computed(() => {
  let result = solicitudes.value

  // Filtrar por estado
  if (filtroEstado.value) {
    result = result.filter(s => s.estado === filtroEstado.value)
  }

  // Filtrar por tipo de evento
  if (filtroTipoEvento.value) {
    result = result.filter(s => s.tipo_evento === filtroTipoEvento.value)
  }

  // Filtrar por búsqueda
  if (busqueda.value) {
    const termino = busqueda.value.toLowerCase()
    result = result.filter(s => 
      s.nombre_contacto.toLowerCase().includes(termino) ||
      s.email_contacto.toLowerCase().includes(termino) ||
      (s.nombre_organizacion?.toLowerCase() || '').includes(termino)
    )
  }

  return result.sort((a, b) => new Date(b.fecha_solicitud).getTime() - new Date(a.fecha_solicitud).getTime())
})

// Functions
const loadSolicitudes = async () => {
  isLoading.value = true
  try {
    const { data, error } = await supabase
      .from('solicitud_alquiler')
      .select('*')
      .order('fecha_solicitud', { ascending: false })

    if (error) throw error

    solicitudes.value = data || []
  } catch (error: any) {
    console.error('Error cargando solicitudes:', error)
    emit('showToast', 'Error', 'Error al cargar las solicitudes de alquiler', 'error')
  } finally {
    isLoading.value = false
  }
}

const cambiarEstado = async (id: string, nuevoEstado: string) => {
  try {
    const { error } = await supabase
      .from('solicitud_alquiler')
      .update({ estado: nuevoEstado })
      .eq('id', id)

    if (error) throw error

    // Actualizar localmente
    const solicitud = solicitudes.value.find(s => s.id === id)
    if (solicitud) {
      solicitud.estado = nuevoEstado as any
    }

    emit('showToast', 'Éxito', `Estado cambiado a ${getEstadoLabel(nuevoEstado)}`, 'success')
  } catch (error: any) {
    console.error('Error cambiando estado:', error)
    emit('showToast', 'Error', 'Error al cambiar el estado de la solicitud', 'error')
  }
}

const editarNotas = (solicitud: SolicitudAlquiler) => {
  solicitudEditando.value = solicitud
  notasTemp.value = solicitud.notas_admin || ''
  showNotasModal.value = true
}

const cancelarEdicionNotas = () => {
  showNotasModal.value = false
  solicitudEditando.value = null
  notasTemp.value = ''
}

const guardarNotas = async () => {
  if (!solicitudEditando.value) return

  try {
    const { error } = await supabase
      .from('solicitud_alquiler')
      .update({ notas_admin: notasTemp.value })
      .eq('id', solicitudEditando.value.id)

    if (error) throw error

    // Actualizar localmente
    solicitudEditando.value.notas_admin = notasTemp.value

    emit('showToast', 'Éxito', 'Notas guardadas correctamente', 'success')
    cancelarEdicionNotas()
  } catch (error: any) {
    console.error('Error guardando notas:', error)
    emit('showToast', 'Error', 'Error al guardar las notas', 'error')
  }
}

const eliminarSolicitud = async (id: string) => {
  if (!confirm('¿Estás seguro de que quieres eliminar esta solicitud? Esta acción no se puede deshacer.')) {
    return
  }

  try {
    const { error } = await supabase
      .from('solicitud_alquiler')
      .delete()
      .eq('id', id)

    if (error) throw error

    // Remover localmente
    solicitudes.value = solicitudes.value.filter(s => s.id !== id)

    emit('showToast', 'Éxito', 'Solicitud eliminada correctamente', 'success')
  } catch (error: any) {
    console.error('Error eliminando solicitud:', error)
    emit('showToast', 'Error', 'Error al eliminar la solicitud', 'error')
  }
}

const limpiarFiltros = () => {
  filtroEstado.value = ''
  filtroTipoEvento.value = ''
  busqueda.value = ''
}

// Utility functions
const getEstadoLabel = (estado: string) => {
  const labels: Record<string, string> = {
    pendiente: 'Pendiente',
    en_revision: 'En Revisión',
    aprobada: 'Aprobada',
    rechazada: 'Rechazada'
  }
  return labels[estado] || estado
}

const getEstadoClasses = (estado: string) => {
  const classes: Record<string, string> = {
    pendiente: 'bg-yellow-100 text-yellow-800',
    en_revision: 'bg-blue-100 text-blue-800',
    aprobada: 'bg-green-100 text-green-800',
    rechazada: 'bg-red-100 text-red-800'
  }
  return classes[estado] || 'bg-gray-100 text-gray-800'
}

const formatTipoEvento = (tipo: string) => {
  const tipos: Record<string, string> = {
    conferencia: 'Conferencia',
    presentacion_corporativa: 'Presentación Corporativa',
    evento_academico: 'Evento Académico',
    capacitacion: 'Capacitación',
    seminario: 'Seminario',
    graduacion: 'Graduación',
    evento_social: 'Evento Social',
    otro: 'Otro'
  }
  return tipos[tipo] || tipo
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Lifecycle
onMounted(() => {
  loadSolicitudes()
})
</script>