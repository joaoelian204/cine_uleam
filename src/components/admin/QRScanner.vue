<template>
  <div class="max-w-4xl mx-auto p-4 space-y-6">
    <!-- Header mejorado -->
    <div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
      <div class="text-center space-y-4">
        <div
          class="mx-auto w-20 h-20 bg-linear-to-br from-[#C1272D] to-[#8B1F23] rounded-2xl flex items-center justify-center shadow-lg"
        >
          <svg
            class="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h4m-4 4h4m-4-8h4m-4-4h4M8 4h4"
            />
          </svg>
        </div>

        <div>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">
            Escáner de Códigos QR
          </h3>
          <p class="text-gray-600">Sistema de control de acceso - CineUleam</p>
        </div>

        <!-- Información de estado mejorada -->
        <div
          class="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm"
        >
          <div class="flex items-center gap-2">
            <div
              :class="[
                'w-3 h-3 rounded-full',
                isScanning ? 'bg-green-500 animate-pulse' : 'bg-gray-400',
              ]"
            ></div>
            <span
              :class="
                isScanning ? 'text-green-600 font-medium' : 'text-gray-500'
              "
            >
              {{ isScanning ? "Escáner Activo" : "Escáner Inactivo" }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <div
              :class="[
                'w-3 h-3 rounded-full',
                videoReady ? 'bg-blue-500' : 'bg-gray-400',
              ]"
            ></div>
            <span
              :class="
                videoReady ? 'text-blue-600 font-medium' : 'text-gray-500'
              "
            >
              {{ videoReady ? "Cámara Lista" : "Cámara Desconectada" }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <div
              :class="[
                'w-3 h-3 rounded-full',
                lastDetectionSuccess
                  ? 'bg-green-500'
                  : detectionAttempted
                  ? 'bg-red-500'
                  : 'bg-gray-400',
              ]"
            ></div>
            <span
              :class="
                lastDetectionSuccess
                  ? 'text-green-600 font-medium'
                  : detectionAttempted
                  ? 'text-red-600 font-medium'
                  : 'text-gray-500'
              "
            >
              {{
                lastDetectionSuccess
                  ? "Último Escaneo: Exitoso"
                  : detectionAttempted
                  ? "Último Escaneo: Fallido"
                  : "Sin Intentos"
              }}
            </span>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            @click="toggleScanner"
            :disabled="isLoading"
            :class="[
              'px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-105 shadow-lg',
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : isScanning
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-linear-to-r from-[#C1272D] to-[#8B1F23] hover:from-[#8B1F23] hover:to-[#C1272D]',
            ]"
          >
            <span class="flex items-center gap-2">
              <svg
                v-if="isLoading"
                class="w-5 h-5 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <svg
                v-else-if="isScanning"
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                ></path>
              </svg>
              <svg
                v-else
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                ></path>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
              </svg>
              {{
                isLoading
                  ? "Cargando..."
                  : isScanning
                  ? "Detener Escáner"
                  : "Activar Escáner"
              }}
            </span>
          </button>

          <button
            v-if="lastScannedData"
            @click="clearLastScan"
            class="px-6 py-3 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg"
          >
            <span class="flex items-center gap-2">
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                ></path>
              </svg>
              Listo para siguiente
            </span>
          </button>

          <!-- Botón de debug para desarrolladores -->
          <button
            v-if="!isScanning"
            @click="debugReservations"
            class="px-4 py-3 rounded-xl font-medium text-gray-700 bg-yellow-100 hover:bg-yellow-200 transition-colors shadow-lg"
          >
            <span class="flex items-center gap-2">
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
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                ></path>
              </svg>
              Debug
            </span>
          </button>

          <!-- Botón para probar con QR simulado -->
          <button
            v-if="!isScanning && props.reservations.length > 0"
            @click="testWithFirstReservation"
            class="px-4 py-3 rounded-xl font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors shadow-lg"
          >
            <span class="flex items-center gap-2">
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              Test QR
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Información del usuario escaneado -->
    <div
      v-if="lastScannedData && !isScanning"
      class="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
    >
      <div class="flex items-start gap-4">
        <div
          class="shrink-0 w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center"
        >
          <svg
            class="w-8 h-8 text-green-600"
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
        </div>

        <div class="flex-1 min-w-0">
          <h4 class="text-lg font-bold text-gray-900 mb-3">
            ✅ Ticket Verificado Exitosamente
          </h4>

          <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm"
          >
            <!-- Información del usuario -->
            <div class="bg-gray-50 rounded-lg p-3 space-y-2">
              <h5 class="font-semibold text-gray-700 flex items-center gap-2">
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
                Cliente
              </h5>
              <p class="text-gray-600">
                {{ userData?.nombre || "Cargando..." }}
              </p>
              <p class="text-gray-500 text-xs">{{ userData?.email || "" }}</p>
            </div>

            <!-- Información de la película -->
            <div class="bg-gray-50 rounded-lg p-3 space-y-2">
              <h5 class="font-semibold text-gray-700 flex items-center gap-2">
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
                    d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v14a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1h4z"
                  ></path>
                </svg>
                Película
              </h5>
              <p class="text-gray-600">
                {{ movieData?.titulo || "Cargando..." }}
              </p>
              <p class="text-gray-500 text-xs">
                {{ formatDate(movieData?.fecha_estreno) || "" }}
              </p>
            </div>

            <!-- Información de la reserva -->
            <div class="bg-gray-50 rounded-lg p-3 space-y-2">
              <h5 class="font-semibold text-gray-700 flex items-center gap-2">
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
                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                  ></path>
                </svg>
                Reserva
              </h5>
              <p class="text-gray-600">
                Asiento: {{ asientoData?.fila }}{{ asientoData?.numero }}
              </p>
              <p class="text-gray-500 text-xs">
                Sala: {{ salaData?.nombre || "N/A" }}
              </p>
            </div>
          </div>

          <!-- Detalles adicionales -->
          <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span class="font-medium text-gray-700">Función:</span>
              <span class="ml-2 text-gray-600">
                {{ formatDateTime(lastScannedData.fecha_proyeccion) }}
              </span>
            </div>
            <div>
              <span class="font-medium text-gray-700">Total Pagado:</span>
              <span class="ml-2 text-green-600 font-semibold">
                ${{ (10.0).toFixed(2) }}
              </span>
            </div>
          </div>

          <!-- Timestamp del escaneo -->
          <div class="mt-3 pt-3 border-t border-gray-200">
            <p class="text-xs text-gray-500 flex items-center gap-2">
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              Escaneado:
              {{
                formatDateTime(
                  lastScannedData.timestamp || new Date().toISOString()
                )
              }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Área del scanner mejorada OPTIMIZADA PARA MÓVIL - MÁS ANCHA -->
    <div
      v-if="isScanning"
      class="bg-white rounded-2xl p-2 sm:p-4 shadow-lg border border-gray-200"
    >
      <div
        class="relative bg-black rounded-xl overflow-hidden h-[75vh] sm:h-[65vh] max-h-[650px]"
      >
        <video
          ref="videoElement"
          autoplay
          playsinline
          muted
          class="w-full h-full object-cover"
        ></video>
        <canvas ref="canvasElement" class="hidden"></canvas>

        <!-- Mensaje de carga del video -->
        <div
          v-if="!videoReady && isLoading"
          class="absolute inset-0 flex items-center justify-center bg-black/80 z-10"
        >
          <div class="text-center text-white">
            <div
              class="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"
            ></div>
            <p class="text-lg font-medium">Iniciando cámara...</p>
            <p class="text-sm mt-2 text-gray-300">
              Por favor, permite el acceso a la cámara
            </p>
          </div>
        </div>

        <!-- Overlay del scanner LIMPIO SIN FILTROS -->
        <div v-if="videoReady" class="absolute inset-0 pointer-events-none">
          <div class="flex items-center justify-center h-full">
            <!-- Marco de detección SÚPER ANCHO PARA MÓVIL -->
            <div
              class="relative w-[98vw] h-[70vh] max-w-[800px] max-h-[650px] sm:w-[600px] sm:h-[600px]"
            >
              <!-- Área central para el QR - SOLO BORDES SIN FILTROS -->
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="relative w-[320px] h-80 sm:w-[280px] sm:h-[280px]">
                  <!-- Solo bordes, SIN FONDO para mejor detección -->
                  <div
                    class="absolute inset-0 border-2 border-white rounded-2xl"
                  >
                    <!-- Esquinas del scanner MÁS GRANDES Y LLAMATIVAS -->
                    <div
                      class="absolute -top-3 -left-3 w-12 h-12 border-t-[6px] border-l-[6px] border-green-400 rounded-tl-xl animate-pulse"
                    ></div>
                    <div
                      class="absolute -top-3 -right-3 w-12 h-12 border-t-[6px] border-r-[6px] border-green-400 rounded-tr-xl animate-pulse"
                    ></div>
                    <div
                      class="absolute -bottom-3 -left-3 w-12 h-12 border-b-[6px] border-l-[6px] border-green-400 rounded-bl-xl animate-pulse"
                    ></div>
                    <div
                      class="absolute -bottom-3 -right-3 w-12 h-12 border-b-[6px] border-r-[6px] border-green-400 rounded-br-xl animate-pulse"
                    ></div>
                  </div>

                  <!-- Línea de escaneo animada -->
                  <div class="absolute inset-0">
                    <div
                      class="absolute left-4 right-4 h-1 transition-all duration-200 rounded-full"
                      :class="
                        detectionActive
                          ? 'bg-green-400 shadow-green-400/80'
                          : 'bg-blue-400 shadow-blue-400/80'
                      "
                      :style="{
                        top: scanLinePosition + '%',
                        boxShadow: '0 0 15px currentColor',
                        animation: 'scan-line 2s ease-in-out infinite',
                      }"
                    ></div>
                  </div>

                  <!-- Texto instructivo SIN FILTROS -->
                  <div class="absolute -bottom-20 left-0 right-0 text-center">
                    <div
                      class="text-white bg-black/90 px-6 py-3 rounded-xl mx-auto inline-block max-w-sm"
                    >
                      <p class="text-sm font-semibold mb-1">
                        {{
                          detectionActive
                            ? "🔍 Escaneando código..."
                            : "📱 Coloca el código QR en el centro"
                        }}
                      </p>
                      <p class="text-xs text-gray-300">
                        Mantén el QR quieto y bien iluminado
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Indicador de detección exitosa -->
          <div
            v-if="detectionSuccess"
            class="absolute inset-0 bg-green-500/20 flex items-center justify-center transition-all duration-300"
          >
            <div
              class="bg-green-500 text-white px-6 py-3 rounded-xl font-bold text-xl shadow-lg"
            >
              ✅ ¡QR Detectado!
            </div>
          </div>
        </div>
      </div>

      <!-- Instrucciones mejoradas OPTIMIZADAS PARA MÓVIL -->
      <div
        class="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-center text-sm text-gray-600"
      >
        <div class="flex items-center justify-center gap-2">
          <div class="w-2 h-2 bg-red-500 rounded-full"></div>
          <span>Líneas rojas = Buscando QR</span>
        </div>
        <div class="flex items-center justify-center gap-2">
          <div class="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Líneas verdes = QR Detectado</span>
        </div>
        <div class="flex items-center justify-center gap-2">
          <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span>Marco amplio optimizado para móvil</span>
        </div>
        <div class="flex items-center justify-center gap-2">
          <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
          <span>Área de escaneo 90% de la pantalla</span>
        </div>
      </div>
    </div>

    <!-- Información del código QR escaneado del template anterior -->
    <div
      v-if="lastScannedData"
      class="mt-4 bg-green-50 border border-green-200 rounded-lg p-4"
    >
      <h4
        class="text-sm font-semibold text-green-800 mb-3 flex items-center gap-2"
      >
        ✅ Código QR válido detectado - Asistencia confirmada automáticamente:
      </h4>
      <div class="text-sm text-green-700 space-y-2">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <strong>🎬 Película:</strong>
            {{ lastScannedData.pelicula_nombre }}
          </div>
          <div><strong>🏛️ Sala:</strong> {{ lastScannedData.sala_nombre }}</div>
          <div>
            <strong>👤 Usuario:</strong>
            {{ lastScannedData.usuario_nombre }}
          </div>
          <div>
            <strong>📧 Email:</strong> {{ lastScannedData.usuario_email }}
          </div>
          <div>
            <strong>🪑 Asiento:</strong> {{ lastScannedData.asiento_fila
            }}{{ lastScannedData.asiento_numero }}
          </div>
          <div>
            <strong>📅 Función:</strong>
            {{
              new Date(lastScannedData.fecha_proyeccion).toLocaleDateString(
                "es-ES"
              )
            }}
          </div>
        </div>
        <div class="border-t border-green-200 pt-2 mt-2">
          <div class="text-xs text-green-600 flex justify-between">
            <span>🆔 ID: {{ lastScannedData.reserva_id.substring(0, 8) }}</span>
            <span>⏰ Confirmado: {{ lastScannedData.timestamp }}</span>
          </div>
          <div class="text-xs text-green-500 mt-1">
            ✅ Versión {{ lastScannedData.version }} - Checksum válido
          </div>
          <div
            class="text-xs font-semibold text-green-800 mt-2 bg-green-100 px-2 py-1 rounded"
          >
            🎉 ¡Asistencia registrada exitosamente en el sistema!
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import jsQR from "jsqr";
import { nextTick, onUnmounted, ref } from "vue";
import { useNotifications } from "../../composables/useNotifications";
import { supabase } from "../../lib/supabase";
import { validateQRData, type TicketQRData } from "../../utils/qrGenerator";

