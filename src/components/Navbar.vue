<template>
  <nav
    class="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm"
    role="navigation"
    aria-label="Navegación principal"
  >
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 sm:h-20">
        <div class="flex items-center">
          <router-link
            to="/"
            class="flex items-center hover:opacity-80 transition-opacity focus:outline-none"
            aria-label="Ir a página de inicio"
          >
            <img
              src="../assets/LOGO-ULEAM-VERTICAL.png"
              alt="Logo Universidad Laica Eloy Alfaro de Manabí"
              class="h-14 sm:h-20 w-auto"
              id="logo-navbar"
            />
          </router-link>
        </div>

        <div class="hidden md:flex items-center gap-2 lg:gap-4" role="menubar">


          <!-- Enlace para volver al inicio si estamos en la página de admin -->
          <router-link
            v-if="isAdminPage"
            to="/"
            class="text-gray-700 text-sm font-medium hover:text-[#C1272D] transition-colors duration-200 flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#C1272D] focus:ring-offset-2 rounded px-2 py-1"
            role="menuitem"
            aria-label="Volver al inicio"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span>Inicio</span>
          </router-link>

          <!-- Enlace Admin (solo visible para administradores y NO en la página de admin) -->
          <router-link
            v-if="isAdmin && !isAdminPage"
            to="/admin"
            class="text-gray-700 text-sm font-medium hover:text-[#C1272D] transition-colors duration-200 flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#C1272D] focus:ring-offset-2 rounded px-2 py-1"
            role="menuitem"
            aria-label="Panel de administración"
          >
            <CogIcon class="w-4 h-4" aria-hidden="true" />
            <span>Admin</span>
          </router-link>

          <!-- Enlace Mis Tickets (solo visible para usuarios autenticados) -->
          <router-link
            v-if="isAuthenticated && !isAdminPage"
            to="/mis-tickets"
            class="text-gray-700 text-sm font-medium hover:text-[#C1272D] transition-colors duration-200 flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#C1272D] focus:ring-offset-2 rounded px-2 py-1"
            role="menuitem"
            aria-label="Ver mis tickets"
          >
            <TicketIcon class="w-4 h-4" aria-hidden="true" />
            <span>Mis Tickets</span>
          </router-link>

          <!-- Mostrar info del usuario si está autenticado -->
          <div v-if="isAuthenticated" class="flex items-center gap-2 lg:gap-3">
            <span class="text-xs lg:text-sm text-gray-600 hidden lg:block">
              Hola, {{ currentUser?.nombre }}
            </span>
            <span class="text-xs text-gray-600 lg:hidden">
              {{ currentUser?.nombre?.split(' ')[0] }}
            </span>
            <button
              @click="handleLogout"
              class="text-gray-700 text-xs lg:text-sm font-medium hover:text-[#C1272D] transition-colors duration-200 flex items-center gap-1 lg:gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#C1272D] focus:ring-offset-2 rounded px-1 lg:px-2 py-1"
              aria-label="Cerrar sesión"
            >
              <ArrowRightOnRectangleIcon class="w-4 h-4" aria-hidden="true" />
              <span class="hidden lg:inline">Cerrar Sesión</span>
              <span class="lg:hidden">Salir</span>
            </button>
          </div>

          <!-- Mostrar login/registro si NO está autenticado -->
          <template v-else>
            <!-- Enlace de Alquiler de Sala solo para usuarios no logueados -->
            <router-link
              to="/alquiler-sala"
              class="text-gray-700 text-xs lg:text-sm font-medium hover:text-[#C1272D] transition-colors duration-200 flex items-center gap-1 lg:gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#C1272D] focus:ring-offset-2 rounded px-1 lg:px-2 py-1"
              role="menuitem"
              aria-label="Alquilar salas para eventos"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
              <span class="hidden sm:inline">Alquilar Sala</span>
              <span class="sm:hidden">Alquiler</span>
            </router-link>

            <router-link
              v-if="!isLoginPage"
              to="/login"
              class="text-gray-700 text-xs lg:text-sm font-medium hover:text-[#C1272D] transition-colors duration-200 flex items-center gap-1 lg:gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#C1272D] focus:ring-offset-2 rounded px-1 lg:px-2 py-1"
              role="menuitem"
              aria-label="Iniciar sesión en tu cuenta"
            >
              <ArrowRightOnRectangleIcon class="w-4 h-4" aria-hidden="true" />
              <span class="hidden sm:inline">Iniciar Sesión</span>
              <span class="sm:hidden">Login</span>
            </router-link>

            <router-link
              v-if="!isRegisterPage"
              to="/registro"
              class="bg-[#C1272D] hover:bg-[#8B1F23] text-white text-xs lg:text-sm font-medium px-3 lg:px-5 py-2 rounded transition-colors duration-200 flex items-center gap-1 lg:gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#8B1F23] focus:ring-offset-2"
              role="menuitem"
              aria-label="Crear cuenta nueva"
            >
              <UserPlusIcon class="w-4 h-4" aria-hidden="true" />
              <span class="hidden sm:inline">Registro</span>
              <span class="sm:hidden">+</span>
            </router-link>
          </template>
        </div>

        <button
          @click="toggleMenu"
          class="md:hidden text-gray-700 hover:text-[#C1272D] transition-colors p-2 focus:outline-none focus:ring-2 focus:ring-[#C1272D] rounded"
          :aria-expanded="isMenuOpen"
          aria-controls="mobile-menu"
          aria-label="Abrir menú de navegación"
        >
          <Bars3Icon v-if="!isMenuOpen" class="w-7 h-7" aria-hidden="true" />
          <XMarkIcon v-else class="w-7 h-7" aria-hidden="true" />
        </button>
      </div>

      <div
        v-if="isMenuOpen"
        id="mobile-menu"
        class="md:hidden pb-4 border-t border-gray-200 mt-2 pt-4 space-y-3"
        role="menu"
      >
        <!-- Solo mostrar Cartelera si NO estamos en la página de admin -->
        <router-link
          v-if="!isAdminPage"
          to="/#cartelera"
          @click="toggleMenu"
          class="flex items-center gap-3 text-gray-700 font-medium hover:text-[#C1272D] transition-colors py-2 focus:outline-none focus:ring-2 focus:ring-[#C1272D] rounded px-2"
          role="menuitem"
          aria-label="Ver cartelera de películas"
        >
          <FilmIcon class="w-5 h-5" aria-hidden="true" />
          <span>Cartelera</span>
        </router-link>

        <!-- Enlace para volver al inicio si estamos en la página de admin -->
        <router-link
          v-if="isAdminPage"
          to="/"
          @click="toggleMenu"
          class="flex items-center gap-3 text-gray-700 font-medium hover:text-[#C1272D] transition-colors py-2 focus:outline-none focus:ring-2 focus:ring-[#C1272D] rounded px-2"
          role="menuitem"
          aria-label="Volver al inicio"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <span>Inicio</span>
        </router-link>

        <!-- Enlace Admin móvil (solo para admins y NO en la página de admin) -->
        <router-link
          v-if="isAdmin && !isAdminPage"
          to="/admin"
          @click="toggleMenu"
          class="flex items-center gap-3 text-gray-700 font-medium hover:text-[#C1272D] transition-colors py-2 focus:outline-none focus:ring-2 focus:ring-[#C1272D] rounded px-2"
          role="menuitem"
          aria-label="Panel de administración"
        >
          <CogIcon class="w-5 h-5" aria-hidden="true" />
          <span>Admin</span>
        </router-link>

        <!-- Enlace Mis Tickets móvil (solo para usuarios autenticados) -->
        <router-link
          v-if="isAuthenticated && !isAdminPage"
          to="/mis-tickets"
          @click="toggleMenu"
          class="flex items-center gap-3 text-gray-700 font-medium hover:text-[#C1272D] transition-colors py-2 focus:outline-none focus:ring-2 focus:ring-[#C1272D] rounded px-2"
          role="menuitem"
          aria-label="Ver mis tickets"
        >
          <TicketIcon class="w-5 h-5" aria-hidden="true" />
          <span>Mis Tickets</span>
        </router-link>


        <div v-if="isAuthenticated" class="space-y-3">
          <div class="px-2 py-2 text-sm text-gray-600 border-t border-gray-200">
            Hola, {{ currentUser?.nombre }}
          </div>
          <button
            @click="
              handleLogout();
              toggleMenu();
            "
            class="flex items-center gap-3 text-gray-700 font-medium hover:text-[#C1272D] transition-colors py-2 focus:outline-none focus:ring-2 focus:ring-[#C1272D] rounded px-2 w-full text-left"
            aria-label="Cerrar sesión"
          >
            <ArrowRightOnRectangleIcon class="w-5 h-5" aria-hidden="true" />
            <span>Cerrar Sesión</span>
          </button>
        </div>

        <!-- Mostrar login/registro si NO está autenticado -->
        <template v-else>
          <!-- Enlace de Alquiler de Sala solo para usuarios no logueados - versión móvil -->
          <router-link
            to="/alquiler-sala"
            @click="toggleMenu"
            class="flex items-center gap-3 text-gray-700 font-medium hover:text-[#C1272D] transition-colors py-2 focus:outline-none focus:ring-2 focus:ring-[#C1272D] rounded px-2"
            role="menuitem"
            aria-label="Alquilar salas para eventos"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
            <span>Alquilar Sala</span>
          </router-link>

          <router-link
            v-if="!isLoginPage"
            to="/login"
            @click="toggleMenu"
            class="flex items-center gap-3 text-gray-700 font-medium hover:text-[#C1272D] transition-colors py-2 focus:outline-none focus:ring-2 focus:ring-[#C1272D] rounded px-2"
            role="menuitem"
            aria-label="Iniciar sesión en tu cuenta"
          >
            <ArrowRightOnRectangleIcon class="w-5 h-5" aria-hidden="true" />
            <span>Iniciar Sesión</span>
          </router-link>

          <router-link
            v-if="!isRegisterPage"
            to="/registro"
            @click="toggleMenu"
            class="flex items-center gap-3 text-gray-700 font-medium hover:text-[#C1272D] transition-colors py-2 focus:outline-none focus:ring-2 focus:ring-[#C1272D] rounded px-2"
            role="menuitem"
            aria-label="Crear cuenta nueva"
          >
            <UserPlusIcon class="w-5 h-5" aria-hidden="true" />
            <span>Registro</span>
          </router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  CogIcon,
  FilmIcon,
  TicketIcon,
  UserPlusIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useAuth } from "../composables/useAuth";

const route = useRoute();
const { currentUser, isAuthenticated, isAdmin, logout } = useAuth();

const isMenuOpen = ref(false);

const isLoginPage = computed(() => route.path === "/login");
const isRegisterPage = computed(() => route.path === "/registro");
const isAdminPage = computed(() => route.path === "/admin");

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const handleLogout = async () => {
  try {
    await logout();
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
};
</script>

<style scoped>
.router-link-active {
  color: #c1272d;
}
#logo-navbar {
  max-width: 160px;
}
</style>
