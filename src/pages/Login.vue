<template>
  <div class="relative min-h-screen flex items-center justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
    <!-- Toast Component -->
    <Toast 
      :show="toastConfig.show" 
      :title="toastConfig.title"
      :message="toastConfig.message"
      :type="toastConfig.type"
      @close="toastConfig.show = false"
    />

    <div class="absolute inset-0 z-0">
      <img 
        src="../assets/GenteCine2.jpg" 
        alt="" 
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-black opacity-60"></div>
    </div>

    <!-- Modal de Recuperación de Contraseña -->
    <div 
      v-if="showResetPassword"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      @click.self="closeResetModal"
    >
      <div class="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 relative">
        <button
          @click="closeResetModal"
          class="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div class="text-center mb-4 sm:mb-6">
          <div class="bg-blue-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <svg class="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Recuperar Contraseña</h3>
          <p class="text-xs sm:text-sm text-gray-600">
            Ingresa tu correo institucional y te enviaremos un enlace para restablecer tu contraseña.
          </p>
        </div>

        <form @submit.prevent="handleResetPassword" class="space-y-3 sm:space-y-4">
          <div>
            <label for="reset-email" class="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Correo Institucional
            </label>
            <input
              id="reset-email"
              v-model="resetEmail"
              type="email"
              required
              class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C1272D] focus:border-transparent"
              placeholder="tu.nombre@live.uleam.edu.ec"
            />
          </div>

          <div v-if="resetSuccess" class="bg-green-50 border border-green-200 rounded-lg p-2 sm:p-3">
            <p class="text-xs sm:text-sm text-green-700 flex items-center gap-2">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              {{ resetSuccess }}
            </p>
          </div>

          <div v-if="resetError" class="bg-red-50 border border-red-200 rounded-lg p-2 sm:p-3">
            <p class="text-xs sm:text-sm text-red-600 flex items-center gap-2">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
              {{ resetError }}
            </p>
          </div>

          <button
            type="submit"
            :disabled="isResetting"
            class="w-full py-2.5 sm:py-3 px-4 bg-[#C1272D] hover:bg-[#8B1F23] text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            <span v-if="!isResetting" class="hidden sm:inline">Enviar Enlace de Recuperación</span>
            <span v-if="!isResetting" class="sm:hidden">Enviar Enlace</span>
            <span v-else class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Enviando...
            </span>
          </button>
        </form>
      </div>
    </div>

    <div class="relative z-10 max-w-md w-full space-y-6 sm:space-y-8 bg-white p-6 sm:p-8 lg:p-10 rounded-xl sm:rounded-2xl shadow-2xl border border-gray-100">
      <div>
        <div class="flex justify-center">
          <div class="bg-[#C1272D] p-3 sm:p-4 rounded-full">
            <svg class="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
        <h2 class="mt-4 sm:mt-6 text-center text-2xl sm:text-3xl font-bold text-gray-900">
          Iniciar Sesión
        </h2>
        <p class="mt-2 text-center text-xs sm:text-sm text-gray-600">
          Ingresa con tu correo institucional ULEAM
        </p>
      </div>

      <form class="mt-6 sm:mt-8 space-y-4 sm:space-y-6" @submit.prevent="handleSubmit">
        <div class="space-y-4 sm:space-y-5">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Correo Institucional
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                id="email"
                v-model="email"
                type="email"
                required
                class="appearance-none relative block w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#C1272D] focus:border-transparent transition-all duration-200"
                :class="emailError ? 'border-red-500' : 'border-gray-300'"
                placeholder="tu.nombre@live.uleam.edu.ec"
                @blur="validateEmail"
                @input="emailError = ''"
              />
            </div>
            <p v-if="emailError" class="mt-1 sm:mt-2 text-xs sm:text-sm text-red-600 flex items-center gap-1">
              <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              {{ emailError }}
            </p>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Contraseña
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="appearance-none relative block w-full pl-9 sm:pl-10 pr-9 sm:pr-10 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#C1272D] focus:border-transparent transition-all duration-200"
                placeholder="••••••••"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg v-if="!showPassword" class="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div v-if="loginError" class="bg-red-50 border border-red-200 rounded-lg p-2 sm:p-3">
          <p class="text-xs sm:text-sm text-red-600 flex items-center gap-2">
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            {{ loginError }}
          </p>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="rememberMe"
              type="checkbox"
              class="h-3 w-3 sm:h-4 sm:w-4 text-[#C1272D] focus:ring-[#C1272D] border-gray-300 rounded cursor-pointer"
            />
            <label for="remember-me" class="ml-2 block text-xs sm:text-sm text-gray-700 cursor-pointer">
              Recordarme
            </label>
          </div>

          <div class="text-xs sm:text-sm">
            <button 
              @click="showResetPassword = true"
              type="button"
              class="font-medium text-[#C1272D] hover:text-[#8B1F23] transition-colors"
            >
              <span class="hidden sm:inline">¿Olvidaste tu contraseña?</span>
              <span class="sm:hidden">¿Olvidaste contraseña?</span>
            </button>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-2.5 sm:py-3 px-4 border border-transparent font-semibold rounded-lg text-white bg-[#C1272D] hover:bg-[#8B1F23] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C1272D] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] text-sm sm:text-base"
          >
            <span v-if="!isLoading" class="text-white font-medium">Iniciar Sesión</span>
            <span v-else class="flex items-center gap-2 text-white">
              <svg class="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Cargando...
            </span>
          </button>
        </div>

        <div class="text-center">
          <p class="text-xs sm:text-sm text-gray-600">
            ¿No tienes una cuenta?
            <router-link to="/registro" class="font-medium text-[#C1272D] hover:text-[#8B1F23] transition-colors">
              Regístrate aquí
            </router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'
import { supabase } from '../lib/supabase'
import Toast from '../components/Toast.vue'

const { login } = useAuth()

const email = ref('')
const password = ref('')
const emailError = ref('')
const loginError = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const isLoading = ref(false)

// Estados para recuperación de contraseña
const showResetPassword = ref(false)
const resetEmail = ref('')
const isResetting = ref(false)
const resetSuccess = ref('')
const resetError = ref('')

// Toast state
const toastConfig = ref({
  show: false,
  title: '',
  message: '',
  type: 'info' as 'success' | 'error' | 'warning' | 'info'
})

const displayToast = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
  toastConfig.value = { show: true, title, message, type }
}

