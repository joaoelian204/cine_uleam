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

        <!-- Tickets Grid - Nuevo diseño inspirado en TicketModal -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div
            v-for="reserva in reservations"
            :key="reserva.id"
            class="bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden transform transition-all hover:scale-105 border border-white/20"
            style="font-family: 'Inter', 'Segoe UI', sans-serif; backdrop-filter: blur(20px);"
          >
            <!-- Header elegante como TicketModal -->
            <div
              class="bg-linear-to-r from-[#C1272D] via-[#DC2626] to-[#8B1F23] p-2 text-white relative"
              style="background: linear-gradient(135deg, #C1272D 0%, #DC2626 50%, #8B1F23 100%);"
            >
              <!-- Status Badge -->
              <div
                :class="[
                  'absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold shadow-lg',
                  isUpcoming(reserva.pelicula.fecha_hora_proyeccion)
                    ? 'bg-green-500/90 text-white backdrop-blur-sm'
                    : 'bg-gray-500/90 text-white backdrop-blur-sm'
                ]"
              >
                {{ isUpcoming(reserva.pelicula.fecha_hora_proyeccion) ? '✅ Próxima' : '⏰ Pasada' }}
              </div>
              
              <div class="text-center pr-16">
                <h2 class="text-xs font-bold">CineUleam</h2>
                <p class="text-xs text-white/90">ENTRADA DIGITAL</p>
                <div class="mt-1 bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5 inline-block">
                  <p class="text-xs font-semibold">Ticket Confirmado</p>
                </div>
              </div>
            </div>

            <!-- Imagen de la película prominente -->
            <div class="relative h-40 bg-gray-900">
              <img
                :src="reserva.pelicula.url_poster || '/placeholder-movie.jpg'"
                :alt="reserva.pelicula.nombre"
                class="w-full h-full object-cover object-center"
                @error="handleImageError"
              />
              <!-- Overlay gradiente para mejor legibilidad -->
              <div class="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"></div>
              
              <!-- Título de la película en overlay -->
              <div class="absolute bottom-3 left-3 right-3">
                <h3 class="text-white text-base font-bold leading-tight drop-shadow-lg">
                  {{ reserva.pelicula.nombre }}
                </h3>
                <div class="flex items-center gap-2 mt-1">
                  <span class="bg-black/40 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-white font-medium">
                    {{ reserva.pelicula.idioma || 'Español' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Contenido del ticket inspirado en TicketModal -->
            <div class="p-3 space-y-3 bg-white/85 backdrop-blur-sm">
              
              <!-- Grid de detalles como TicketModal -->
              <div class="grid grid-cols-2 gap-2">
                <!-- Fecha -->
                <div class="bg-white/95 rounded-lg p-2 border border-blue-200 text-center shadow-sm">
                  <p class="text-xs text-blue-600 font-bold mb-1">📅 FECHA</p>
                  <p class="font-bold text-gray-800 text-xs leading-tight">
                    {{ formatDate(reserva.pelicula.fecha_hora_proyeccion) }}
                  </p>
                </div>
                
                <!-- Hora -->
                <div class="bg-white/95 rounded-lg p-2 border border-green-200 text-center shadow-sm">
                  <p class="text-xs text-green-600 font-bold mb-1">🕐 HORA</p>
                  <p class="font-bold text-gray-800 text-sm">
                    {{ formatTime(reserva.pelicula.fecha_hora_proyeccion) }}
                  </p>
                </div>

                <!-- Sala -->
                <div class="bg-white/95 rounded-lg p-2 border border-purple-200 text-center shadow-sm">
                  <p class="text-xs text-purple-600 font-bold mb-1">🏢 SALA</p>
                  <p class="font-bold text-gray-800 text-sm">
                    {{ reserva.pelicula.sala.nombre }}
                  </p>
                </div>

                <!-- Asiento -->
                <div class="bg-white/95 rounded-lg p-2 border border-red-200 text-center shadow-sm">
                  <p class="text-xs text-red-600 font-bold mb-1">💺 ASIENTO</p>
                  <p class="font-bold text-gray-800 text-lg">
                    {{ reserva.asiento.fila }}{{ reserva.asiento.numero }}
                  </p>
                </div>
              </div>

              <!-- QR Code mejorado como TicketModal -->
              <div class="text-center bg-white/95 rounded-lg p-4 border-2 border-gray-100">
                <p class="text-sm font-bold text-gray-800 mb-3 tracking-wide">📱 CÓDIGO QR</p>
                <div class="flex justify-center bg-white rounded-lg p-4 shadow-inner">
                  <div class="bg-white p-3 rounded-lg border-2 border-gray-200 shadow-sm flex justify-center items-center">
                    <canvas
                      :ref="(el) => setQRRef(el, reserva.id)"
                      style="display: block; width: 180px; height: 180px; border: 1px solid #e5e7eb;"
                    ></canvas>
                  </div>
                </div>
                <p class="text-xs text-gray-500 mt-3 font-medium">Escanea en la entrada</p>
              </div>

              <!-- ID Reserva como TicketModal -->
              <div class="text-center bg-gray-50/90 rounded-lg p-2 border border-gray-200">
                <p class="text-xs text-gray-600 mb-1 font-bold">🔖 ID RESERVA</p>
                <p class="font-mono text-sm text-gray-800 bg-white/90 py-1 px-3 rounded-md border">
                  {{ reserva.id.substring(0, 8) }}
                </p>
              </div>

              <!-- Fecha de reserva -->
              <div class="text-center bg-blue-50/90 rounded-lg p-2">
                <p class="text-xs text-blue-700 font-medium">
                  📆 Reservado el {{ formatDate(reserva.fecha_creacion) }}
                </p>
              </div>
            </div>

            <!-- Footer con acciones -->
            <div class="bg-gray-50/90 backdrop-blur-sm p-2 border-t border-[#C1272D]/20">
              <div class="flex gap-2">
                <router-link
                  :to="`/movie/${reserva.pelicula.id}`"
                  class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-3 rounded-lg transition-colors text-xs text-center flex items-center justify-center gap-1"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Ver Detalles
                </router-link>
                
                <button
                  @click="downloadTicketPDF(reserva)"
                  class="flex-1 bg-[#C1272D] hover:bg-[#8B1F23] text-white font-medium py-2 px-3 rounded-lg transition-colors text-xs flex items-center justify-center gap-1"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  PDF
                </button>
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
</div>
</template>

<script setup lang="ts">
import {
  CalendarIcon,
  ClockIcon,
  ExclamationCircleIcon,
  FilmIcon,
  TicketIcon,
} from "@heroicons/vue/24/outline";
import QRCode from "qrcode";
import { computed, nextTick, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Toast from "../components/Toast.vue";
import { useAuth } from "../composables/useAuth";
import { usePDFTicket } from "../composables/usePDFTicket";
import { useReservations } from "../composables/useReservations";

const router = useRouter();
const { currentUser, isAuthenticated } = useAuth();
const { getUserReservations } = useReservations();
const { downloadTicketPDF: generatePDF } = usePDFTicket();

const reservations = ref<any[]>([]);
const loading = ref(true);
const error = ref("");

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
    
    // Display existing QR codes after loading reservations
    await nextTick();
    
    // Si no hay refs disponibles, esperar un poco más para que se rendericen
    if (qrRefs.value.size === 0) {
      await new Promise(resolve => setTimeout(resolve, 100));
      await nextTick();
    }
    
    await displayExistingQRCodes();
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
    
    // Generar QR inmediatamente cuando el canvas esté disponible
    nextTick(() => {
      generateQRForReservation(reservaId);
    });
  }
};

// Generate QR for specific reservation
const generateQRForReservation = async (reservaId: string) => {
  const reserva = reservations.value.find(r => r.id === reservaId);
  const canvas = qrRefs.value.get(reservaId);
  
  if (!canvas || !reserva) {
    return;
  }
  
  if (reserva.qr_code) {
    try {
      // Configurar dimensiones del canvas explícitamente
      canvas.width = 180;   // QR más grande para mejor escaneado móvil
      canvas.height = 180;  // QR más grande para mejor escaneado móvil
      
      await QRCode.toCanvas(canvas, reserva.qr_code, {
        width: 180,  // QR más grande para mejor escaneado móvil
        margin: 1,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
        errorCorrectionLevel: 'M',
      });
    } catch (error) {
      console.error(`Error generando QR para reserva ${reservaId}:`, error);
      
      // Mostrar mensaje de error en el canvas
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = 180;
        canvas.height = 180;
        ctx.fillStyle = '#f3f4f6';
        ctx.fillRect(0, 0, 180, 180);
        ctx.fillStyle = '#ef4444';
        ctx.font = '16px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('Error QR', 90, 90);
      }
    }
  } else {
    // Si no hay QR, mostrar mensaje
    const ctx = canvas.getContext('2d');
    if (ctx) {
      canvas.width = 180;
      canvas.height = 180;
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(0, 0, 180, 180);
      ctx.fillStyle = '#6b7280';
      ctx.font = '14px Inter';
      ctx.textAlign = 'center';
      ctx.fillText('QR no', 90, 85);
      ctx.fillText('disponible', 90, 105);
    }
  }
};