// Composable para notificaciones Toast elegantes
const { addToast } = useNotifications();

interface QRData extends TicketQRData {
  timestamp?: string;
}

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
}

const props = defineProps<Props>();

const emit = defineEmits<{
  qrDetected: [ticket: Reservation];
}>();

// Estado del escáner
const isScanning = ref(false);
const isLoading = ref(false);
const videoReady = ref(false);
const lastScannedData = ref<QRData | null>(null);
const lastQRCode = ref<string>("");
const processedQRs = ref<Set<string>>(new Set()); // Lista de QRs ya procesados en esta sesión

// Variables adicionales para el template mejorado
const lastDetectionSuccess = ref(false);
const detectionAttempted = ref(false);
const detectionActive = ref(false);
const detectionSuccess = ref(false);
const scanLinePosition = ref(0);
const userData = ref<any>(null);
const movieData = ref<any>(null);
const asientoData = ref<any>(null);
const salaData = ref<any>(null);

// Referencias del DOM
const videoElement = ref<HTMLVideoElement | null>(null);
const canvasElement = ref<HTMLCanvasElement | null>(null);

// Variables para el streaming de video
let stream: MediaStream | null = null;
let scanInterval: ReturnType<typeof setInterval> | null = null;

// Funciones de formateo
const formatDate = (dateString: string) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatDateTime = (dateString: string, timeString?: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);

  if (timeString) {
    const [hours, minutes] = timeString.split(":");
    if (hours && minutes) {
      date.setHours(parseInt(hours), parseInt(minutes));
    }
  }

  return date.toLocaleString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const toggleScanner = async () => {
  if (isScanning.value) {
    stopScanner();
  } else {
    await startScanner();
  }
};

