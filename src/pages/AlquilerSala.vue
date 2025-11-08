<template>
  <div class="min-h-screen bg-gray-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
    <!-- Toast Component -->
    <Toast 
      :show="showToast" 
      :title="toastTitle"
      :message="toastMessage"
      :type="toastType"
      @close="showToast = false"
    />

    <div class="max-w-5xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8 sm:mb-12">
        <div class="bg-[#C1272D] w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
          <svg class="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
        </div>
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
          Alquiler de Salas
        </h1>
        <p class="text-base sm:text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-4">
          ¿Necesitas un espacio para tu evento especial? Nuestras salas de cine están disponibles para 
          <span class="text-[#C1272D] font-semibold">presentaciones corporativas</span>, 
          <span class="text-[#C1272D] font-semibold">conferencias</span>, 
          <span class="text-[#C1272D] font-semibold">eventos académicos</span> y más.
        </p>
      </div>

      <!-- Main Content -->
      <div class="flex justify-center">
        <!-- Form Section Centrada -->
        <div class="w-full max-w-3xl">
          <div class="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 lg:p-10">
            <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 text-center">
              Solicitar Información
            </h2>
            <p class="text-sm sm:text-base lg:text-lg text-gray-600 mb-6 sm:mb-8 lg:mb-10 text-center max-w-2xl mx-auto">
              Completa el siguiente formulario y nos pondremos en contacto contigo en menos de 24 horas.
            </p>

            <form @submit.prevent="submitForm" class="space-y-4 sm:space-y-6">
              <!-- Información de Contacto -->
              <div class="space-y-4 sm:space-y-6">
                <h3 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Información de Contacto
                </h3>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label for="nombre_contacto" class="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Nombre Completo *
                    </label>
                    <input
                      id="nombre_contacto"
                      v-model="formData.nombre_contacto"
                      type="text"
                      required
                      class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C1272D] focus:border-transparent transition-all duration-200"
                      placeholder="Tu nombre completo"
                      :class="{ 'border-red-500': errors.nombre_contacto }"
                    />
                    <p v-if="errors.nombre_contacto" class="mt-1 text-xs sm:text-sm text-red-600">
                      {{ errors.nombre_contacto }}
                    </p>
                  </div>

                  <div>
                    <label for="email_contacto" class="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Correo Electrónico *
                    </label>
                    <input
                      id="email_contacto"
                      v-model="formData.email_contacto"
                      type="email"
                      required
                      class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C1272D] focus:border-transparent transition-all duration-200"
                      placeholder="tu.email@ejemplo.com"
                      :class="{ 'border-red-500': errors.email_contacto }"
                    />
                    <p v-if="errors.email_contacto" class="mt-1 text-xs sm:text-sm text-red-600">
                      {{ errors.email_contacto }}
                    </p>
                  </div>
                </div>

                <div>
                  <label for="nombre_organizacion" class="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Organización / Empresa
                  </label>
                  <input
                    id="nombre_organizacion"
                    v-model="formData.nombre_organizacion"
                    type="text"
                    class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C1272D] focus:border-transparent transition-all duration-200"
                    placeholder="Nombre de tu organización"
                  />
                </div>
              </div>

              <!-- Información del Evento -->
              <div class="space-y-4 sm:space-y-6">
                <h3 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Información del Evento
                </h3>

                <div class="space-y-4 sm:space-y-6">
                  <div>
                    <label for="tipo_evento" class="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Tipo de Evento *
                    </label>
                    <select
                      id="tipo_evento"
                      v-model="formData.tipo_evento"
                      required
                      class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C1272D] focus:border-transparent transition-all duration-200"
                      :class="{ 'border-red-500': errors.tipo_evento }"
                    >
                      <option value="">Selecciona el tipo de evento</option>
                      <option value="conferencia">Conferencia</option>
                      <option value="presentacion_corporativa">Presentación Corporativa</option>
                      <option value="evento_academico">Evento Académico</option>
                      <option value="capacitacion">Capacitación</option>
                      <option value="seminario">Seminario</option>
                      <option value="graduacion">Graduación</option>
                      <option value="evento_social">Evento Social</option>
                      <option value="otro">Otro</option>
                    </select>
                    <p v-if="errors.tipo_evento" class="mt-1 text-xs sm:text-sm text-red-600">
                      {{ errors.tipo_evento }}
                    </p>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                  <div>
                    <label for="fecha_evento_deseada" class="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Fecha Deseada *
                    </label>
                    <input
                      id="fecha_evento_deseada"
                      v-model="formData.fecha_evento_deseada"
                      type="date"
                      :min="minDate"
                      required
                      class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C1272D] focus:border-transparent transition-all duration-200"
                      :class="{ 'border-red-500': errors.fecha_evento_deseada }"
                    />
                    <p v-if="errors.fecha_evento_deseada" class="mt-1 text-xs sm:text-sm text-red-600">
                      {{ errors.fecha_evento_deseada }}
                    </p>
                  </div>

                  <div>
                    <label for="hora_inicio_deseada" class="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Hora Inicio *
                    </label>
                    <input
                      id="hora_inicio_deseada"
                      v-model="formData.hora_inicio_deseada"
                      type="time"
                      required
                      class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C1272D] focus:border-transparent transition-all duration-200"
                      :class="{ 'border-red-500': errors.hora_inicio_deseada }"
                    />
                    <p v-if="errors.hora_inicio_deseada" class="mt-1 text-xs sm:text-sm text-red-600">
                      {{ errors.hora_inicio_deseada }}
                    </p>
                  </div>

                  <div>
                    <label for="hora_fin_deseada" class="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Hora Fin *
                    </label>
                    <input
                      id="hora_fin_deseada"
                      v-model="formData.hora_fin_deseada"
                      type="time"
                      required
                      class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C1272D] focus:border-transparent transition-all duration-200"
                      :class="{ 'border-red-500': errors.hora_fin_deseada }"
                    />
                    <p v-if="errors.hora_fin_deseada" class="mt-1 text-xs sm:text-sm text-red-600">
                      {{ errors.hora_fin_deseada }}
                    </p>
                  </div>
                </div>

                <div>
                  <label for="mensaje_adicional" class="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Mensaje Adicional
                  </label>
                  <textarea
                    id="mensaje_adicional"
                    v-model="formData.mensaje_adicional"
                    rows="4"
                    class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C1272D] focus:border-transparent resize-vertical transition-all duration-200"
                    placeholder="Cuéntanos más detalles sobre tu evento, requerimientos especiales, configuración de equipos, etc."
                  ></textarea>
                  <p class="mt-1 text-xs text-gray-500">
                    Describe cualquier requerimiento especial, configuración de equipos o detalles adicionales sobre tu evento.
                  </p>
                </div>
              </div>

              <!-- Submit Button -->
              <div class="pt-4 sm:pt-6">
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="w-full py-3 sm:py-4 px-6 bg-[#C1272D] hover:bg-[#8B1F23] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  <span v-if="!isSubmitting" class="flex items-center justify-center gap-2">
                    <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                    </svg>
                    Enviar Solicitud
                  </span>
                  <span v-else class="flex items-center justify-center gap-2">
                    <svg class="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                  </span>
                </button>
              </div>

              <div class="text-center text-xs sm:text-sm text-gray-500">
                Al enviar este formulario, nos pondremos en contacto contigo en un plazo máximo de 24 horas.
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'
import type { SolicitudAlquilerFormData } from '../interfaces'
import Toast from '../components/Toast.vue'

