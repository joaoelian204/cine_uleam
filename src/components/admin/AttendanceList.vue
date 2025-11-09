<template>
  <div class="bg-white rounded-xl shadow-lg border border-gray-100">
    <!-- Header responsivo -->
    <div class="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h3 class="text-lg font-semibold text-gray-900">
          Reservas y Asistencia
        </h3>
        <div class="flex items-center justify-between sm:justify-end gap-3">
          <button
            @click="$emit('reload')"
            :disabled="loading"
            class="flex items-center px-3 py-2 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <svg
              class="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2"
              :class="{ 'animate-spin': loading }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              ></path>
            </svg>
            {{ loading ? "Cargando..." : "Recargar" }}
          </button>
          
          <!-- Contador de reservas responsivo -->
          <div class="flex items-center">
            <div v-if="loading" class="flex items-center text-xs sm:text-sm text-gray-500">
              <div
                class="animate-spin w-3 h-3 sm:w-4 sm:h-4 border-2 border-gray-300 border-t-[#C1272D] rounded-full mr-1 sm:mr-2"
              ></div>
              <span class="hidden sm:inline">Cargando...</span>
            </div>
            <div v-else class="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              <span class="font-semibold">{{ reservations.length }}</span>
              <span class="hidden sm:inline"> reserva{{ reservations.length !== 1 ? "s" : "" }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="p-8 text-center">
      <div
        class="animate-spin w-8 h-8 border-4 border-gray-300 border-t-[#C1272D] rounded-full mx-auto mb-4"
      ></div>
      <p class="text-gray-600">Cargando reservas...</p>
    </div>

    <!-- Content responsivo -->
    <div v-else class="divide-y divide-gray-200">
      <div
        v-for="reservation in reservations"
        :key="reservation.id"
        class="p-3 sm:p-6 hover:bg-gray-50 transition-colors"
      >
        <!-- Layout responsivo: móvil vertical, desktop horizontal -->
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          <!-- Información principal del usuario -->
          <div class="flex items-start sm:items-center gap-3 flex-1">
            <!-- Avatar del usuario -->
            <div
              class="shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-r from-[#C1272D] to-[#8B1F23] rounded-full flex items-center justify-center"
            >
              <span class="text-white font-bold text-sm sm:text-lg">
                {{ reservation.usuario_nombre.charAt(0).toUpperCase() }}
              </span>
            </div>

            <!-- Información del usuario -->
            <div class="flex-1 min-w-0">
              <!-- Nombre y estado (siempre en una línea) -->
              <div class="flex items-center gap-2 mb-1">
                <h4 class="font-semibold text-gray-900 text-sm sm:text-base truncate">
                  {{ reservation.usuario_nombre }}
                </h4>
                <span
                  :class="[
                    'shrink-0 px-2 py-1 text-xs font-medium rounded-full',
                    reservation.asistencia_confirmada
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800',
                  ]"
                >
                  {{
                    reservation.asistencia_confirmada
                      ? "✅ Confirmado"
                      : "⏳ Pendiente"
                  }}
                </span>
              </div>
              
              <!-- Email (oculto en móvil si es muy largo) -->
              <p class="text-xs sm:text-sm text-gray-600 mb-2 truncate">
                {{ reservation.usuario_email }}
              </p>
              
              <!-- Badges informativos responsivos -->
              <div class="flex flex-wrap gap-1 sm:gap-2">
                <span
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  <span class="hidden sm:inline">🎬 </span>{{ reservation.pelicula_nombre }}
                </span>
                <span
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                >
                  🪑 {{ reservation.asiento_fila }}{{ reservation.asiento_numero }}
                </span>
                <span
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  <span class="hidden sm:inline">📅 </span>
                  <span class="sm:hidden">{{ formatDateShort(reservation.fecha_reserva) }}</span>
                  <span class="hidden sm:inline">{{ formatDate(reservation.fecha_reserva) }}</span>
                </span>
              </div>
            </div>
          </div>

          <!-- Botones de acción responsivos -->
          <div class="flex items-center gap-2 sm:gap-3 mt-2 lg:mt-0">
            <!-- Botón de confirmar asistencia manual -->
            <button
              v-if="!reservation.asistencia_confirmada"
              @click="$emit('confirmAttendance', reservation)"
              class="flex-1 sm:flex-initial px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs sm:text-sm font-medium"
            >
              <span class="sm:hidden">✓</span>
              <span class="hidden sm:inline">✓ Confirmar</span>
            </button>

            <!-- Mostrar QR Button -->
            <button
              @click="$emit('showQR', reservation)"
              class="flex-1 sm:flex-initial px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm font-medium"
            >
              <span class="sm:hidden">📱</span>
              <span class="hidden sm:inline">📱 Ver QR</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Estado vacío responsivo -->
      <div v-if="!loading && reservations.length === 0" class="p-4 sm:p-8 text-center">
        <svg
          class="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <div v-if="allReservations.length === 0">
          <p class="text-gray-600 text-base sm:text-lg mb-1 sm:mb-2">
            No hay reservas en el sistema
          </p>
          <p class="text-gray-500 text-xs sm:text-sm px-4">
            Las reservas aparecerán aquí una vez que los usuarios hagan reservas
            de películas.
          </p>
        </div>
        <div v-else>
          <p class="text-gray-600 text-base sm:text-lg">
            No hay reservas que coincidan con los filtros
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Reservation {
  id: string;
  usuario_id: string;
  usuario_nombre: string;
  usuario_email: string;
  pelicula_id: string;
  pelicula_nombre: string;
  asiento_id: string;
  asiento_fila: string;
  asiento_numero: number;
  sala_nombre: string;
  fecha_reserva: string;
  fecha_proyeccion: string;
  asistencia_confirmada: boolean;
  qr_code: string;
}

interface Props {
  reservations: Reservation[];
  allReservations: Reservation[];
  loading: boolean;
}

defineProps<Props>();

defineEmits<{
  reload: [];
  confirmAttendance: [reservation: Reservation];
  showQR: [reservation: Reservation];
}>();

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDateShort = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    month: "short",
    day: "numeric",
  });
};
</script>