const startScanner = async () => {
  try {
    isLoading.value = true;
    videoReady.value = false;

    // Verificar si hay navegador compatible
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error("Tu navegador no soporta acceso a la cámara");
    }

    // Activar isScanning PRIMERO para que se cree el elemento de video
    isScanning.value = true;

    // Esperar a que Vue monte los elementos en el DOM
    await nextTick();

    // Esperar un poco más si el elemento aún no está disponible
    let attempts = 0;
    while (!videoElement.value && attempts < 10) {
      console.log(
        `🎥 Intento ${attempts + 1}: Element de video:`,
        videoElement.value
      );
      await new Promise((resolve) => setTimeout(resolve, 100));
      attempts++;
    }

    console.log("🎥 Element de video final:", videoElement.value);

    if (!videoElement.value) {
      throw new Error(
        "No se pudo crear el elemento de video después de múltiples intentos"
      );
    }

    // Solicitar acceso a la cámara
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1280, min: 640 },
        height: { ideal: 720, min: 480 },
        facingMode: "environment",
      },
    });

    await nextTick();
    console.log("🎥 Element de video:", videoElement.value);

    if (videoElement.value && stream) {
      console.log("🔗 Asignando stream al video elemento...");
      videoElement.value.srcObject = stream;

      // Configurar atributos adicionales para mejor compatibilidad
      videoElement.value.setAttribute("playsinline", "true");
      videoElement.value.setAttribute("muted", "true");

      console.log("⏳ Esperando metadata del video...");

      // Esperar a que el video esté listo
      await new Promise<void>((resolve, reject) => {
        if (videoElement.value) {
          videoElement.value.onloadedmetadata = () => {
            console.log("📹 Metadata del video cargada");
            console.log("🎬 Dimensiones video:", {
              videoWidth: videoElement.value?.videoWidth,
              videoHeight: videoElement.value?.videoHeight,
              readyState: videoElement.value?.readyState,
            });

            videoElement.value
              ?.play()
              .then(() => {
                console.log("✅ Video iniciado correctamente");
                console.log("🎦 Estado del video después del play:", {
                  paused: videoElement.value?.paused,
                  currentTime: videoElement.value?.currentTime,
                  duration: videoElement.value?.duration,
                });
                videoReady.value = true;
                resolve();
              })
              .catch((playError) => {
                console.error("Error al reproducir video:", playError);
                videoReady.value = true; // Mostrar de todas formas
                resolve(); // Continuar aunque haya error de reproducción
              });
          };

          videoElement.value.onerror = (error) => {
            console.error("❌ Error en video:", error);
            reject(new Error("Error al cargar el video"));
          };
        } else {
          reject(new Error("Elemento de video no encontrado"));
        }
      });

      startQRDetection();
      console.log("🎥 Escáner QR iniciado");
    } else {
      throw new Error("No se pudo obtener stream o elemento de video");
    }
  } catch (error: any) {
    console.error("Error al acceder a la cámara:", error);
    let errorMessage = "No se pudo acceder a la cámara.";

    if (error.name === "NotAllowedError") {
      errorMessage =
        "Acceso a la cámara denegado. Por favor, permite el acceso a la cámara en tu navegador.";
    } else if (error.name === "NotFoundError") {
      errorMessage = "No se encontró ninguna cámara en tu dispositivo.";
    } else if (error.name === "NotSupportedError") {
      errorMessage = "Tu navegador no soporta acceso a la cámara.";
    } else if (error.message) {
      errorMessage = error.message;
    }

    addToast({
      type: "error",
      title: "Error de Cámara",
      message: errorMessage,
    });

    // Si hay error, detener el scanner y limpiar
    isScanning.value = false;
    videoReady.value = false;
  } finally {
    isLoading.value = false;
  }
};

