<template>
  <div class="min-h-screen bg-white" lang="es">

    <a 
      href="#main-content" 
      class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-[#C1272D] text-white px-4 py-2 rounded z-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B1F23]"
    >
      Saltar al contenido principal
    </a>


    <section 
      class="relative h-[350px] sm:h-[450px] md:h-[500px] lg:h-[600px] bg-linear-to-r from-[#C1272D] via-[#A12027] to-[#8B1F23] overflow-hidden"
      aria-labelledby="hero-heading"
      role="banner"
    >

      <div class="absolute inset-0" aria-hidden="true">
        <img 
          src="../assets/GenteCine.jpg" 
          alt=""
          class="w-full h-full object-cover opacity-25 mix-blend-overlay"
          role="presentation"
        />
        <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(circle, white 1px, transparent 1px); background-size: 20px 20px;"></div>
      </div>
      
      <div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
        <div class="max-w-3xl">
          <h1 id="hero-heading" class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-4 sm:mb-6 leading-tight animate-fade-in">
            {{ welcomeTitle }}
          </h1>
          <p class="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-white font-light mb-6 sm:mb-8 animate-fade-in-delay">
            {{ welcomeSubtitle }}
          </p>
          <div class="flex gap-2 sm:gap-4 animate-fade-in-delay-2">

          </div>
        </div>
      </div>
      

      <div class="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
        </svg>
      </div>
    </section>


    <nav 
      class="bg-white border-b border-gray-200 sticky top-16 sm:top-20 z-20 shadow-sm" 
      aria-label="Filtros de películas"
      role="navigation"
    >
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between py-3 sm:py-4">
          <!-- Tabs responsivas -->
          <div class="flex items-center gap-2 sm:gap-4 lg:gap-8 overflow-x-auto scrollbar-hide" role="tablist">
            <button 
              v-for="tab in tabs" 
              :key="tab.id"
              @click="activeTab = tab.id"
              class="font-semibold pb-3 transition-all focus:outline-none px-2 sm:px-3 py-2 whitespace-nowrap text-sm sm:text-base border-0"
              :class="activeTab === tab.id ? 'text-[#C1272D]' : 'text-gray-500 hover:text-gray-700'"
              role="tab"
              :aria-selected="activeTab === tab.id"
              :aria-controls="`panel-${tab.id}`"
              :tabindex="activeTab === tab.id ? 0 : -1"
            >
              {{ tab.label }}
            </button>
          </div>
          

          <div class="hidden md:flex items-center gap-2">
            <span class="text-xs lg:text-sm text-gray-500 mr-2">Vista:</span>
            <button 
              @click="viewMode = 'grid'"
              :class="[
                'p-1.5 lg:p-2 rounded transition-colors',
                viewMode === 'grid' 
                  ? 'bg-red-100' 
                  : 'hover:bg-gray-100'
              ]"
              title="Vista en cuadrícula"
              aria-label="Cambiar a vista en cuadrícula"
            >
              <svg 
                :class="[
                  'w-4 h-4 lg:w-5 lg:h-5',
                  viewMode === 'grid' ? 'text-[#C1272D]' : 'text-gray-400'
                ]" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z"/>
              </svg>
            </button>
            <button 
              @click="viewMode = 'list'"
              :class="[
                'p-1.5 lg:p-2 rounded transition-colors',
                viewMode === 'list' 
                  ? 'bg-red-100' 
                  : 'hover:bg-gray-100'
              ]"
              title="Vista en lista"
              aria-label="Cambiar a vista en lista"
            >
              <svg 
                :class="[
                  'w-4 h-4 lg:w-5 lg:h-5',
                  viewMode === 'list' ? 'text-[#C1272D]' : 'text-gray-400'
                ]" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Filtros para móviles -->
    <div class="md:hidden bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
      <div class="flex items-center justify-between gap-3 mb-3">
        <div class="flex items-center gap-2 sm:gap-3 flex-1">
          <label for="mobile-language-filter" class="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">
            Idioma:
          </label>
          <select 
            id="mobile-language-filter"
            v-model="selectedLanguage"
            class="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C1272D] focus:border-transparent"
          >
            <option value="">Todos ({{ movies.length }})</option>
            <option v-for="language in availableLanguages" :key="language" :value="language">
              {{ language }} ({{ getLanguageCount(language) }})
            </option>
          </select>
          <button
            v-if="selectedLanguage"
            @click="selectedLanguage = ''"
            class="p-1.5 sm:p-2 text-gray-600 hover:text-[#C1272D] border border-gray-300 rounded-lg hover:border-[#C1272D] transition-colors"
            aria-label="Limpiar filtro"
          >
            <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Botones de vista para móviles -->
      <div class="flex items-center justify-between">
        <span class="text-xs sm:text-sm font-medium text-gray-700">Vista:</span>
        <div class="flex items-center gap-1">
          <button 
            @click="viewMode = 'grid'"
            :class="[
              'p-1.5 sm:p-2 rounded transition-colors',
              viewMode === 'grid' 
                ? 'bg-red-100' 
                : 'hover:bg-gray-100'
            ]"
            title="Vista en cuadrícula"
            aria-label="Cambiar a vista en cuadrícula"
          >
            <svg 
              :class="[
                'w-3 h-3 sm:w-4 sm:h-4',
                viewMode === 'grid' ? 'text-[#C1272D]' : 'text-gray-400'
              ]" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z"/>
            </svg>
          </button>
          <button 
            @click="viewMode = 'list'"
            :class="[
              'p-1.5 sm:p-2 rounded transition-colors',
              viewMode === 'list' 
                ? 'bg-red-100' 
                : 'hover:bg-gray-100'
            ]"
            title="Vista en lista"
            aria-label="Cambiar a vista en lista"
          >
            <svg 
              :class="[
                'w-3 h-3 sm:w-4 sm:h-4',
                viewMode === 'list' ? 'text-[#C1272D]' : 'text-gray-400'
              ]" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>


    <main 
      id="cartelera"
      class="container mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10 pb-12 sm:pb-16 grow"
      role="main"
    >
      <!-- Estado de carga -->
      <div 
        v-if="loading" 
        class="flex flex-col items-center justify-center py-20"
        role="status"
        aria-live="polite"
      >
        <svg class="w-16 h-16 text-[#C1272D] animate-spin mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-600 text-lg font-medium">Cargando películas...</p>
      </div>

      <!-- Estado de error -->
      <div 
        v-else-if="error" 
        class="text-center py-20"
        role="alert"
        aria-live="assertive"
      >
        <svg class="w-24 h-24 mx-auto text-red-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <p class="text-red-600 text-lg font-medium mb-2">{{ error }}</p>
        <button
          @click="loadPeliculas"
          class="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-[#C1272D] text-white rounded-lg hover:bg-[#8B1F23] transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          Reintentar
        </button>
      </div>

      <!-- Contenido principal -->
      <template v-else>
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {{ tabs.find((t: any) => t.id === activeTab)?.label }}
            </h2>
            <p class="text-sm sm:text-base text-gray-500">
              {{ filteredMovies.length }} película{{ filteredMovies.length !== 1 ? 's' : '' }} disponible{{ filteredMovies.length !== 1 ? 's' : '' }}
              <span v-if="selectedLanguage" class="text-[#C1272D] font-medium">
                • Filtrando por {{ selectedLanguage }}
              </span>
            </p>
          </div>
        

        <div class="hidden md:flex items-center gap-3 lg:gap-4">
          <select 
            v-model="selectedLanguage"
            class="px-3 lg:px-4 py-2 text-sm lg:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C1272D] focus:border-transparent"
            aria-label="Filtrar películas por idioma"
          >
            <option value="">Todos los idiomas ({{ movies.length }})</option>
            <option v-for="language in availableLanguages" :key="language" :value="language">
              {{ language }} ({{ getLanguageCount(language) }})
            </option>
          </select>
          
          <!-- Botón para limpiar filtro -->
          <button
            v-if="selectedLanguage"
            @click="selectedLanguage = ''"
            class="px-2 lg:px-3 py-2 text-sm text-gray-600 hover:text-[#C1272D] border border-gray-300 rounded-lg hover:border-[#C1272D] transition-colors"
            aria-label="Limpiar filtro de idioma"
          >
            <svg class="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>


      <div 
        :class="[
          'transition-all duration-300',
          viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'
            : 'space-y-3 sm:space-y-4'
        ]"
        role="list"
        :aria-label="`Películas en ${tabs.find((t: any) => t.id === activeTab)?.label}`"
      >
        <Movie 
          v-for="movie in filteredMovies" 
          :key="movie.id"
          :movie="movie"
          :view-mode="viewMode"
          @view-details="handleViewDetails"
        />
      </div>
      

      <div 
        v-if="filteredMovies.length === 0" 
        class="text-center py-12 sm:py-20"
        role="status"
        aria-live="polite"
      >
        <svg class="w-16 h-16 sm:w-24 sm:h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 001 1v14a1 1 0 001 1z"/>
        </svg>
        <p class="text-gray-500 text-base sm:text-lg font-medium mb-2">
          {{ selectedLanguage ? `No hay películas en ${selectedLanguage}` : 'No hay películas disponibles' }}
        </p>
        <p class="text-gray-400 text-sm mb-4 px-4">
          {{ selectedLanguage ? 'Prueba seleccionando otro idioma o ver todas las películas' : 'Vuelve pronto para ver las próximas funciones' }}
        </p>
        <button
          v-if="selectedLanguage"
          @click="selectedLanguage = ''"
          class="inline-flex items-center gap-2 px-4 py-2 bg-[#C1272D] text-white text-sm sm:text-base rounded-lg hover:bg-[#8B1F23] transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
          Ver todas las películas
        </button>
      </div>
      </template>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Movie, { type Movie as MovieType } from '../components/Movie.vue'
