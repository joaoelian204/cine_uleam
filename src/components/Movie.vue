<template>
  <!-- Vista en Cuadrícula (Grid) -->
  <article 
    v-if="currentViewMode === 'grid'"
    class="movie-card group relative overflow-hidden rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white focus-within:ring-2 focus-within:ring-[#C1272D] focus-within:ring-offset-2"
    role="article"
    :aria-label="`Película: ${movie.nombre}. ${movie.descripcion || ''}. Idioma: ${movie.idioma || 'No especificado'}`"
    tabindex="0"
    @click="$emit('view-details', movie)"
    @keydown.enter="$emit('view-details', movie)"
    @keydown.space.prevent="$emit('view-details', movie)"
  >

    <div class="relative aspect-2/3 overflow-hidden bg-gray-100">
      <img 
        :src="displayPoster" 
        :alt="`Póster de la película ${movie.nombre}`"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        :class="{ 'opacity-0': !imageLoaded, 'opacity-100': imageLoaded }"
        style="transition: opacity 0.3s ease-in-out;"
        @error="handleImageError"
        @load="handleImageLoad"
        loading="lazy"
        crossorigin="anonymous"
      />
      
      <!-- Indicador de carga -->
      <div v-if="!imageLoaded && !imageError" class="absolute inset-0 flex items-center justify-center bg-gray-200">
        <svg class="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      
      <!-- Overlay de hover (solo se muestra en hover) -->
      <div class="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none"></div>
      

      <div 
        v-if="isNewRelease" 
        class="absolute top-2 sm:top-3 left-2 sm:left-3 bg-[#C1272D] text-white font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs flex items-center gap-1 sm:gap-1.5 shadow-lg z-10 animate-pulse"
        role="status"
        aria-label="Película en estreno"
      >
        <StarIcon class="w-3 h-3 sm:w-3.5 sm:h-3.5" aria-hidden="true" />
        <span class="hidden sm:inline">Estreno</span>
        <span class="sm:hidden">★</span>
      </div>


      <div 
        v-if="movie.idioma" 
        class="absolute top-2 sm:top-3 right-2 sm:right-3 bg-gray-900 bg-opacity-90 text-white font-bold px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded text-xs shadow-lg border border-white border-opacity-20"
        role="note"
        :aria-label="`Idioma: ${movie.idioma}`"
      >
        <span class="hidden sm:inline">{{ movie.idioma }}</span>
        <span class="sm:hidden">{{ movie.idioma.substring(0, 2) }}</span>
      </div>


      <div 
        v-if="movie.sala?.nombre" 
        class="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 bg-[#C1272D] bg-opacity-95 text-white font-semibold px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs shadow-lg"
        role="note"
      >
        <span class="hidden sm:inline">{{ movie.sala.nombre }}</span>
        <span class="sm:hidden">{{ movie.sala.nombre.substring(0, 6) }}</span>
      </div>

    </div>


    <div class="p-3 sm:p-4 bg-white">

      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-medium text-[#C1272D] uppercase tracking-wide flex items-center gap-1">
          <svg class="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <span class="hidden sm:inline">{{ formatDate(movie.fecha_hora_proyeccion) }}</span>
          <span class="sm:hidden">{{ formatDate(movie.fecha_hora_proyeccion).substring(0, 5) }}</span>
        </span>
        <div class="text-xs text-gray-500 font-medium">
          {{ formatTime(movie.fecha_hora_proyeccion) }}
        </div>
      </div>


      <h3 class="text-gray-900 font-bold text-sm sm:text-base mb-2 line-clamp-2 leading-tight group-hover:text-[#C1272D] transition-colors">
        {{ movie.nombre }}
      </h3>

 
      <p v-if="movie.descripcion" class="text-gray-600 text-xs line-clamp-2 mb-3 hidden sm:block">
        {{ movie.descripcion }}
      </p>


      <div class="flex items-center justify-between text-xs text-gray-500 pt-2 sm:pt-3 border-t border-gray-100">
        <span v-if="movie.idioma" class="hidden sm:flex items-center gap-1">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/>
          </svg>
          {{ movie.idioma }}
        </span>
        <button 
          class="text-[#C1272D] font-semibold hover:text-[#8B1F23] transition-colors text-xs sm:text-sm"
          @click.stop="$emit('view-details', movie)"
        >
          <span class="hidden sm:inline">Reservar →</span>
          <span class="sm:hidden">→</span>
        </button>
      </div>
    </div>
  </article>

  <!-- Vista en Lista (List) -->
  <article 
    v-else
    class="movie-card group flex overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer bg-white border border-gray-200 hover:border-[#C1272D] focus-within:ring-2 focus-within:ring-[#C1272D] focus-within:ring-offset-2"
    role="article"
    :aria-label="`Película: ${movie.nombre}. ${movie.descripcion || ''}. Idioma: ${movie.idioma || 'No especificado'}`"
    tabindex="0"
    @click="$emit('view-details', movie)"
    @keydown.enter="$emit('view-details', movie)"
    @keydown.space.prevent="$emit('view-details', movie)"
  >
    <!-- Imagen del póster -->
    <div class="relative w-24 sm:w-32 md:w-40 shrink-0 overflow-hidden bg-gray-100">
      <img 
        :src="displayPoster" 
        :alt="`Póster de la película ${movie.nombre}`"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        @error="handleImageError"
        loading="lazy"
      />
      
      <div 
        v-if="isNewRelease" 
        class="absolute top-1 sm:top-2 left-1 sm:left-2 bg-[#C1272D] text-white font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs flex items-center gap-1 shadow"
        role="status"
        aria-label="Película en estreno"
      >
        <StarIcon class="w-2.5 h-2.5 sm:w-3 sm:h-3" aria-hidden="true" />
        <span class="hidden sm:inline">Estreno</span>
      </div>
    </div>

    <!-- Contenido de la información -->
    <div class="flex-1 p-3 sm:p-4 md:p-6 flex flex-col justify-between">
      <div>
        <!-- Título y badges -->
        <div class="flex items-start justify-between mb-2 sm:mb-3">
          <h3 class="text-base sm:text-lg md:text-xl font-bold text-gray-900 leading-tight flex-1 mr-2 sm:mr-4 group-hover:text-[#C1272D] transition-colors">
            {{ movie.nombre }}
          </h3>
          <div class="flex flex-col gap-1 sm:gap-2 items-end">
            <span 
              v-if="movie.idioma"
              class="bg-gray-100 text-gray-800 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium whitespace-nowrap"
            >
              <span class="hidden sm:inline">{{ movie.idioma }}</span>
              <span class="sm:hidden">{{ movie.idioma.substring(0, 3) }}</span>
            </span>
            <span 
              v-if="movie.sala?.nombre"
              class="bg-[#C1272D] text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium whitespace-nowrap"
            >
              <span class="hidden sm:inline">{{ movie.sala.nombre }}</span>
              <span class="sm:hidden">{{ movie.sala.nombre.substring(0, 6) }}</span>
            </span>
          </div>
        </div>

        <!-- Descripción -->
        <p 
          v-if="movie.descripcion" 
          class="text-gray-600 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3 hidden sm:block"
        >
          {{ movie.descripcion }}
        </p>
      </div>

      <!-- Footer con hora y botón -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 pt-2 sm:pt-4 border-t border-gray-100">
        <div class="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm">
          <span class="flex items-center gap-1 sm:gap-2 text-[#C1272D] font-medium">
            <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            {{ formatTime(movie.fecha_hora_proyeccion) }}
          </span>
          <span class="text-gray-500 text-xs">
            <span class="hidden sm:inline">{{ formatDate(movie.fecha_hora_proyeccion) }}</span>
            <span class="sm:hidden">{{ formatDate(movie.fecha_hora_proyeccion).substring(0, 5) }}</span>
          </span>
        </div>
        
        <button 
          class="text-[#C1272D] hover:text-white hover:bg-[#C1272D] font-medium flex items-center justify-center sm:justify-start gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all border border-[#C1272D] text-xs sm:text-sm"
          aria-label="Ver detalles de la película"
          @click.stop="$emit('view-details', movie)"
        >
          <span class="hidden sm:inline">Reservar</span>
          <span class="sm:hidden">→</span>
          <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { StarIcon } from '@heroicons/vue/24/solid'
import { computed, ref } from 'vue'


export interface Movie {
  id: string // uuid
  nombre: string
  descripcion?: string
  url_poster?: string
  idioma?: string
  fecha_hora_proyeccion: string // timestamp
  sala_id: string // uuid
  sala?: {
    id: string
    nombre: string
    capacidad: number
  }
}


const props = defineProps<{
  movie: Movie
  viewMode?: 'grid' | 'list'
}>()

// Usar 'grid' como valor por defecto si no se especifica
const currentViewMode = computed(() => props.viewMode || 'grid')


defineEmits<{
  'view-details': [movie: Movie]
  'toggle-favorite': [movieId: string, isFavorite: boolean]
}>()


const imageError = ref(false)
const imageLoaded = ref(false)

// Imagen placeholder más atractiva con gradiente del color del cine
const placeholderImage = 'https://placehold.co/300x450/C1272D/ffffff?text=SIN+POSTER'

// Lista de dominios problemáticos conocidos
const problematicDomains = [
  'encrypted-tbn0.gstatic.com',
  'encrypted-tbn1.gstatic.com',
  'encrypted-tbn2.gstatic.com',
  'encrypted-tbn3.gstatic.com'
]

const displayPoster = computed(() => {
  // Si hubo error de carga, usar placeholder
  if (imageError.value) {
    console.warn(`⚠️ Película "${props.movie.nombre}" - Error de carga de imagen, usando placeholder`)
    return placeholderImage
  }
  
  // Si no hay url_poster o está vacía/null, usar placeholder
  if (!props.movie.url_poster || props.movie.url_poster.trim() === '') {
    console.warn(`⚠️ Película "${props.movie.nombre}" sin póster, usando placeholder`)
    return placeholderImage
  }
  
  // Verificar si la URL es de un dominio problemático (Google Images encriptadas)
  const isProblemDomain = problematicDomains.some(domain => 
    props.movie.url_poster?.includes(domain)
  )
  
  if (isProblemDomain) {
    console.warn(`⚠️ Película "${props.movie.nombre}" usa URL de Google Images encriptada, usando placeholder`)
    return placeholderImage
  }
  
  console.log(`✅ Usando póster para "${props.movie.nombre}":`, props.movie.url_poster)
  return props.movie.url_poster
})


const isNewRelease = computed(() => {
  const proyeccionDate = new Date(props.movie.fecha_hora_proyeccion)
  const now = new Date()
  const diffTime = proyeccionDate.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays >= 0 && diffDays <= 7
})


const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  console.error(`❌ Error al cargar imagen para "${props.movie.nombre}":`, {
    url: props.movie.url_poster,
    naturalWidth: img.naturalWidth,
    naturalHeight: img.naturalHeight,
    complete: img.complete
  })
  imageError.value = true
  imageLoaded.value = false
}