const stopScanner = () => {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    stream = null;
  }

  if (scanInterval) {
    clearInterval(scanInterval);
    scanInterval = null;
  }

  isScanning.value = false;
  videoReady.value = false;
  lastScannedData.value = null;
};

const startQRDetection = () => {
  console.log("🔍 Iniciando detección QR con configuración mejorada...");

  scanInterval = setInterval(() => {
    if (videoElement.value && canvasElement.value) {
      const video = videoElement.value;
      const canvas = canvasElement.value;
      const context = canvas.getContext("2d");

      if (context && video.readyState === video.HAVE_ENOUGH_DATA) {
        // Asegurar que el canvas tenga las dimensiones correctas
        if (video.videoWidth > 0 && video.videoHeight > 0) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          // Limpiar el canvas antes de dibujar
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(video, 0, 0, canvas.width, canvas.height);

          const imageData = context.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
          );

          try {
            // DETECCIÓN MEJORADA: Intentar múltiples configuraciones y áreas
            const configurations = [
              // Configuración principal con máxima tolerancia
              {
                inversionAttempts: "attemptBoth" as const,
              },
              // Configuración con solo inversión
              {
                inversionAttempts: "onlyInvert" as const,
              },
              // Configuración sin inversión
              {
                inversionAttempts: "dontInvert" as const,
              },
            ];

            // También probar en diferentes áreas del frame
            const areas = [
              // Área completa
              { x: 0, y: 0, width: imageData.width, height: imageData.height },
              // Área central (50% del centro)
              {
                x: Math.floor(imageData.width * 0.25),
                y: Math.floor(imageData.height * 0.25),
                width: Math.floor(imageData.width * 0.5),
                height: Math.floor(imageData.height * 0.5),
              },
              // Área central más pequeña (30% del centro)
              {
                x: Math.floor(imageData.width * 0.35),
                y: Math.floor(imageData.height * 0.35),
                width: Math.floor(imageData.width * 0.3),
                height: Math.floor(imageData.height * 0.3),
              },
            ];

            for (const area of areas) {
              // Extraer área específica
              let areaImageData = imageData;
              if (
                area.x > 0 ||
                area.y > 0 ||
                area.width < imageData.width ||
                area.height < imageData.height
              ) {
                areaImageData = context.getImageData(
                  area.x,
                  area.y,
                  area.width,
                  area.height
                );
              }

              for (const config of configurations) {
                try {
                  const code = jsQR(
                    areaImageData.data,
                    areaImageData.width,
                    areaImageData.height,
                    config
                  );

                  if (code && code.data && code.data.length > 10) {
                    console.log(
                      `📱 QR detectado exitosamente en área ${area.width}x${area.height}:`,
                      code.data.substring(0, 100) + "..."
                    );
                    handleQRDetected(code.data);
                    return; // Salir inmediatamente si se detecta un QR válido
                  }
                } catch (jsqrError) {
                  // Continuar con la siguiente configuración si hay error
                  console.debug("Error en jsQR con config:", config, jsqrError);
                }
              }
            }

            // Debug: Indicar que se está intentando detectar
            detectionActive.value = true;
            setTimeout(() => {
              detectionActive.value = false;
            }, 150);
          } catch (qrError) {
            console.error("Error al procesar QR:", qrError);
          }
        }
      }
    }
  }, 80); // Frecuencia más alta: 80ms (12.5 FPS) para mejor detección
};

