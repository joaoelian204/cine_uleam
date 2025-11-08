<template>
  <div class="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <!-- Toast Notification -->
    <Toast
      :show="showToast"
      :message="toastMessage"
      :title="toastTitle"
      :type="toastType"
      @close="showToast = false"
    />

    <div class="absolute inset-0 z-0">
      <img 
        src="../assets/GenteCine2.jpg" 
        alt="" 
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-black opacity-60"></div>
    </div>

    <div class="relative z-10 max-w-md w-full space-y-6 bg-white p-8 rounded-2xl shadow-2xl border border-gray-100">
      <div>
        <div class="flex justify-center">
          <div class="bg-[#C1272D] p-3 rounded-full">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
        </div>
        <h2 class="mt-4 text-center text-2xl font-bold text-gray-900">
          Registrarse
        </h2>
        <p class="mt-1 text-center text-sm text-gray-600">
          Crea tu cuenta con tu correo institucional ULEAM
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="mt-6 space-y-4">
        <div class="space-y-3">
          <label
            for="fullName"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Nombres Completos
          </label>
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <svg
                class="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <input
              id="fullName"
              v-model="formData.fullName"
              type="text"
              class="appearance-none relative block w-full pl-10 pr-3 py-2.5 border rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#C1272D] focus:border-transparent transition-all duration-200"
              :class="errors.fullName ? 'border-red-500' : 'border-gray-300'"
              placeholder="Juan Pérez García"
            />
          </div>
          <p v-if="errors.fullName" class="mt-1 text-sm text-red-600 flex items-center gap-1">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            {{ errors.fullName }}
          </p>
        </div>

        <div>
          <label
            for="email"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Correo Institucional
          </label>
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <svg
                class="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              class="appearance-none relative block w-full pl-10 pr-3 py-2.5 border rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#C1272D] focus:border-transparent transition-all duration-200"
              :class="errors.email ? 'border-red-500' : 'border-gray-300'"
              placeholder="tu.nombre@live.uleam.edu.ec"
            />
          </div>
          <p v-if="errors.email" class="mt-1 text-sm text-red-600 flex items-center gap-1">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            {{ errors.email }}
          </p>
        </div>

        <div>
          <label
            for="password"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Contraseña
          </label>
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <svg
                class="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <input
              id="password"
              v-model="formData.password"
              :type="showPassword ? 'text' : 'password'"
              class="appearance-none relative block w-full pl-10 pr-10 py-2.5 border rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#C1272D] focus:border-transparent transition-all duration-200"
              :class="errors.password ? 'border-red-500' : 'border-gray-300'"
              placeholder="••••••••"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                v-if="!showPassword"
                class="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <svg
                v-else
                class="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
            </button>
          </div>
          <p v-if="errors.password" class="mt-1 text-sm text-red-600 flex items-center gap-1">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            {{ errors.password }}
          </p>
        </div>

        <div>
          <label
            for="confirmPassword"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Validación de Contraseña
          </label>
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <svg
                class="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <input
              id="confirmPassword"
              v-model="formData.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              class="appearance-none relative block w-full pl-10 pr-10 py-2.5 border rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#C1272D] focus:border-transparent transition-all duration-200"
              :class="
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              "
              placeholder="••••••••"
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                v-if="!showConfirmPassword"
                class="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <svg
                v-else
                class="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
            </button>
          </div>
          <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600 flex items-center gap-1">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            {{ errors.confirmPassword }}
          </p>
        </div>

        <div v-if="registerError" class="bg-red-50 border border-red-200 rounded-lg p-3">
          <p class="text-sm text-red-600 flex items-center gap-2">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            {{ registerError }}
          </p>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-2.5 px-4 border border-transparent font-semibold rounded-lg text-white bg-[#C1272D] hover:bg-[#8B1F23] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C1272D] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            <span v-if="!isLoading" class="text-white font-medium">Registrarse</span>
            <span v-else class="flex items-center gap-2 text-white">
              <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creando cuenta...
            </span>
          </button>
        </div>

        <div class="text-center">
          <p class="text-sm text-gray-600">
            ¿Ya tienes una cuenta?
            <router-link
              to="/login"
              class="font-medium text-[#C1272D] hover:text-[#8B1F23] transition-colors"
            >
              Iniciar Sesión
            </router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from '../composables/useAuth'
import Toast from '../components/Toast.vue'


const router = useRouter();
const { register } = useAuth()

const formData = reactive({
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const errors = reactive({
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const showPassword = ref(false);
const showConfirmPassword = ref(false);
const isLoading = ref(false);
const registerError = ref('');

// Toast notification state
const showToast = ref(false)
const toastMessage = ref('')
const toastTitle = ref('')
const toastType = ref<'success' | 'error' | 'warning' | 'info'>('info')

// Función para mostrar notificaciones toast
const displayToast = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
  toastTitle.value = title
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
}

const validateFullName = (): boolean => {
  if (!formData.fullName.trim()) {
    errors.fullName = "El nombre completo es requerido";
    return false;
  }
  if (formData.fullName.trim().length < 3) {
    errors.fullName = "El nombre debe tener al menos 3 caracteres";
    return false;
  }
  errors.fullName = "";
  return true;
};

const validateEmail = (): boolean => {
  if (!formData.email.trim()) {
    errors.email = "El correo institucional es requerido";
    return false;
  }
  const emailRegex = /^[a-zA-Z0-9._-]+@live\.uleam\.edu\.ec$/;
  if (!emailRegex.test(formData.email)) {
    errors.email =
      "Debe usar un correo institucional ULEAM válido (@live.uleam.edu.ec)";
    return false;
  }
  errors.email = "";
  return true;
};

const validatePassword = (): boolean => {
  if (!formData.password) {
    errors.password = "La contraseña es requerida";
    return false;
  }
  if (formData.password.length < 8) {
    errors.password = "La contraseña debe tener al menos 8 caracteres";
    return false;
  }
  errors.password = "";
  return true;
};

const validateConfirmPassword = (): boolean => {
  if (!formData.confirmPassword) {
    errors.confirmPassword = "Debe confirmar su contraseña";
    return false;
  }
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Las contraseñas no coinciden";
    return false;
  }
  errors.confirmPassword = "";
  return true;
};

const handleSubmit = async () => {
  const isFullNameValid = validateFullName();
  const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword();
  const isConfirmPasswordValid = validateConfirmPassword();

  if (
    !isFullNameValid ||
    !isEmailValid ||
    !isPasswordValid ||
    !isConfirmPasswordValid
  ) {
    return;
  }

  isLoading.value = true;
  registerError.value = '';

  try {
    console.log('Intentando registrar usuario:', {
      email: formData.email,
      nombre: formData.fullName
    })
    
    await register(formData.email, formData.password, formData.fullName, 'estudiante')
    
    // Mostrar notificación de éxito
    displayToast(
      'Registro Exitoso',
      'Por favor revisa tu correo electrónico para confirmar tu cuenta antes de iniciar sesión.',
      'success'
    )
    
    // Esperar 2 segundos antes de redirigir para que el usuario vea el toast
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (error: any) {
    console.error('Error completo al registrarse:', error)
    console.error('Mensaje de error:', error?.message)
    console.error('Stack:', error?.stack)
    
    if (error.message?.includes('User already registered') || error.message?.includes('already registered')) {
      registerError.value = 'Este correo ya está registrado'
    } else if (error.message?.includes('duplicate key') || error.message?.includes('unique constraint')) {
      registerError.value = 'Este correo ya existe en el sistema'
    } else if (error.message?.includes('Password')) {
      registerError.value = 'La contraseña debe tener al menos 6 caracteres'
    } else {
      registerError.value = `Error al crear la cuenta: ${error.message || 'Intenta nuevamente.'}`
    }
  } finally {
    isLoading.value = false;
  }
};
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