const handleImageLoad = (event: Event) => {
  const img = event.target as HTMLImageElement
  console.log(`✅ Imagen cargada exitosamente para "${props.movie.nombre}":`, {
    url: props.movie.url_poster,
    naturalWidth: img.naturalWidth,
    naturalHeight: img.naturalHeight,
    currentSrc: img.currentSrc,
    complete: img.complete
  })
  
  // Verificar si la imagen tiene contenido (no es completamente negra)
  if (img.naturalWidth === 0 || img.naturalHeight === 0) {
    console.warn('⚠️ La imagen no tiene dimensiones válidas')
  }
  
  imageLoaded.value = true
  imageError.value = false
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = { 
    day: '2-digit', 
    month: 'short',
    year: 'numeric'
  }
  return date.toLocaleDateString('es-ES', options)
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  })
}
</script>

<style scoped>
.movie-card {
  border: 1px solid #e5e7eb;
  transform: translateY(0);
}

.movie-card:hover {
  border-color: #C1272D;
  transform: translateY(-8px);
}

.movie-card:focus {
  outline: none;
}


.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}


@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .8;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}


@media (prefers-contrast: high) {
  .movie-card {
    border-width: 3px;
  }
}


@media (prefers-reduced-motion: reduce) {
  .movie-card,
  .movie-card img,
  .movie-card * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
