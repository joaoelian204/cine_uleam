<template>
  <div class="min-h-screen bg-gray-100 pt-8">
    <Toast
      :show="showToast"
      :message="toastMessage"
      :title="toastTitle"
      :type="toastType"
      @close="showToast = false"
    />
    
    <!-- Título del Admin -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div class="text-center sm:text-left">
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <p class="mt-2 text-base sm:text-lg text-gray-600">CineUleam - Sistema de Gestión</p>
        </div>
        
        <!-- 🔥 NUEVO: Botón de cerrar sesión mejorado -->
        <div class="mt-4 sm:mt-0 flex items-center space-x-4">
          <div class="text-sm text-gray-600">
            <span class="font-medium">👤 {{ currentUser?.nombre || 'Admin' }}</span>
          </div>
          <button
            @click="handleLogout"
            class="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors shadow-lg"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>

    <!-- Navegación del Admin -->
    <nav class="bg-white shadow-lg border-b-2 border-gray-100">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Navegación para móvil -->
        <div class="block sm:hidden">
          <div class="relative">
            <button 
              @click="showMobileMenu = !showMobileMenu"
              class="w-full flex items-center justify-between py-4 px-4 text-left text-sm font-medium text-gray-700 border-b bg-linear-to-r from-gray-50 to-white rounded-lg"
            >
              <span class="font-semibold">{{ getActiveTabLabel() }}</span>
              <svg class="w-5 h-5 transition-transform text-[#C1272D]" :class="{ 'rotate-180': showMobileMenu }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            
            <div v-show="showMobileMenu" class="absolute top-full left-0 right-0 bg-white shadow-xl z-10 border-t border-gray-200 rounded-b-lg">
              <button 
                @click="selectTab('dashboard')"
                :class="[
                  'w-full text-left py-3 px-4 text-sm font-medium transition-all duration-200 flex items-center space-x-3',
                  activeTab === 'dashboard' ? 'bg-linear-to-r from-[#C1272D] to-[#8B1F23] text-white' : 'text-gray-700 hover:bg-linear-to-r hover:from-gray-50 hover:to-gray-100'
                ]"
              >
                <div class="w-2 h-2 rounded-full bg-linear-to-r from-[#C1272D] to-[#8B1F23]"></div>
                <span>Dashboard</span>
              </button>
              <button 
                @click="selectTab('peliculas')"
                :class="[
                  'w-full text-left py-3 px-4 text-sm font-medium transition-all duration-200 flex items-center space-x-3',
                  activeTab === 'peliculas' ? 'bg-linear-to-r from-[#C1272D] to-[#8B1F23] text-white' : 'text-gray-700 hover:bg-linear-to-r hover:from-gray-50 hover:to-gray-100'
                ]"
              >
                <div class="w-2 h-2 rounded-full bg-linear-to-r from-[#F59E0B] to-[#D97706]"></div>
                <span>Gestión de Películas</span>
              </button>
              <button 
                @click="selectTab('salas')"
                :class="[
                  'w-full text-left py-3 px-4 text-sm font-medium transition-all duration-200 flex items-center space-x-3',
                  activeTab === 'salas' ? 'bg-linear-to-r from-[#C1272D] to-[#8B1F23] text-white' : 'text-gray-700 hover:bg-linear-to-r hover:from-gray-50 hover:to-gray-100'
                ]"
              >
                <div class="w-2 h-2 rounded-full bg-linear-to-r from-[#1E3A8A] to-[#1E40AF]"></div>
                <span>Configurar Salas</span>
              </button>
              <button 
                @click="selectTab('estadisticas')"
                :class="[
                  'w-full text-left py-3 px-4 text-sm font-medium transition-all duration-200 flex items-center space-x-3',
                  activeTab === 'estadisticas' ? 'bg-linear-to-r from-[#C1272D] to-[#8B1F23] text-white' : 'text-gray-700 hover:bg-linear-to-r hover:from-gray-50 hover:to-gray-100'
                ]"
              >
                <div class="w-2 h-2 rounded-full bg-linear-to-r from-[#059669] to-[#047857]"></div>
                <span>Estadísticas</span>
              </button>
              <button 
                @click="selectTab('solicitudes')"
                :class="[
                  'w-full text-left py-3 px-4 text-sm font-medium transition-all duration-200 flex items-center space-x-3',
                  activeTab === 'solicitudes' ? 'bg-linear-to-r from-[#C1272D] to-[#8B1F23] text-white' : 'text-gray-700 hover:bg-linear-to-r hover:from-gray-50 hover:to-gray-100'
                ]"
              >
                <div class="w-2 h-2 rounded-full bg-linear-to-r from-[#7C3AED] to-[#6D28D9]"></div>
                <span>Solicitudes de Alquiler</span>
              </button>
              <button 
                @click="selectTab('asistencia')"
                :class="[
                  'w-full text-left py-3 px-4 text-sm font-medium transition-all duration-200 rounded-b-lg flex items-center space-x-3',
                  activeTab === 'asistencia' ? 'bg-linear-to-r from-[#C1272D] to-[#8B1F23] text-white' : 'text-gray-700 hover:bg-linear-to-r hover:from-gray-50 hover:to-gray-100'
                ]"
              >
                <div class="w-2 h-2 rounded-full bg-linear-to-r from-[#10B981] to-[#059669]"></div>
                <span>Control de Asistencia</span>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Navegación para desktop centrada -->
        <div class="hidden sm:flex sm:justify-center sm:space-x-1 py-2">
          <button 
            @click="activeTab = 'dashboard'"
            :class="[
              'py-3 px-6 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center space-x-2',
              activeTab === 'dashboard' 
                ? 'bg-linear-to-r from-[#C1272D] to-[#8B1F23] text-white shadow-lg transform scale-105' 
                : 'text-gray-600 hover:text-[#C1272D] hover:bg-gray-50'
            ]"
          >
            <div class="w-3 h-3 rounded-full bg-linear-to-r from-[#C1272D] to-[#8B1F23]"></div>
            <span>Dashboard</span>
          </button>
          <button 
            @click="activeTab = 'peliculas'"
            :class="[
              'py-3 px-6 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center space-x-2',
              activeTab === 'peliculas' 
                ? 'bg-linear-to-r from-[#C1272D] to-[#8B1F23] text-white shadow-lg transform scale-105' 
                : 'text-gray-600 hover:text-[#C1272D] hover:bg-gray-50'
            ]"
          >
            <div class="w-3 h-3 rounded-full bg-linear-to-r from-[#F59E0B] to-[#D97706]"></div>
            <span>Películas</span>
          </button>
          <button 
            @click="activeTab = 'salas'"
            :class="[
              'py-3 px-6 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center space-x-2',
              activeTab === 'salas' 
                ? 'bg-linear-to-r from-[#C1272D] to-[#8B1F23] text-white shadow-lg transform scale-105' 
                : 'text-gray-600 hover:text-[#C1272D] hover:bg-gray-50'
            ]"
          >
            <div class="w-3 h-3 rounded-full bg-linear-to-r from-[#1E3A8A] to-[#1E40AF]"></div>
            <span>Salas</span>
          </button>
          <button 
            @click="activeTab = 'estadisticas'"
            :class="[
              'py-3 px-6 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center space-x-2',
              activeTab === 'estadisticas' 
                ? 'bg-linear-to-r from-[#C1272D] to-[#8B1F23] text-white shadow-lg transform scale-105' 
                : 'text-gray-600 hover:text-[#C1272D] hover:bg-gray-50'
            ]"
          >
            <div class="w-3 h-3 rounded-full bg-linear-to-r from-[#059669] to-[#047857]"></div>
            <span>Estadísticas</span>
          </button>
          <button 
            @click="activeTab = 'solicitudes'"
            :class="[
              'py-3 px-6 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center space-x-2',
              activeTab === 'solicitudes' 
                ? 'bg-linear-to-r from-[#C1272D] to-[#8B1F23] text-white shadow-lg transform scale-105' 
                : 'text-gray-600 hover:text-[#C1272D] hover:bg-gray-50'
            ]"
          >
            <div class="w-3 h-3 rounded-full bg-linear-to-r from-[#7C3AED] to-[#6D28D9]"></div>
            <span>Solicitudes</span>
          </button>
          <button 
            @click="activeTab = 'asistencia'"
            :class="[
              'py-3 px-6 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center space-x-2',
              activeTab === 'asistencia' 
                ? 'bg-linear-to-r from-[#C1272D] to-[#8B1F23] text-white shadow-lg transform scale-105' 
                : 'text-gray-600 hover:text-[#C1272D] hover:bg-gray-50'
            ]"
          >
            <div class="w-3 h-3 rounded-full bg-linear-to-r from-[#10B981] to-[#059669]"></div>
            <span>Asistencia</span>
          </button>
        </div>
      </div>
    </nav>

    <!-- Contenido Principal -->
    <main class="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
      <div class="sm:px-0">
        
        <!-- Dashboard -->
        <AdminDashboard 
          v-if="activeTab === 'dashboard'"
          :total-peliculas="totalPeliculas"
          :total-usuarios="totalUsuarios"
          :total-reservas="totalReservas"
          :total-salas="totalSalas"
        />

        <!-- Gestión de Películas -->
        <MovieManagement
          v-if="activeTab === 'peliculas'"
          :peliculas="peliculas"
          :salas="salas"
          :is-loading-peliculas="isLoadingPeliculas"
          @create-movie="handleCreateMovie"
          @update-movie="handleUpdateMovie"
          @delete-movie="handleDeleteMovie"
          @show-toast="displayToast"
        />

        <!-- Configuración de Salas -->
        <SalaManagement
          v-if="activeTab === 'salas'"
          :salas="salas"
          @create-sala="handleCreateSala"
          @update-sala="handleUpdateSala"
          @delete-sala="handleDeleteSala"
          @show-toast="displayToast"
        />

        <!-- Estadísticas -->
        <AdminStatistics
          v-if="activeTab === 'estadisticas'"
          :peliculas="peliculas"
          :reservas="reservas"
        />

        <!-- Solicitudes de Alquiler -->
        <SolicitudAlquilerManagement
          v-if="activeTab === 'solicitudes'"
          @show-toast="displayToast"
        />

        <!-- Control de Asistencia QR -->
        <AttendanceManagement
          v-if="activeTab === 'asistencia'"
          @show-toast="displayToast"
        />

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import Toast from '../components/Toast.vue'
import AdminDashboard from '../components/admin/AdminDashboard.vue'
import AdminStatistics from '../components/admin/AdminStatistics.vue'
import AttendanceManagement from '../components/admin/AttendanceManagement.vue'
import MovieManagement from '../components/admin/MovieManagement.vue'
import SalaManagement from '../components/admin/SalaManagement.vue'
import SolicitudAlquilerManagement from '../components/admin/SolicitudAlquilerManagement.vue'
import { useAdmin } from '../composables/useAdmin'
import { useAuth } from '../composables/useAuth'
import type { Pelicula } from '../interfaces/Pelicula'
import type { Sala } from '../interfaces/Sala'