// Display existing QR codes from database
const displayExistingQRCodes = async () => {
  for (const reserva of reservations.value) {
    const canvas = qrRefs.value.get(reserva.id);
    
    if (canvas && reserva.qr_code) {
      try {
        // Configurar dimensiones del canvas explícitamente
        canvas.width = 180;
        canvas.height = 180;
        canvas.style.width = '180px';
        canvas.style.height = '180px';
        
        // El QR code almacenado en la base de datos ya es un string JSON válido
        await QRCode.toCanvas(canvas, reserva.qr_code, {
          width: 180,
          margin: 1,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
          errorCorrectionLevel: 'M',
        });
      } catch (error) {
        console.error("Error displaying QR code:", error);
        
        // Mostrar mensaje de error en el canvas
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = 180;
          canvas.height = 180;
          ctx.fillStyle = '#f3f4f6';
          ctx.fillRect(0, 0, 180, 180);
          ctx.fillStyle = '#ef4444';
          ctx.font = '16px Inter';
          ctx.textAlign = 'center';
          ctx.fillText('Error QR', 90, 90);
        }
      }
    } else if (canvas && !reserva.qr_code) {
      // Si no hay QR en la base de datos, mostrar un mensaje de error
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = 180;
        canvas.height = 180;
        ctx.fillStyle = '#f3f4f6';
        ctx.fillRect(0, 0, 180, 180);
        ctx.fillStyle = '#6b7280';
        ctx.font = '14px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('QR no', 90, 85);
        ctx.fillText('disponible', 90, 105);
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

// Handle image error for posters
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = '/placeholder-movie.jpg';
  img.onerror = null; // Prevent infinite loop
};

// Download ticket as PDF
const downloadTicketPDF = async (reserva: any) => {
  try {
    const ticketData = {
      reservationId: reserva.id,
      movieName: reserva.pelicula.nombre,
      movieLanguage: reserva.pelicula.idioma || 'Español',
      dateTime: reserva.pelicula.fecha_hora_proyeccion,
      salaName: reserva.pelicula.sala.nombre,
      seatRow: reserva.asiento.fila,
      seatNumber: reserva.asiento.numero,
      userName: currentUser.value?.nombre || 'Usuario',
      userEmail: currentUser.value?.correo_institucional || ''
    };

    await generatePDF(
      ticketData,
      `ticket-${reserva.pelicula.nombre.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${reserva.id.substring(0, 8)}.pdf`
    );

    showToast.value = true;
    toastType.value = "success";
    toastTitle.value = "¡Descarga Exitosa!";
    toastMessage.value = "Tu ticket PDF se ha descargado correctamente.";
  } catch (error) {
    console.error('Error downloading PDF:', error);
    showToast.value = true;
    toastType.value = "error";
    toastTitle.value = "Error";
    toastMessage.value = "No se pudo descargar el PDF. Inténtalo de nuevo.";
  }
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