import { supabase } from '../lib/supabase'
import { useAuth } from '../composables/useAuth'
import type { Pelicula } from '../interfaces/Pelicula'

const router = useRouter()
const { isAuthenticated, currentUser } = useAuth()

// Computed para el mensaje de bienvenida personalizado
const welcomeTitle = computed(() => {
  if (isAuthenticated.value && currentUser.value?.nombre) {
    return `Hola, ${currentUser.value.nombre}`
  }
  return 'Bienvenido al CineUleam'
})

const welcomeSubtitle = computed(() => {
  if (isAuthenticated.value) {
    return 'disfruta lo mejor de nuestro cine'
  }
  return 'disfruta lo mejor del cine'
})


const tabs = [
  { id: 'billboard', label: 'Cartelera' },
  { id: 'now', label: 'Ahora' }
]

const activeTab = ref('billboard')
const selectedLanguage = ref('')
const viewMode = ref<'grid' | 'list'>('grid')
const movies = ref<MovieType[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

// Función para cargar películas desde Supabase
const loadPeliculas = async () => {
  try {
    loading.value = true
    error.value = null
    
    const { data, error: supabaseError } = await supabase
      .from('pelicula')
      .select(`
        *,
        sala:sala_id (
          id,
          nombre,
          capacidad
        )
      `)
      .order('fecha_hora_proyeccion', { ascending: true })
    
    if (supabaseError) {
      console.error('❌ Error al cargar películas:', supabaseError)
      error.value = 'Error al cargar las películas. Por favor, intenta de nuevo.'
      return
    }
    
    // Mapear los datos de Supabase al tipo MovieType
    movies.value = (data as Pelicula[]) || []
    console.log(`✅ ${movies.value.length} películas cargadas desde Supabase`)
    
    // Debug: Mostrar información de las películas cargadas
    if (movies.value.length > 0) {
      console.log('📽️ Primera película:', movies.value[0])
      console.log('🖼️ URLs de pósters:', movies.value.map(m => ({ 
        nombre: m.nombre, 
        poster: m.url_poster || '❌ SIN PÓSTER' 
      })))
    } else {
      console.warn('⚠️ No hay películas en la base de datos. Ejecuta el script de seed.')
    }
  } catch (err) {
    console.error('❌ Error inesperado:', err)
    error.value = 'Error al cargar las películas.'
  } finally {
    loading.value = false
  }
}

// Cargar películas al montar el componente
onMounted(() => {
  loadPeliculas()
})

// Computed property para obtener idiomas únicos disponibles con conteos
const availableLanguages = computed(() => {
  const languageCounts: { [key: string]: number } = {}
  movies.value.forEach(movie => {
    if (movie.idioma) {
      languageCounts[movie.idioma] = (languageCounts[movie.idioma] || 0) + 1
    }
  })
  return Object.keys(languageCounts).sort()
})

// Función para obtener el conteo de películas por idioma
const getLanguageCount = (language: string) => {
  return movies.value.filter(movie => movie.idioma === language).length
}

const filteredMovies = computed(() => {
  let filtered = movies.value

  // Obtener fecha actual (solo día, sin hora)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Filtrar por tab activo
  if (activeTab.value === 'now') {
    // AHORA: Solo películas de hoy
    filtered = filtered.filter(movie => {
      const movieDate = new Date(movie.fecha_hora_proyeccion)
      movieDate.setHours(0, 0, 0, 0)
      return movieDate.getTime() === today.getTime()
    })
  } else if (activeTab.value === 'billboard') {
    // CARTELERA: Todas las películas de hoy y futuras
    filtered = filtered.filter(movie => {
      const movieDate = new Date(movie.fecha_hora_proyeccion)
      movieDate.setHours(0, 0, 0, 0)
      return movieDate.getTime() >= today.getTime()
    })
  }

  // Filtrar por idioma si se ha seleccionado uno
  if (selectedLanguage.value) {
    filtered = filtered.filter(movie => movie.idioma === selectedLanguage.value)
  }

  return filtered
})


const handleViewDetails = (movie: MovieType) => {
  const movieData = encodeURIComponent(JSON.stringify(movie))
  router.push({
    name: 'movieDetails',
    params: { movie: movieData }
  })
}
</script>

<style scoped>

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.sr-only:focus,
.focus\:not-sr-only:focus {
  position: static;
  width: auto;
  height: auto;
  padding: 0.5rem 1rem;
  margin: 0;
  overflow: visible;
  clip: auto;
  white-space: normal;
}


@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out;
}

.animate-fade-in-delay {
  animation: fade-in 0.8s ease-out 0.2s both;
}

.animate-fade-in-delay-2 {
  animation: fade-in 0.8s ease-out 0.4s both;
}

/* Ocultar scrollbar en navegadores webkit */
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;  /* Chrome, Safari and Opera */
}

@media (prefers-reduced-motion: reduce) {
  .animate-fade-in,
  .animate-fade-in-delay,
  .animate-fade-in-delay-2,
  .animate-bounce {
    animation: none !important;
  }
}
</style>