const router = useRouter()
const { isAuthenticated, currentUser, checkSession, clearSessionCheck, logout } = useAuth()
const {
  // Estado
  peliculas,
  reservas,
  salas,
  
  // Estados de carga
  isLoadingPeliculas,
  
  // Estadísticas
  totalPeliculas,
  totalUsuarios,
  totalReservas,
  totalSalas,
  
  // Funciones
  loadAllData,
  createMovie,
  updateMovie,
  deleteMovie,
  createSala,
  updateSala,
  deleteSala
} = useAdmin()

// Toast state
const showToast = ref(false)
const toastMessage = ref('')
const toastTitle = ref('')
const toastType = ref<'success' | 'error' | 'warning' | 'info'>('info')

// Estado de navegación
const activeTab = ref('dashboard')
const showMobileMenu = ref(false)

// 🔥 NUEVO: Estado de inactividad
const inactivityTimer = ref<ReturnType<typeof setTimeout> | null>(null)
const INACTIVITY_TIMEOUT = 30 * 60 * 1000 // 30 minutos

// 🔥 NUEVO: Función para resetear el timer de inactividad
const resetInactivityTimer = () => {
  if (inactivityTimer.value) {
    clearTimeout(inactivityTimer.value)
  }
  
  inactivityTimer.value = setTimeout(() => {
    displayToast('Sesión Expirada', 'La sesión ha expirado por inactividad', 'warning')
    handleLogout()
  }, INACTIVITY_TIMEOUT)
}

