<template>
  <transition name="toast">
    <div
      v-if="show"
      :class="[
        'fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4',
        'backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20',
        'p-5 flex items-start gap-4',
        toastColorClasses
      ]"
    >
      <div class="shrink-0 p-2 rounded-full" :class="iconBgClass">
        <svg
          v-if="type === 'warning'"
          class="w-5 h-5"
          :class="iconColorClass"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <svg
          v-else-if="type === 'success'"
          class="w-5 h-5"
          :class="iconColorClass"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <svg
          v-else-if="type === 'error'"
          class="w-5 h-5"
          :class="iconColorClass"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <svg
          v-else
          class="w-5 h-5"
          :class="iconColorClass"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      
      <div class="flex-1 min-w-0">
        <h3 v-if="title" class="font-bold text-white mb-1 text-sm">
          {{ title }}
        </h3>
        <p class="text-white/90 text-sm leading-relaxed">{{ message }}</p>
      </div>
      
      <button
        @click="close"
        class="shrink-0 p-2 text-white/60 hover:text-white transition-colors rounded-full hover:bg-white/10"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <!-- Barra de progreso -->
      <div
        v-if="duration && duration > 0"
        class="absolute bottom-0 left-0 h-1 bg-white/30 rounded-b-2xl overflow-hidden"
        :style="{ width: '100%' }"
      >
        <div
          class="h-full bg-white/80 transition-all ease-linear"
          :style="{ 
            width: progressWidth + '%',
            transitionDuration: duration + 'ms'
          }"
        ></div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

interface Props {
  show: boolean
  message: string
  title?: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  onClose?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  duration: 4000
})

const emit = defineEmits<{
  close: []
}>()

const progressWidth = ref(100)

// Colores del toast según el tipo
const toastColorClasses = computed(() => {
  const baseClasses = 'bg-gradient-to-br from-opacity-95 to-opacity-90'
  
  switch (props.type) {
    case 'success':
      return `${baseClasses} from-green-500 to-green-600`
    case 'error':
      return `${baseClasses} from-red-500 to-red-600`
    case 'warning':
      return `${baseClasses} from-amber-500 to-orange-600`
    case 'info':
    default:
      return `${baseClasses} from-blue-500 to-blue-600`
  }
})

// Color de fondo del ícono
const iconBgClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'bg-green-400/20'
    case 'error':
      return 'bg-red-400/20'
    case 'warning':
      return 'bg-amber-400/20'
    case 'info':
    default:
      return 'bg-blue-400/20'
  }
})

// Color del ícono
const iconColorClass = computed(() => {
  return 'text-white'
})

const close = () => {
  props.onClose?.()
  emit('close')
}

// Auto-cerrar después de la duración especificada
watch(
  () => props.show,
  (newValue) => {
    if (newValue && props.duration > 0) {
      // Resetear la barra de progreso
      progressWidth.value = 100
      
      // Animar la barra de progreso
      setTimeout(() => {
        progressWidth.value = 0
      }, 50)
      
      // Auto-cerrar
      setTimeout(() => {
        close()
      }, props.duration)
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px) scale(0.9);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px) scale(0.9);
}

.toast-enter-to,
.toast-leave-from {
  opacity: 1;
  transform: translateX(-50%) translateY(0) scale(1);
}
</style>