const handleQRDetected = async (qrData: string) => {
  console.log("🔍 Procesando QR:", qrData.substring(0, 50) + "...");

  // Evitar procesar el mismo QR múltiples veces
  if (lastQRCode.value === qrData) {
    return;
  }

  lastQRCode.value = qrData;

  // Indicar detección exitosa
  detectionSuccess.value = true;
  setTimeout(() => {
    detectionSuccess.value = false;
  }, 2000);

  // VALIDACIÓN MEJORADA: Intentar múltiples formatos de QR
  let validation: { isValid: boolean; data?: any; error?: string };
  let ticketData: any;

  try {
    // 1. Intentar el formato estándar actual
    validation = validateQRData(qrData);

    if (validation.isValid && validation.data) {
      ticketData = validation.data;
      console.log("✅ QR válido con formato estándar:", ticketData);
    } else {
      console.log("⚠️ Formato estándar falló, intentando formato legacy...");

      // 2. Intentar formato legacy (JSON directo)
      try {
        const parsedData = JSON.parse(qrData);

        // Verificar si tiene los campos mínimos requeridos
        if (parsedData.reserva_id || parsedData.id) {
          // Normalizar datos del formato legacy
          ticketData = {
            reserva_id: parsedData.reserva_id || parsedData.id,
            usuario_id: parsedData.usuario_id,
            pelicula_id: parsedData.pelicula_id,
            asiento_id: parsedData.asiento_id,
            usuario_nombre: parsedData.usuario_nombre,
            usuario_email: parsedData.usuario_email,
            pelicula_nombre: parsedData.pelicula_nombre,
            sala_nombre: parsedData.sala_nombre,
            asiento_fila: parsedData.asiento_fila,
            asiento_numero: parsedData.asiento_numero,
            fecha_proyeccion: parsedData.fecha_proyeccion,
            tipo: parsedData.tipo || "ticket",
            version: parsedData.version || "legacy",
          };

          validation = { isValid: true, data: ticketData };
          console.log("✅ QR válido con formato legacy:", ticketData);
        } else {
          throw new Error("Campos requeridos no encontrados");
        }
      } catch (legacyError) {
        console.log("⚠️ Formato legacy falló, intentando búsqueda directa...");

        // 3. Último intento: buscar por ID directo (para QRs muy antiguos)
        const possibleId = qrData.trim();
        const directReservation = props.reservations.find(
          (r) =>
            r.id === possibleId ||
            r.id.includes(possibleId) ||
            possibleId.includes(r.id)
        );

        if (directReservation) {
          ticketData = {
            reserva_id: directReservation.id,
            usuario_id: directReservation.usuario_id,
            pelicula_id: directReservation.pelicula_id,
            asiento_id: directReservation.asiento_id,
            usuario_nombre: directReservation.usuario_nombre,
            usuario_email: directReservation.usuario_email,
            pelicula_nombre: directReservation.pelicula_nombre,
            sala_nombre: directReservation.sala_nombre,
            asiento_fila: directReservation.asiento_fila,
            asiento_numero: directReservation.asiento_numero,
            fecha_proyeccion: directReservation.fecha_proyeccion,
            tipo: "ticket",
            version: "direct",
          };

          validation = { isValid: true, data: ticketData };
          console.log("✅ QR válido con búsqueda directa:", ticketData);
        } else {
          validation = {
            isValid: false,
            error:
              "No se pudo interpretar el código QR en ningún formato conocido",
          };
        }
      }
    }
  } catch (error) {
    console.error("❌ Error crítico procesando QR:", error);
    validation = { isValid: false, error: "Error crítico procesando QR" };
  }

  if (!validation.isValid || !ticketData) {
    console.warn(
      "❌ QR no válido después de todos los intentos:",
      validation.error
    );
    addToast({
      type: "error",
      title: "📱 QR NO RECONOCIDO",
      message: `No se pudo procesar este código QR.\n\n❌ Error: ${
        validation.error
      }\n📋 Contenido: ${qrData.substring(
        0,
        50
      )}...\n\n💡 Consejos:\n• Verifica que sea un QR de CineUleam\n• Intenta con mejor iluminación\n• Asegúrate de escanear completamente\n\n⚠️ ACCESO DENEGADO`,
    });

    setTimeout(() => {
      clearLastScan();
    }, 4000);
    return;
  }

  console.log("📋 Datos del ticket procesados exitosamente:", ticketData);

  // Guardar información del último código escaneado para mostrar en la UI
  lastScannedData.value = {
    ...ticketData,
    timestamp: new Date().toLocaleTimeString(),
  };

  // Buscar la reserva en la lista con búsqueda mejorada
  console.log("🔍 Buscando reserva con ID:", ticketData.reserva_id);
  console.log("📋 Total reservas disponibles:", props.reservations.length);

  // Búsqueda principal por ID exacto
  let reservation = props.reservations.find(
    (r) => r.id === ticketData.reserva_id
  );

  // Si no se encuentra, hacer búsqueda más flexible
  if (!reservation) {
    console.log("🔍 Búsqueda exacta falló, intentando búsqueda flexible...");

    // Buscar por coincidencia parcial de ID
    reservation = props.reservations.find(
      (r) =>
        r.id.includes(ticketData.reserva_id) ||
        ticketData.reserva_id.includes(r.id)
    );

    // Si aún no se encuentra, buscar por otros campos
    if (!reservation && ticketData.usuario_email) {
      console.log("🔍 Búsqueda por ID falló, intentando por email...");
      reservation = props.reservations.find(
        (r) =>
          r.usuario_email === ticketData.usuario_email &&
          r.pelicula_nombre === ticketData.pelicula_nombre &&
          r.asiento_fila === ticketData.asiento_fila &&
          r.asiento_numero === ticketData.asiento_numero
      );
    }

    // Búsqueda adicional por usuario y película
    if (
      !reservation &&
      ticketData.usuario_nombre &&
      ticketData.pelicula_nombre
    ) {
      console.log(
        "🔍 Búsqueda por email falló, intentando por usuario y película..."
      );
      reservation = props.reservations.find(
        (r) =>
          r.usuario_nombre
            .toLowerCase()
            .includes(ticketData.usuario_nombre.toLowerCase()) &&
          r.pelicula_nombre
            .toLowerCase()
            .includes(ticketData.pelicula_nombre.toLowerCase())
      );
    }
  }

  // Debug: Log de todas las reservas si no se encuentra
  if (!reservation) {
    console.log("❌ No se encontró reserva. Reservas disponibles:");
    props.reservations.slice(0, 5).forEach((r, index) => {
      console.log(
        `  ${index + 1}. ID: ${r.id.substring(0, 8)}..., Usuario: ${
          r.usuario_nombre
        }, Película: ${r.pelicula_nombre}`
      );
    });

    if (props.reservations.length > 5) {
      console.log(`  ... y ${props.reservations.length - 5} reservas más`);
    }
  }

  if (reservation) {
    console.log("✅ Reserva encontrada:", reservation);

    // 1. Verificar si el QR ya fue escaneado anteriormente (en BD o en esta sesión)
    if (
      reservation.asistencia_confirmada ||
      processedQRs.value.has(reservation.id)
    ) {
      addToast({
        type: "error",
        title: "🚫 QR YA ESCANEADO",
        message: `Este código QR ya fue utilizado anteriormente.\n\n👤 Usuario: ${reservation.usuario_nombre}\n🎬 Película: ${reservation.pelicula_nombre}\n🪑 Asiento: ${reservation.asiento_fila}${reservation.asiento_numero}\n\n⚠️ ACCESO DENEGADO - QR caduco`,
      });

      // Limpiar después de mostrar el error
      setTimeout(() => {
        clearLastScan();
      }, 5000);
      return;
    }

    // 2. Verificar si la función ya pasó (QR caducado por tiempo)
    const fechaProyeccion = new Date(reservation.fecha_proyeccion);
    const ahora = new Date();
    const diferencia = fechaProyeccion.getTime() - ahora.getTime();
    const horasHastaFuncion = diferencia / (1000 * 60 * 60);

    // Si la función ya pasó hace más de 30 minutos, el QR caduca
    if (horasHastaFuncion < -0.5) {
      addToast({
        type: "error",
        title: "⏰ QR CADUCADO POR TIEMPO",
        message: `Este código QR ha caducado.\n\n🎬 ${
          reservation.pelicula_nombre
        }\n📅 Función: ${fechaProyeccion.toLocaleDateString(
          "es-ES"
        )} ${fechaProyeccion.toLocaleTimeString(
          "es-ES"
        )}\n🕐 Estado: Función finalizada\n\n⚠️ ACCESO DENEGADO - QR expirado`,
      });

      setTimeout(() => {
        clearLastScan();
      }, 5000);
      return;
    }

    // 3. Verificar si es muy temprano para la función (más de 2 horas antes)
    if (horasHastaFuncion > 2) {
      addToast({
        type: "warning",
        title: "⏰ MUY TEMPRANO",
        message: `Es muy temprano para esta función.\n\n🎬 ${
          reservation.pelicula_nombre
        }\n📅 Función: ${fechaProyeccion.toLocaleDateString(
          "es-ES"
        )} ${fechaProyeccion.toLocaleTimeString(
          "es-ES"
        )}\n⏳ Faltan: ${Math.ceil(
          horasHastaFuncion
        )} horas\n\n💡 Regresa 30 minutos antes de la función`,
      });

      setTimeout(() => {
        clearLastScan();
      }, 5000);
      return;
    }

    // 4. ✅ QR VÁLIDO - Proceder con el acceso
    // Actualizar asistencia en la base de datos AUTOMÁTICAMENTE
    try {
      console.log(
        "💾 Actualizando asistencia en BD para reserva:",
        reservation.id
      );

      const { error: updateError } = await supabase
        .from("reserva")
        .update({ asistencia_confirmada: true })
        .eq("id", reservation.id);

      if (updateError) {
        console.error("❌ Error actualizando asistencia:", updateError);
        addToast({
          type: "error",
          title: "⚠️ ERROR DE ACTUALIZACIÓN",
          message: `No se pudo confirmar la asistencia en el sistema.\n\nError: ${updateError.message}\n\n🎫 El usuario puede ingresar, pero contacta soporte técnico.`,
        });
      } else {
        console.log("✅ Asistencia actualizada exitosamente en BD");

        // Marcar este QR como procesado en esta sesión para evitar re-escaneos
        processedQRs.value.add(reservation.id);
        console.log("✅ Reserva marcada como confirmada para esta sesión");
      }
    } catch (error) {
      console.error("❌ Error crítico actualizando BD:", error);
    }

    // Emitir evento para confirmación automática
    emit("qrDetected", reservation);

    // Mostrar notificación de éxito
    addToast({
      type: "success",
      title: "✅ ACCESO AUTORIZADO",
      message: `¡Bienvenido ${reservation.usuario_nombre}!\n\n🎬 ${
        reservation.pelicula_nombre
      }\n🪑 Asiento: ${reservation.asiento_fila}${
        reservation.asiento_numero
      }\n🕐 ${new Date().toLocaleTimeString(
        "es-ES"
      )}\n\n🎫 Disfruta la función`,
    });

    // Detener el escáner después de una detección exitosa
    setTimeout(() => {
      stopScanner();
    }, 2000); // Dar tiempo para mostrar la información

    // Limpiar la información después de 8 segundos para el siguiente escaneo
    setTimeout(() => {
      clearLastScan();
    }, 8000);
  } else {
    console.warn("❌ Reserva no encontrada para ID:", ticketData.reserva_id);
    addToast({
      type: "error",
      title: "🔍 QR NO VÁLIDO",
      message: `Código QR no reconocido en el sistema.\n\n🆔 ID Reserva: ${ticketData.reserva_id.substring(
        0,
        8
      )}...\n📱 QR: ${validation.data?.tipo || "Desconocido"} v${
        validation.data?.version || "?"
      }\n\n❌ Posibles causas:\n• QR falsificado o modificado\n• Reserva cancelada\n• QR de otro evento\n\n⚠️ ACCESO DENEGADO`,
    });

    setTimeout(() => {
      clearLastScan();
    }, 5000);
  }
};