// 🔥 NUEVO: Función para limpiar timer de inactividad
const clearInactivityTimer = () => {
  if (inactivityTimer.value) {
    clearTimeout(inactivityTimer.value)
    inactivityTimer.value = null
  }
}

// Función helper para mostrar toast
const displayToast = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
  toastTitle.value = title
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
}

// Función para obtener el label de la tab activa
const getActiveTabLabel = () => {
  const labels: Record<string, string> = {
    dashboard: 'Dashboard',
    peliculas: 'Gestión de Películas',
    salas: 'Configurar Salas',
    estadisticas: 'Estadísticas',
    solicitudes: 'Solicitudes de Alquiler',
    asistencia: 'Control de Asistencia'
  }
  return labels[activeTab.value] || 'Dashboard'
}

// Función para seleccionar tab y cerrar menú móvil
const selectTab = (tab: string) => {
  activeTab.value = tab
  showMobileMenu.value = false
}

// 🔥 NUEVO: Función para cerrar sesión de forma segura
const handleLogout = async () => {
  try {
    displayToast('Info', 'Cerrando sesión...', 'info')
    
    // Limpiar intervalos primero
    clearSessionCheck()
    
    // Cerrar sesión
    await logout()
    
    displayToast('Éxito', 'Sesión cerrada correctamente', 'success')
  } catch (error: any) {
    console.error('❌ Error al cerrar sesión:', error)
    displayToast('Advertencia', 'Se cerró la sesión con algunos errores', 'warning')
    
    // Forzar redirección al login aunque haya errores
    router.push('/login')
  }
}

