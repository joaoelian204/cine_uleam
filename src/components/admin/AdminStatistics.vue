<template>
  <div class="space-y-6 sm:space-y-8">
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
      <div>
        <h2 class="text-2xl sm:text-3xl font-bold text-gray-900">Estadísticas de Reservas</h2>
        <p class="text-sm sm:text-base text-gray-600 mt-2">Análisis detallado del comportamiento de reservas</p>
      </div>
      <button 
        @click="refreshChart"
        class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg flex items-center justify-center gap-2 shadow-lg transition-all text-sm sm:text-base"
      >
        <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        Actualizar
      </button>
    </div>
    
    <!-- Tarjetas de resumen -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <div class="bg-gradient-to-br from-blue-500 to-blue-600 p-4 sm:p-6 rounded-xl text-white shadow-lg">
        <h4 class="text-blue-100 text-xs sm:text-sm font-medium uppercase tracking-wider">Total de Reservas</h4>
        <p class="text-2xl sm:text-3xl font-bold mt-2">{{ totalReservas }}</p>
        <p class="text-blue-200 text-xs sm:text-sm mt-1">Confirmadas</p>
      </div>
      <div class="bg-gradient-to-br from-green-500 to-green-600 p-4 sm:p-6 rounded-xl text-white shadow-lg">
        <h4 class="text-green-100 text-xs sm:text-sm font-medium uppercase tracking-wider">Idiomas Disponibles</h4>
        <p class="text-2xl sm:text-3xl font-bold mt-2">{{ uniqueLanguages }}</p>
        <p class="text-green-200 text-xs sm:text-sm mt-1">En cartelera</p>
      </div>
      <div class="bg-gradient-to-br from-purple-500 to-purple-600 p-4 sm:p-6 rounded-xl text-white shadow-lg">
        <h4 class="text-purple-100 text-xs sm:text-sm font-medium uppercase tracking-wider">Idioma Más Popular</h4>
        <p class="text-2xl sm:text-3xl font-bold mt-2">{{ mostPopularLanguage }}</p>
        <p class="text-purple-200 text-xs sm:text-sm mt-1">Preferido</p>
      </div>
    </div>

    <!-- Gráfico Principal -->
    <div class="bg-white shadow-xl rounded-2xl overflow-hidden">
      <div class="bg-gradient-to-r from-gray-50 to-white px-4 py-4 sm:px-8 sm:py-6 border-b">
        <h3 class="text-lg sm:text-2xl font-bold text-gray-900">Distribución de Reservas por Idioma</h3>
        <p class="text-sm sm:text-base text-gray-600 mt-1">Visualización de preferencias de idioma de los usuarios</p>
      </div>
      
      <div class="p-4 sm:p-8">
        <div class="flex justify-center items-center">
          <div class="bg-gray-50 rounded-2xl p-4 sm:p-8 shadow-inner w-full overflow-x-auto">
            <div class="min-w-[500px] sm:min-w-0 flex justify-center">
              <canvas 
                ref="chartCanvas" 
                width="700" 
                height="400" 
                class="rounded-xl max-w-full h-auto"
              ></canvas>
            </div>
          </div>
        </div>
        
        <div v-if="!hasReservations" class="text-center py-8 sm:py-12">
          <svg class="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
          <h3 class="text-base sm:text-lg font-medium text-gray-900 mb-2">No hay datos disponibles</h3>
          <p class="text-sm sm:text-base text-gray-500">No hay reservas para mostrar estadísticas</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, watch } from 'vue'
import type { Pelicula } from '../../interfaces/Pelicula'
import type { Reserva } from '../../interfaces/Reserva'

interface Props {
  peliculas: Pelicula[]
  reservas: Reserva[]
}

const props = defineProps<Props>()

// Estadísticas calculadas
const totalReservas = computed(() => props.reservas.length)
const hasReservations = computed(() => props.reservas.length > 0)

const uniqueLanguages = computed(() => {
  const languages = new Set<string>()
  props.reservas.forEach(reserva => {
    const pelicula = props.peliculas.find(p => p.id === reserva.pelicula_id)
    if (pelicula && pelicula.idioma) {
      languages.add(pelicula.idioma)
    }
  })
  return languages.size
})

