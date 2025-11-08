<template>
  <div class="space-y-4 sm:space-y-6">
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Gestión de Películas</h2>
      <button 
        @click="showCreateForm = true"
        class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm sm:text-base"
      >
        + Nueva Película
      </button>
    </div>

    <!-- Formulario de Crear/Editar Película -->
    <div v-if="showCreateForm || editingMovie" class="bg-white shadow rounded-lg p-4 sm:p-6">
      <h3 class="text-base sm:text-lg font-medium text-gray-900 mb-4">
        {{ editingMovie ? 'Editar Película' : 'Nueva Película' }}
      </h3>
      <form @submit.prevent="submitMovie" class="space-y-4">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Nombre</label>
            <input 
              v-model="movieForm.nombre" 
              type="text" 
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Idioma</label>
            <select 
              v-model="movieForm.idioma" 
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
            >
              <option value="Español">Español</option>
              <option value="Inglés">Inglés</option>
              <option value="Francés">Francés</option>
              <option value="Portugués">Portugués</option>
            </select>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea 
            v-model="movieForm.descripcion" 
            rows="3"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
          ></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Póster de la Película</label>
          <ImageUpload 
            v-model="movieForm.url_poster"
            bucket-name="posters"
            @upload-success="handlePosterUpload"
            @upload-error="handlePosterError"
          />
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Fecha y Hora de Proyección</label>
            <input 
              v-model="movieForm.fecha_hora_proyeccion" 
              type="datetime-local" 
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Sala</label>
            <select 
              v-model="movieForm.sala_id" 
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
            >
              <option value="">Selecciona una sala</option>
              <option v-for="sala in salas" :key="sala.id" :value="sala.id">
                {{ sala.nombre }} ({{ sala.capacidad }} asientos)
              </option>
            </select>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row justify-end gap-3">
          <button 
            type="button" 
            @click="cancelForm"
            class="w-full sm:w-auto order-2 sm:order-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded text-sm sm:text-base"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            class="w-full sm:w-auto order-1 sm:order-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm sm:text-base"
          >
            {{ editingMovie ? 'Actualizar' : 'Crear' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Lista de Películas -->
    <div class="bg-white shadow overflow-hidden rounded-lg">
      <!-- Loading state -->
      <div v-if="isLoadingPeliculas" class="text-center py-8 sm:py-12">
        <div class="inline-flex items-center px-4 py-2 text-sm text-gray-600">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Cargando películas...
        </div>
      </div>
      
      <!-- Lista de películas -->
      <ul v-else-if="peliculas.length > 0" class="divide-y divide-gray-200">
        <li v-for="movie in peliculas" :key="movie.id" class="p-4 sm:px-6 sm:py-4">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div class="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0 flex-1">
              <img 
                v-if="movie.url_poster" 
                :src="movie.url_poster" 
                :alt="movie.nombre"
                class="h-16 w-12 sm:h-20 sm:w-15 object-cover rounded flex-shrink-0"
              >
              <div class="min-w-0 flex-1">
                <div class="text-sm sm:text-base font-medium text-gray-900 truncate">{{ movie.nombre }}</div>
                <div class="text-xs sm:text-sm text-gray-500 mt-1">
                  <div>{{ movie.idioma }} • {{ formatDate(movie.fecha_hora_proyeccion) }}</div>
                  <div class="hidden sm:block">{{ getSalaName(movie.sala_id) }}</div>
                  <div class="sm:hidden">{{ getSalaName(movie.sala_id) }}</div>
                </div>
              </div>
            </div>
            <div class="flex flex-row sm:flex-col lg:flex-row gap-2 flex-shrink-0">
              <button 
                @click="editMovie(movie)"
                class="flex-1 sm:flex-none text-blue-600 hover:text-blue-900 text-sm font-medium px-3 py-1 rounded border border-blue-200 hover:bg-blue-50"
              >
                Editar
              </button>
              <button 
                @click="deleteMovie(movie.id)"
                class="flex-1 sm:flex-none text-red-600 hover:text-red-900 text-sm font-medium px-3 py-1 rounded border border-red-200 hover:bg-red-50"
              >
                Eliminar
              </button>
            </div>
          </div>
        </li>
      </ul>
      
      <!-- Estado vacío -->
      <div v-else class="text-center py-8 sm:py-12">
        <svg class="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1h-1v9a2 2 0 01-2 2H6a2 2 0 01-2-2V7H3a1 1 0 01-1-1V5a1 1 0 011-1h4zM9 3v1h6V3H9z"/>
        </svg>
        <h3 class="text-base sm:text-lg font-medium text-gray-900 mb-2">No hay películas</h3>
        <p class="text-sm sm:text-base text-gray-500 mb-4">Agrega tu primera película para comenzar</p>
        <button 
          @click="showCreateForm = true"
          class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm sm:text-base"
        >
          Crear Primera Película
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ImageUpload from '../ImageUpload.vue'
import { useAdmin } from '../../composables/useAdmin'
import type { Pelicula } from '../../interfaces/Pelicula'
import type { Sala } from '../../interfaces/Sala'

interface Props {
  peliculas: Pelicula[]
  salas: Sala[]
  isLoadingPeliculas: boolean
}

interface Emits {
  (e: 'create-movie', movieData: Partial<Pelicula>): void
  (e: 'update-movie', id: string, movieData: Partial<Pelicula>): void
  (e: 'delete-movie', id: string): void
  (e: 'show-toast', title: string, message: string, type: 'success' | 'error' | 'warning' | 'info'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

// Usar las funciones del composable
const { formatDateForDisplay, formatDateForInput, getSalaName } = useAdmin()

// Estado del componente
const showCreateForm = ref(false)
const editingMovie = ref<Pelicula | null>(null)

// Formulario de película
const movieForm = ref<Partial<Pelicula>>({
  nombre: '',
  descripcion: '',
  url_poster: '',
  idioma: 'Español',
  fecha_hora_proyeccion: '',
  sala_id: ''
})

// Métodos
const formatDate = (dateString: string) => {
  return formatDateForDisplay(dateString)
}

const editMovie = (movie: Pelicula) => {
  editingMovie.value = movie
  movieForm.value = { 
    ...movie,
    // Formatear la fecha correctamente para el input datetime-local
    fecha_hora_proyeccion: formatDateForInput(movie.fecha_hora_proyeccion)
  }
  showCreateForm.value = false
}

const cancelForm = () => {
  showCreateForm.value = false
  editingMovie.value = null
  movieForm.value = {
    nombre: '',
    descripcion: '',
    url_poster: '',
    idioma: 'Español',
    fecha_hora_proyeccion: '',
    sala_id: ''
  }
}

const submitMovie = () => {
  // Preparar los datos del formulario
  const movieData = {
    ...movieForm.value,
    // Asegurar que la fecha esté en formato ISO
    fecha_hora_proyeccion: movieForm.value.fecha_hora_proyeccion 
      ? new Date(movieForm.value.fecha_hora_proyeccion).toISOString()
      : ''
  }
  
  if (editingMovie.value) {
    emit('update-movie', editingMovie.value.id, movieData)
  } else {
    emit('create-movie', movieData)
  }
  cancelForm()
}

const deleteMovie = (id: string) => {
  if (confirm('¿Estás seguro de que quieres eliminar esta película?')) {
    emit('delete-movie', id)
  }
}

// Handlers para el upload de imágenes
const handlePosterUpload = (url: string) => {
  console.log('✅ Póster subido exitosamente:', url)
  movieForm.value.url_poster = url
  emit('show-toast', 'Éxito', 'Imagen subida correctamente', 'success')
}

const handlePosterError = (error: string) => {
  console.error('❌ Error al subir póster:', error)
  emit('show-toast', 'Error', error, 'error')
}
</script>

<style scoped>
input, select, textarea {
  border: 1px solid #d1d5db;
  padding: 0.5rem;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
</style>