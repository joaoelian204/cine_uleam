<template>
  <div>
    <div class="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 flex items-center gap-3">
          <TicketIcon class="w-10 h-10 text-[#C1272D]" />
          Mis Tickets
        </h1>
        <p class="mt-2 text-gray-600">
          Historial completo de tus reservas
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-16">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C1272D]"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <ExclamationCircleIcon class="w-12 h-12 text-red-500 mx-auto mb-3" />
        <p class="text-red-800 font-medium">{{ error }}</p>
        <button
          @click="loadReservations"
          class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Reintentar
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="reservations.length === 0" class="bg-white rounded-lg shadow-md p-12 text-center">
        <TicketIcon class="w-20 h-20 text-gray-300 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-gray-900 mb-2">
          No tienes reservas aún
        </h3>
        <p class="text-gray-600 mb-6">
          ¡Explora nuestra cartelera y reserva tu asiento!
        </p>
        <router-link
          to="/"
          class="inline-flex items-center gap-2 px-6 py-3 bg-[#C1272D] text-white rounded-lg hover:bg-[#8B1F23] transition-colors"
        >
          <FilmIcon class="w-5 h-5" />
          Ver Cartelera
        </router-link>
      </div>

      <!-- Reservations List -->
      <div v-else class="space-y-6">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Total Reservas</p>
                <p class="text-3xl font-bold text-gray-900">{{ reservations.length }}</p>
              </div>
              <TicketIcon class="w-12 h-12 text-[#C1272D] opacity-20" />
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Próximas</p>
                <p class="text-3xl font-bold text-green-600">{{ upcomingCount }}</p>
              </div>
              <CalendarIcon class="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Pasadas</p>
                <p class="text-3xl font-bold text-gray-500">{{ pastCount }}</p>
              </div>
              <ClockIcon class="w-12 h-12 text-gray-500 opacity-20" />
            </div>
          </div>
        </div>

        <!-- Tickets Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div
            v-for="reserva in reservations"
            :key="reserva.id"
            class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <!-- Poster Section -->
            <div class="relative h-64 sm:h-72 bg-gray-900">
              <img
                :src="reserva.pelicula.url_poster"
                :alt="reserva.pelicula.nombre"
                class="w-full h-full object-contain"
              />
              <!-- Status Badge -->
              <div
                :class="[
                  'absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold shadow-lg',
                  isUpcoming(reserva.pelicula.fecha_hora_proyeccion)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-500 text-white'
                ]"
              >
                {{ isUpcoming(reserva.pelicula.fecha_hora_proyeccion) ? 'Próxima' : 'Pasada' }}
              </div>
            </div>

            <!-- Ticket Content -->
            <div class="p-6">
              <!-- Movie Title -->
              <h3 class="text-xl font-bold text-gray-900 mb-4">
                {{ reserva.pelicula.nombre }}
              </h3>

              <div class="flex flex-col sm:flex-row gap-6">
                <!-- Details Column -->
                <div class="flex-1 space-y-3">
                  <!-- Fecha y Hora -->
                  <div class="flex items-start gap-2">
                    <CalendarIcon class="w-5 h-5 text-[#C1272D] shrink-0 mt-0.5" />
                    <div>
                      <p class="text-sm text-gray-600">Proyección</p>
                      <p class="font-semibold text-gray-900">
                        {{ formatDate(reserva.pelicula.fecha_hora_proyeccion) }}
                      </p>
                      <p class="text-sm text-gray-700">
                        {{ formatTime(reserva.pelicula.fecha_hora_proyeccion) }}
                      </p>
                    </div>
                  </div>

                  <!-- Asiento -->
                  <div class="flex items-center gap-2">
                    <div class="w-5 h-5 flex items-center justify-center">
                      <span class="text-[#C1272D] font-bold">🪑</span>
                    </div>
                    <div>
                      <p class="text-sm text-gray-600">Asiento</p>
                      <p class="font-semibold text-gray-900">
                        Fila {{ reserva.asiento.fila }} - Asiento {{ reserva.asiento.numero }}
                      </p>
                    </div>
                  </div>

                  <!-- Sala -->
                  <div class="flex items-center gap-2">
                    <MapPinIcon class="w-5 h-5 text-[#C1272D] shrink-0" />
                    <div>
                      <p class="text-sm text-gray-600">Sala</p>
                      <p class="font-semibold text-gray-900">
                        {{ reserva.pelicula.sala.nombre }}
                      </p>
                    </div>
                  </div>

                  <!-- Idioma -->
                  <div class="flex items-center gap-2">
                    <LanguageIcon class="w-5 h-5 text-[#C1272D] shrink-0" />
                    <div>
                      <p class="text-sm text-gray-600">Idioma</p>
                      <p class="font-semibold text-gray-900">
                        {{ reserva.pelicula.idioma || 'No especificado' }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- QR Code Column -->
                <div class="flex flex-col items-center justify-center sm:w-32 p-3 bg-gray-50 rounded-lg">
                  <p class="text-xs text-gray-600 mb-2 font-medium">Tu código QR</p>
                  <canvas
                    :ref="(el) => setQRRef(el, reserva.id)"
                    class="w-28 h-28"
                  ></canvas>
                  <p class="text-xs text-gray-500 mt-2 text-center">
                    ID: {{ reserva.id.slice(0, 8) }}
                  </p>
                </div>
              </div>

              <!-- Fecha de Reserva -->
              <div class="mt-4 pt-3 border-t border-gray-200">
                <p class="text-xs text-gray-500">
                  Reservado el {{ formatDate(reserva.fecha_creacion) }}
                </p>
              </div>

              <!-- Actions -->
              <div class="mt-4 flex gap-2">
                  <router-link
                    :to="getMovieDetailsRoute(reserva.pelicula)"
                    class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-center text-sm font-medium"
                  >
                    Ver Detalles
                  </router-link>
                  <button
                    v-if="isUpcoming(reserva.pelicula.fecha_hora_proyeccion)"
                    @click="handleCancelReservation(reserva)"
                    :disabled="cancelingId === reserva.id"
                    class="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span v-if="cancelingId === reserva.id" class="flex items-center justify-center gap-2">
                      <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                      Cancelando...
                    </span>
                    <span v-else>Cancelar</span>
                  </button>
                </div>
              </div>
            </div>
          </div> <!-- End ticket card -->
        </div> <!-- End tickets grid -->
      </div> <!-- End Reservations List (v-else) -->
    </div> <!-- End max-w-7xl mx-auto -->
  </div> <!-- End min-h-screen -->

    <!-- Toast Notification -->
    <Toast
      :show="showToast"
      :type="toastType"
      :title="toastTitle"
      :message="toastMessage"
      @close="showToast = false"
    />

    <!-- Cancel Confirmation Modal -->
    <Teleport to="body">
      <div
        v-if="showCancelModal"
        class="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-101"
        @click.self="closeCancelModal"
      >
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div class="flex items-start gap-4">
            <div class="shrink-0">
              <ExclamationCircleIcon class="w-10 h-10 text-yellow-500" />
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">
                ¿Cancelar Reserva?
              </h3>
              <p class="text-gray-600 mb-4">
                Estás a punto de cancelar tu reserva para
                <span class="font-semibold">{{ reservationToCancel?.pelicula.nombre }}</span>.
                Esta acción no se puede deshacer.
              </p>

              <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p class="text-sm text-yellow-800">
                  <strong>Asiento:</strong> Fila {{ reservationToCancel?.asiento.fila }} - 
                  Número {{ reservationToCancel?.asiento.numero }}
                </p>
              </div>

              <div class="flex gap-3">
                <button
                  @click="confirmCancelReservation"
                  :disabled="cancelingId !== null"
                  class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sí, Cancelar
                </button>
                <button
                  @click="closeCancelModal"
                  :disabled="cancelingId !== null"
                  class="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  No, Mantener
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
</template>

<script setup lang="ts">
import {
  CalendarIcon,
  ClockIcon,
  ExclamationCircleIcon,
  FilmIcon,
  LanguageIcon,
  MapPinIcon,
  TicketIcon,
} from "@heroicons/vue/24/outline";
import QRCode from "qrcode";
import { computed, nextTick, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Toast from "../components/Toast.vue";
import { useAuth } from "../composables/useAuth";
import { useReservations } from "../composables/useReservations";

const router = useRouter();
const { currentUser, isAuthenticated } = useAuth();
const { getUserReservations, deleteReservation } = useReservations();

const reservations = ref<any[]>([]);
const loading = ref(true);
const error = ref("");
const cancelingId = ref<string | null>(null);
const showCancelModal = ref(false);
const reservationToCancel = ref<any>(null);

// QR code refs
const qrRefs = ref<Map<string, HTMLCanvasElement>>(new Map());

// Toast state
const showToast = ref(false);
const toastType = ref<"success" | "error" | "warning" | "info">("success");
const toastTitle = ref("");
const toastMessage = ref("");

// Computed stats
const upcomingCount = computed(() => {
  return reservations.value.filter((r) =>
    isUpcoming(r.pelicula.fecha_hora_proyeccion)
  ).length;
});

const pastCount = computed(() => {
  return reservations.value.length - upcomingCount.value;
});

// Load reservations
const loadReservations = async () => {
  if (!currentUser.value?.id) {
    error.value = "No hay usuario autenticado";
    loading.value = false;
    return;
  }

  try {
    loading.value = true;
    error.value = "";
    reservations.value = await getUserReservations(currentUser.value.id);
    
    // Generate QR codes after loading reservations
    await nextTick();
    await generateQRCodes();
  } catch (err: any) {
    console.error("Error cargando reservas:", err);
    error.value = err.message || "Error al cargar las reservas";
  } finally {
    loading.value = false;
  }
};

// Set QR ref
const setQRRef = (el: any, reservaId: string) => {
  if (el && el instanceof HTMLCanvasElement) {
    qrRefs.value.set(reservaId, el);
  }
};

// Generate QR codes for all reservations
const generateQRCodes = async () => {
  for (const reserva of reservations.value) {
    const canvas = qrRefs.value.get(reserva.id);
    if (canvas) {
      try {
        // Create QR data with reservation details
        const qrData = JSON.stringify({
          reservaId: reserva.id,
          peliculaId: reserva.pelicula.id,
          pelicula: reserva.pelicula.nombre,
          sala: reserva.pelicula.sala.nombre,
          asiento: `${reserva.asiento.fila}${reserva.asiento.numero}`,
          fecha: reserva.pelicula.fecha_hora_proyeccion,
          usuarioId: currentUser.value?.id,
        });

        await QRCode.toCanvas(canvas, qrData, {
          width: 112, // 28 * 4 (w-28 = 7rem = 112px)
          margin: 1,
          color: {
            dark: "#C1272D", // ULEAM red
            light: "#FFFFFF",
          },
        });
      } catch (error) {
        console.error("Error generating QR code:", error);
      }
    }
  }
};

// Check if projection is upcoming
const isUpcoming = (fechaProyeccion: string) => {
  return new Date(fechaProyeccion) > new Date();
};

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Format time
const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Get movie details route
const getMovieDetailsRoute = (pelicula: any) => {
  // Crear objeto de película con el formato esperado por MovieDetails
  const movieData = {
    id: pelicula.id,
    nombre: pelicula.nombre,
    descripcion: pelicula.descripcion,
    url_poster: pelicula.url_poster,
    idioma: pelicula.idioma,
    fecha_hora_proyeccion: pelicula.fecha_hora_proyeccion,
    sala_id: pelicula.sala.nombre,
  };
  
  // Codificar el objeto como JSON y pasarlo en la URL
  const encodedMovie = encodeURIComponent(JSON.stringify(movieData));
  return `/movie/${encodedMovie}`;
};

// Display toast
const displayToast = (
  title: string,
  message: string,
  type: "success" | "error" | "warning" | "info"
) => {
  toastTitle.value = title;
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;
};

// Handle cancel reservation
const handleCancelReservation = (reserva: any) => {
  reservationToCancel.value = reserva;
  showCancelModal.value = true;
};

// Confirm cancel reservation
const confirmCancelReservation = async () => {
  if (!reservationToCancel.value || !currentUser.value?.id) return;

  try {
    cancelingId.value = reservationToCancel.value.id;

    await deleteReservation(
      currentUser.value.id,
      reservationToCancel.value.pelicula.id
    );

    // Remove from local array
    reservations.value = reservations.value.filter(
      (r) => r.id !== reservationToCancel.value.id
    );

    displayToast(
      "Reserva Cancelada",
      "Tu reserva ha sido cancelada exitosamente",
      "success"
    );

    closeCancelModal();
  } catch (err: any) {
    console.error("Error cancelando reserva:", err);
    displayToast(
      "Error",
      err.message || "No se pudo cancelar la reserva",
      "error"
    );
  } finally {
    cancelingId.value = null;
  }
};

// Close cancel modal
const closeCancelModal = () => {
  if (cancelingId.value) return; // Don't close while canceling
  showCancelModal.value = false;
  reservationToCancel.value = null;
};

// Check authentication on mount
onMounted(async () => {
  if (!isAuthenticated.value) {
    router.push("/login");
    return;
  }

  await loadReservations();
});
</script>

<style scoped>
/* Custom animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.grid > div {
  animation: fadeIn 0.3s ease-out;
}
</style>