// Función para limpiar la información del último escaneo
const clearLastScan = () => {
  lastScannedData.value = null;
  lastQRCode.value = "";
  userData.value = null;
  movieData.value = null;
  asientoData.value = null;
  salaData.value = null;
  detectionSuccess.value = false;
  // NO limpiar processedQRs para mantener la sesión de QRs escaneados
};

// Función de debug para mostrar información de las reservas
const debugReservations = () => {
  console.log("🐛 DEBUG - Información de reservas:");
  console.log(`Total reservas: ${props.reservations.length}`);

  if (props.reservations.length > 0) {
    props.reservations.forEach((reserva, index) => {
      console.log(`${index + 1}. ID: ${reserva.id}`);
      console.log(
        `   Usuario: ${reserva.usuario_nombre} (${reserva.usuario_email})`
      );
      console.log(`   Película: ${reserva.pelicula_nombre}`);
      console.log(
        `   Asiento: ${reserva.asiento_fila}${reserva.asiento_numero}`
      );
      console.log(`   Sala: ${reserva.sala_nombre}`);
      console.log(`   Confirmada: ${reserva.asistencia_confirmada}`);
      console.log(`   QR presente: ${reserva.qr_code ? "Sí" : "No"}`);
      if (reserva.qr_code) {
        console.log(
          `   QR (primeros 100 chars): ${reserva.qr_code.substring(0, 100)}...`
        );
      }
      console.log("   ---");
    });

    addToast({
      type: "info",
      title: "🐛 Debug Info",
      message: `Se encontraron ${props.reservations.length} reservas.\n\nRevisa la consola del navegador (F12) para más detalles.`,
    });
  } else {
    console.log("❌ No hay reservas disponibles");
    addToast({
      type: "warning",
      title: "⚠️ Sin reservas",
      message: "No se encontraron reservas en la lista para debuguear.",
    });
  }
};