const router = useRouter()

// Form data
const formData = ref<SolicitudAlquilerFormData>({
  nombre_contacto: '',
  email_contacto: '',
  nombre_organizacion: '',
  tipo_evento: '',
  fecha_evento_deseada: '',
  hora_inicio_deseada: '',
  hora_fin_deseada: '',
  mensaje_adicional: ''
})

// Form state
const isSubmitting = ref(false)
const errors = ref<Record<string, string>>({})

// Toast state
const showToast = ref(false)
const toastTitle = ref('')
const toastMessage = ref('')
const toastType = ref<'success' | 'error' | 'warning' | 'info'>('info')

// Computed
const minDate = computed(() => {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split('T')[0]
})

// Functions
const displayToast = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
  toastTitle.value = title
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
}

const validateForm = (): boolean => {
  errors.value = {}
  
  // Validaciones básicas
  if (!formData.value.nombre_contacto.trim()) {
    errors.value.nombre_contacto = 'El nombre es requerido'
  }
  
  if (!formData.value.email_contacto.trim()) {
    errors.value.email_contacto = 'El email es requerido'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email_contacto)) {
    errors.value.email_contacto = 'El email no es válido'
  }
  
  if (!formData.value.tipo_evento) {
    errors.value.tipo_evento = 'Selecciona el tipo de evento'
  }
  
  if (!formData.value.fecha_evento_deseada) {
    errors.value.fecha_evento_deseada = 'La fecha es requerida'
  }
  
  if (!formData.value.hora_inicio_deseada) {
    errors.value.hora_inicio_deseada = 'La hora de inicio es requerida'
  }
  
  if (!formData.value.hora_fin_deseada) {
    errors.value.hora_fin_deseada = 'La hora de fin es requerida'
  }
  
  // Validar que hora fin sea después de hora inicio
  if (formData.value.hora_inicio_deseada && formData.value.hora_fin_deseada) {
    if (formData.value.hora_inicio_deseada >= formData.value.hora_fin_deseada) {
      errors.value.hora_fin_deseada = 'La hora de fin debe ser posterior a la hora de inicio'
    }
  }
  
  return Object.keys(errors.value).length === 0
}

const submitForm = async () => {
  if (!validateForm()) {
    displayToast('Error de validación', 'Por favor, corrige los errores en el formulario', 'error')
    return
  }
  
  isSubmitting.value = true
  
  try {
    const solicitud = {
      ...formData.value,
      fecha_solicitud: new Date().toISOString(),
      estado: 'pendiente' as const
    }
    
    const { error } = await supabase
      .from('solicitud_alquiler')
      .insert([solicitud])
    
    if (error) throw error
    
    displayToast(
      '¡Solicitud enviada exitosamente!', 
      'Nos pondremos en contacto contigo en las próximas 24 horas.', 
      'success'
    )
    
    // Reset form
    formData.value = {
      nombre_contacto: '',
      email_contacto: '',
      nombre_organizacion: '',
      tipo_evento: '',
      fecha_evento_deseada: '',
      hora_inicio_deseada: '',
      hora_fin_deseada: '',
      mensaje_adicional: ''
    }
    
    // Redirect after 3 seconds
    setTimeout(() => {
      router.push('/')
    }, 3000)
    
  } catch (error: any) {
    console.error('Error al enviar solicitud:', error)
    displayToast(
      'Error al enviar solicitud', 
      'Ha ocurrido un error. Por favor, intenta de nuevo.', 
      'error'
    )
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* Custom styles for better form UX */
input:focus, select:focus, textarea:focus {
  box-shadow: 0 0 0 3px rgba(193, 39, 45, 0.1);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>