// Handlers para las operaciones CRUD de películas
const handleCreateMovie = async (movieData: Partial<Pelicula>) => {
  try {
    await createMovie(movieData)
    displayToast('Éxito', 'Película creada exitosamente', 'success')
  } catch (error: any) {
    displayToast('Error', error.message, 'error')
  }
}

const handleUpdateMovie = async (id: string, movieData: Partial<Pelicula>) => {
  try {
    await updateMovie(id, movieData)
    displayToast('Éxito', 'Película actualizada exitosamente', 'success')
  } catch (error: any) {
    displayToast('Error', error.message, 'error')
  }
}

const handleDeleteMovie = async (id: string) => {
  try {
    await deleteMovie(id)
    displayToast('Éxito', 'Película eliminada exitosamente', 'success')
  } catch (error: any) {
    displayToast('Error', error.message, 'error')
  }
}

// Handlers para las operaciones CRUD de salas
const handleCreateSala = async (salaData: Partial<Sala>) => {
  try {
    await createSala(salaData)
    displayToast('Éxito', 'Sala creada exitosamente', 'success')
  } catch (error: any) {
    displayToast('Error', error.message, 'error')
  }
}

const handleUpdateSala = async (id: string, salaData: Partial<Sala>) => {
  try {
    await updateSala(id, salaData)
    displayToast('Éxito', 'Sala actualizada exitosamente', 'success')
  } catch (error: any) {
    displayToast('Error', error.message, 'error')
  }
}

const handleDeleteSala = async (id: string) => {
  try {
    await deleteSala(id)
    displayToast('Éxito', 'Sala eliminada exitosamente', 'success')
  } catch (error: any) {
    displayToast('Error', error.message, 'error')
  }
}

onMounted(async () => {
  // Verificar autenticación primero
  await checkSession()
  
  // Si no está autenticado, redirigir al login
  if (!isAuthenticated.value) {
    router.push('/login')
    return
  }
  
  // Verificar si el usuario es administrador
  if (currentUser.value?.tipo !== 'admin') {
    displayToast('Acceso Denegado', 'No tienes permisos para acceder al panel de administración', 'error')
    setTimeout(() => {
      router.push('/')
    }, 2000)
    return
  }
  
  // Cargar datos iniciales
  await loadAllData()
  
  // 🔥 NUEVO: Configurar detección de inactividad
  const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
  
  activityEvents.forEach(eventName => {
    document.addEventListener(eventName, resetInactivityTimer, true)
  })
  
  // Iniciar el timer de inactividad
  resetInactivityTimer()
})

// 🔥 NUEVO: Limpiar intervalos y timers al desmontar el componente
onUnmounted(() => {
  console.log('🧹 Limpiando intervalos de sesión al salir del panel de administración')
  clearSessionCheck()
  clearInactivityTimer()
  
  // Limpiar event listeners de actividad
  const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
  activityEvents.forEach(eventName => {
    document.removeEventListener(eventName, resetInactivityTimer, true)
  })
})
</script>