const mostPopularLanguage = computed(() => {
  const stats: { [key: string]: number } = {}
  props.reservas.forEach(reserva => {
    const pelicula = props.peliculas.find(p => p.id === reserva.pelicula_id)
    if (pelicula && pelicula.idioma) {
      stats[pelicula.idioma] = (stats[pelicula.idioma] || 0) + 1
    }
  })
  
  let maxCount = 0
  let popularLanguage = 'N/A'
  
  Object.entries(stats).forEach(([language, count]) => {
    if (count > maxCount) {
      maxCount = count
      popularLanguage = language
    }
  })
  
  return popularLanguage
})

const chartCanvas = ref<HTMLCanvasElement>()

const drawPieChart = () => {
  if (!chartCanvas.value) return
  
  const ctx = chartCanvas.value.getContext('2d')
  if (!ctx) return

  // Limpiar el canvas
  ctx.clearRect(0, 0, 700, 500)

  // Calcular estadísticas por idioma
  const stats: { [key: string]: number } = {}
  
  props.reservas.forEach(reserva => {
    const pelicula = props.peliculas.find(p => p.id === reserva.pelicula_id)
    if (pelicula && pelicula.idioma) {
      stats[pelicula.idioma] = (stats[pelicula.idioma] || 0) + 1
    }
  })

  const languages = Object.keys(stats)
  const values = Object.values(stats)
  const total = values.reduce((a, b) => a + b, 0)
  
  if (total === 0) {
    ctx.fillStyle = '#6B7280'
    ctx.font = '18px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('No hay datos disponibles', 350, 250)
    return
  }

  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6']
  const centerX = 300  // Movido más a la izquierda para dar espacio a la leyenda
  const centerY = 250
  const radius = 140

  let currentAngle = 0

  // Dibujar las secciones del pastel
  languages.forEach((language, index) => {
    const value = values[index]
    if (value === undefined) return
    
    const sliceAngle = (value / total) * 2 * Math.PI
    
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle)
    ctx.closePath()
    const color = colors[index % colors.length]
    if (color) ctx.fillStyle = color
    ctx.fill()
    
    // Dibujar borde
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 3
    ctx.stroke()
    
    // Dibujar etiquetas
    const labelAngle = currentAngle + sliceAngle / 2
    const labelX = centerX + Math.cos(labelAngle) * (radius * 0.75)
    const labelY = centerY + Math.sin(labelAngle) * (radius * 0.75)
    
    // Solo mostrar etiquetas si el slice es lo suficientemente grande
    if (sliceAngle > 0.3) { // Solo si es mayor a ~17 grados
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 16px Arial'
      ctx.textAlign = 'center'
      ctx.strokeStyle = '#000000'
      ctx.lineWidth = 4
      
      // Idioma
      ctx.strokeText(`${language}`, labelX, labelY - 10)
      ctx.fillText(`${language}`, labelX, labelY - 10)
      
      // Número
      ctx.font = 'bold 20px Arial'
      ctx.strokeText(`${value}`, labelX, labelY + 15)
      ctx.fillText(`${value}`, labelX, labelY + 15)
    }
    
    currentAngle += sliceAngle
  })

  // Dibujar leyenda mejorada
  let legendY = 60
  const legendX = 500  // Movido más a la derecha
  
  // Título de la leyenda
  ctx.fillStyle = '#1F2937'
  ctx.font = 'bold 18px Arial'
  ctx.textAlign = 'left'
  ctx.fillText('Distribución:', legendX, legendY - 25)
  
  languages.forEach((language, index) => {
    const color = colors[index % colors.length]
    const value = values[index]
    if (color && value !== undefined) {
      // Rectángulo de color
      ctx.fillStyle = color
      ctx.fillRect(legendX, legendY - 12, 30, 24)
      
      // Borde del rectángulo
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      ctx.strokeRect(legendX, legendY - 12, 30, 24)
      
      // Texto de la leyenda
      ctx.fillStyle = '#1F2937'
      ctx.font = 'bold 16px Arial'
      ctx.textAlign = 'left'
      const percentage = ((value / total) * 100).toFixed(1)
      ctx.fillText(`${language}:`, legendX + 40, legendY)
      ctx.fillText(`${value} (${percentage}%)`, legendX + 40, legendY + 18)
      
      legendY += 50
    }
  })
}

const refreshChart = () => {
  nextTick(() => {
    drawPieChart()
  })
}

// Watch para redibujar cuando cambien los datos
watch([() => props.reservas, () => props.peliculas], () => {
  nextTick(() => {
    drawPieChart()
  })
}, { deep: true })

onMounted(() => {
  nextTick(() => {
    drawPieChart()
  })
})
</script>