const closeResetModal = () => {
  showResetPassword.value = false
  resetEmail.value = ''
  resetSuccess.value = ''
  resetError.value = ''
}

const handleResetPassword = async () => {
  if (!resetEmail.value) {
    resetError.value = 'Por favor ingresa tu correo electrónico'
    return
  }

  if (!resetEmail.value.endsWith('@live.uleam.edu.ec')) {
    resetError.value = 'Debe usar un correo institucional (@live.uleam.edu.ec)'
    return
  }

  isResetting.value = true
  resetError.value = ''
  resetSuccess.value = ''

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.value, {
      redirectTo: `${window.location.origin}/reset-password`
    })

    if (error) {
      throw error
    }

    resetSuccess.value = '¡Correo enviado! Revisa tu bandeja de entrada.'
    displayToast(
      'Correo Enviado',
      'Revisa tu correo institucional para restablecer tu contraseña',
      'success'
    )

    // Cerrar modal después de 3 segundos
    setTimeout(() => {
      closeResetModal()
    }, 3000)

  } catch (error: any) {
    console.error('Error al solicitar recuperación:', error)
    resetError.value = error.message || 'Error al enviar el correo de recuperación'
    displayToast(
      'Error',
      'No se pudo enviar el correo de recuperación',
      'error'
    )
  } finally {
    isResetting.value = false
  }
}

const validateEmail = () => {
  const emailValue = email.value.trim()
  
  if (!emailValue) {
    emailError.value = 'El correo es requerido'
    return false
  }
  
  const emailRegex = /^[a-zA-Z0-9._-]+@live\.uleam\.edu\.ec$/
  
  if (!emailRegex.test(emailValue)) {
    emailError.value = 'Debe ser un correo institucional válido (@live.uleam.edu.ec)'
    return false
  }
  
  emailError.value = ''
  return true
}

const handleSubmit = async () => {
  if (!validateEmail() || !password.value) {
    return
  }
  
  isLoading.value = true
  loginError.value = ''
  
  try {
    await login(email.value, password.value)
    // La redirección se maneja automáticamente en el composable useAuth
  } catch (error: any) {
    console.error('Error al iniciar sesión:', error)
    
    if (error.message === 'Invalid login credentials') {
      loginError.value = 'Correo o contraseña incorrectos'
    } else if (error.message === 'Email not confirmed') {
      loginError.value = 'Por favor confirma tu correo electrónico'
    } else {
      loginError.value = 'Error al iniciar sesión. Intenta nuevamente.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>