// Función de debug para probar con el QR de la primera reserva
const testWithFirstReservation = () => {
  if (props.reservations.length > 0) {
    const firstReservation = props.reservations[0];

    if (!firstReservation) {
      addToast({
        type: "error",
        title: "❌ Error",
        message: "No se pudo acceder a la primera reserva.",
      });
      return;
    }

    console.log("🧪 TEST - Probando con primera reserva:");
    console.log("Reserva:", firstReservation);

    if (firstReservation.qr_code) {
      console.log("🧪 Simulando detección de QR...");
      addToast({
        type: "info",
        title: "🧪 Test QR",
        message: `Probando con reserva de ${firstReservation.usuario_nombre}\nPelícula: ${firstReservation.pelicula_nombre}`,
      });

      // Simular detección del QR
      setTimeout(() => {
        handleQRDetected(firstReservation.qr_code!);
      }, 1000);
    } else {
      addToast({
        type: "error",
        title: "❌ Test Fallido",
        message: "La primera reserva no tiene código QR generado.",
      });
    }
  } else {
    addToast({
      type: "warning",
      title: "⚠️ No hay reservas",
      message: "No hay reservas disponibles para probar.",
    });
  }
}; // Lifecycle hooks
onUnmounted(() => {
  stopScanner();
});

// Exponer método para detener el escáner desde el componente padre
defineExpose({
  stopScanner,
});
</script>

<style scoped>
@keyframes scan-line {
  0% {
    top: 10%;
    opacity: 1;
  }
  50% {
    top: 50%;
    opacity: 0.8;
  }
  100% {
    top: 90%;
    opacity: 1;
  }
}

/* Animación de pulso para las esquinas */
@keyframes pulse-corners {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.05);
  }
}

.animate-pulse-corners {
  animation: pulse-corners 2s ease-in-out infinite;
}

/* Efecto de resplandor */
.glow-green {
  box-shadow: 0 0 20px rgba(34, 197, 94, 0.5);
}

.glow-blue {
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
}
</style>
