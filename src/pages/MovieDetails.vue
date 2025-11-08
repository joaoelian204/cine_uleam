<template>
  <div class="min-h-screen bg-gray-50">
    <Toast
      :show="showToast"
      :message="toastMessage"
      :title="toastTitle"
      :type="toastType"
      @close="showToast = false"
    />
    
    <div class="bg-white border-b border-gray-200 py-4 sm:py-6">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <router-link
          to="/"
          class="inline-flex items-center gap-2 text-gray-600 hover:text-[#C1272D] transition-colors font-medium text-sm sm:text-base"
        >
          <svg
            class="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span class="hidden sm:inline">Volver a cartelera</span>
          <span class="sm:hidden">Volver</span>
        </router-link>
      </div>
    </div>

    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div class="lg:col-span-1 order-2 lg:order-1">
          <div class="lg:sticky lg:top-24">
            <img
              :src="movie.url_poster"
              :alt="movie.nombre"
              class="w-full max-w-sm mx-auto lg:max-w-none rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl"
            />
          </div>
        </div>

        <div class="lg:col-span-2 order-1 lg:order-2 space-y-4 sm:space-y-6">
          <div>
            <h1 class="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              {{ movie.nombre }}
            </h1>
            <div class="flex items-center gap-2 sm:gap-3 flex-wrap">
              <span
                class="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 bg-[#C1272D] text-white rounded-lg text-xs sm:text-sm font-medium"
              >
                <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"
                  />
                </svg>
                {{ movie.idioma }}
              </span>

              <span
                class="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 bg-gray-100 text-gray-700 rounded-lg text-xs sm:text-sm font-medium"
              >
                <svg
                  class="w-3 h-3 sm:w-4 sm:h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span class="hidden sm:inline">{{ formatDate(movie.fecha_hora_proyeccion) }}</span>
                <span class="sm:hidden">{{ formatDate(movie.fecha_hora_proyeccion).substring(0, 5) }}</span>
              </span>

              <span
                class="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 bg-gray-100 text-gray-700 rounded-lg text-xs sm:text-sm font-medium"
              >
                <svg
                  class="w-3 h-3 sm:w-4 sm:h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {{ formatTime(movie.fecha_hora_proyeccion) }}
              </span>
            </div>
          </div>

          <div class="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
            <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Sinopsis</h2>
            <p class="text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed">
              {{ movie.descripcion }}
            </p>
          </div>

          <div class="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
            <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
              Función disponible
            </h2>

            <div
              class="border-2 border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 hover:border-[#C1272D] transition-all cursor-pointer group"
              @click="goToSeats"
            >
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div class="flex items-start gap-3 sm:gap-4">
                  <div
                    class="bg-[#C1272D]/10 p-2 sm:p-3 rounded-lg group-hover:bg-[#C1272D] transition-colors"
                  >
                    <svg
                      class="w-5 h-5 sm:w-6 sm:h-6 text-[#C1272D] group-hover:text-white transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p class="text-xs sm:text-sm text-gray-500 font-medium mb-1">Fecha</p>
                    <p class="text-sm sm:text-base lg:text-lg text-gray-900 font-semibold">
                      <span class="hidden sm:inline">{{ formatFullDate(movie.fecha_hora_proyeccion) }}</span>
                      <span class="sm:hidden">{{ formatDate(movie.fecha_hora_proyeccion) }}</span>
                    </p>
                  </div>
                </div>

                <div class="flex items-start gap-3 sm:gap-4">
                  <div
                    class="bg-[#C1272D]/10 p-2 sm:p-3 rounded-lg group-hover:bg-[#C1272D] transition-colors"
                  >
                    <svg
                      class="w-5 h-5 sm:w-6 sm:h-6 text-[#C1272D] group-hover:text-white transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p class="text-xs sm:text-sm text-gray-500 font-medium mb-1">
                      Horario
                    </p>
                    <p class="text-sm sm:text-base lg:text-lg text-gray-900 font-semibold">
                      {{ formatTime(movie.fecha_hora_proyeccion) }}
                    </p>
                  </div>
                </div>

                <div class="flex items-start gap-3 sm:gap-4 sm:col-span-2 lg:col-span-1">
                  <div
                    class="bg-[#C1272D]/10 p-2 sm:p-3 rounded-lg group-hover:bg-[#C1272D] transition-colors"
                  >
                    <svg
                      class="w-5 h-5 sm:w-6 sm:h-6 text-[#C1272D] group-hover:text-white transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p class="text-xs sm:text-sm text-gray-500 font-medium mb-1">Sala</p>
                    <p class="text-sm sm:text-base lg:text-lg text-gray-900 font-semibold">
                      {{ movie.sala?.nombre || 'Sala no especificada' }}
                    </p>
                  </div>
                </div>

                <div class="flex items-start gap-3 sm:gap-4 sm:col-span-2 lg:col-span-3">
                  <div
                    class="bg-[#C1272D]/10 p-2 sm:p-3 rounded-lg group-hover:bg-[#C1272D] transition-colors"
                  >
                    <svg
                      class="w-5 h-5 sm:w-6 sm:h-6 text-[#C1272D] group-hover:text-white transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p class="text-xs sm:text-sm text-gray-500 font-medium mb-1">
                      Entrada
                    </p>
                    <p class="text-sm sm:text-base lg:text-lg text-gray-900 font-semibold">Gratis</p>
                  </div>
                </div>
              </div>

              <div class="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                <button
                  class="w-full bg-[#C1272D] hover:bg-[#8B1F23] text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <svg
                    class="w-4 h-4 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <span class="hidden sm:inline">Reservar asiento</span>
                  <span class="sm:hidden">Reservar</span>
                </button>
              </div>
            </div>

            <p class="text-sm text-gray-500 mt-4 text-center">
              Haz clic en la función para seleccionar tu asiento
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { useAuth } from "../composables/useAuth";
import Toast from "../components/Toast.vue";

const { isAuthenticated } = useAuth();
const route = useRoute();
const router = useRouter();

// Toast state
const showToast = ref(false);
const toastMessage = ref('');
const toastTitle = ref('');
const toastType = ref<'success' | 'error' | 'warning' | 'info'>('info');

const movie = computed(() => {
  const movieData = route.params.movie;
  if (typeof movieData === "string") {
    return JSON.parse(decodeURIComponent(movieData));
  }
  return movieData;
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleDateString("es-ES", { month: "short" });
  return `${day} ${month}`;
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatFullDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const goToSeats = () => {
  if (!isAuthenticated.value) {
    // Mostrar toast notification
    toastTitle.value = 'Autenticación requerida';
    toastMessage.value = 'Por favor, inicia sesión para reservar asientos.';
    toastType.value = 'warning';
    showToast.value = true;
    
    // Redirigir al login después de 2 segundos
    setTimeout(() => {
      router.push('/login');
    }, 2000);
    return;
  }
  
  // Si está autenticado, ir a la página de reservas
  router.push({
    name: 'Reserve',
    params: {
      movie: encodeURIComponent(JSON.stringify(movie.value))
    }
  });
};
</script>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>
