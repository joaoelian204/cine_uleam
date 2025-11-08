<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-linear-to-r from-[#C1272D] to-[#8B1F23] rounded-xl p-6">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-2xl font-bold text-white">Control de Asistencia</h3>
          <p class="text-white/80 mt-1">
            Escanea códigos QR para marcar asistencia
          </p>
        </div>
        <div class="bg-white/20 rounded-full p-3">
          <svg
            class="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- Tabs de navegación -->
    <div class="bg-white rounded-xl shadow-lg border border-gray-100">
      <div class="border-b border-gray-200">
        <nav class="flex">
          <button
            @click="activeSubTab = 'scanner'"
            :class="[
              'px-6 py-3 text-sm font-medium border-b-2 transition-colors',
              activeSubTab === 'scanner'
                ? 'border-[#C1272D] text-[#C1272D] bg-red-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            ]"
          >
            <div class="flex items-center space-x-2">
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
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h4m-4 4h4m-4-8h4m-4-4h4M8 4h4"
                />
              </svg>
              <span>Escáner QR</span>
            </div>
          </button>
          <button
            @click="activeSubTab = 'attendees'"
            :class="[
              'px-6 py-3 text-sm font-medium border-b-2 transition-colors',
              activeSubTab === 'attendees'
                ? 'border-[#C1272D] text-[#C1272D] bg-red-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            ]"
          >
            <div class="flex items-center space-x-2">
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span>Lista de Asistentes</span>
            </div>
          </button>
        </nav>
      </div>

      <!-- Contenido de las tabs -->
      <div class="p-6">
        <!-- Scanner QR Tab -->
        <div v-if="activeSubTab === 'scanner'">
          <!-- Escáner QR -->
          <div class="max-w-2xl mx-auto">
            <div
              class="bg-gray-50 rounded-2xl p-8 border-2 border-dashed border-gray-300"
            >
              <div class="text-center space-y-6">
                <div
                  class="mx-auto w-32 h-32 bg-linear-to-br from-[#C1272D] to-[#8B1F23] rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <svg
                    class="w-16 h-16 text-white"
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
                  <h3 class="text-xl font-bold text-gray-900 mb-2">
                    Escáner de Códigos QR
                  </h3>
                  <p class="text-gray-600 mb-4">
                    Activa la cámara para escanear códigos QR de los tickets
                  </p>

                  <!-- Información de estado -->
                  <div class="text-sm mb-4">
                    <p v-if="isLoading" class="text-blue-600">
                      🔄 Cargando cámara...
                    </p>
                    <p v-else-if="isScanning" class="text-green-600">
                      📷 Cámara activa - Busca un código QR
                    </p>
                    <p v-else class="text-gray-500">
                      📱 Presiona el botón para activar el escáner
                    </p>
                  </div>
                </div>

                <button
                  @click="toggleScanner"
                  :disabled="isLoading"
                  :class="[
                    'px-8 py-4 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-105 shadow-lg mr-4',
                    isScanning
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-linear-to-r from-[#C1272D] to-[#8B1F23] hover:from-[#8B1F23] hover:to-[#C1272D]',
                  ]"
                >
                  {{ isScanning ? "⏹ Detener Escáner" : "📷 Activar Escáner" }}
                </button>

                <!-- Botón de prueba de cámara -->
                <button
                  @click="testCameraPermission"
                  class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  🔍 Probar Cámara
                </button>
              </div>

              <!-- Área del scanner -->
              <div v-if="isScanning" class="mt-8">
                <div class="relative bg-black rounded-xl overflow-hidden">
                  <video
                    ref="videoElement"
                    autoplay
                    class="w-full h-80 object-cover"
                  ></video>
                  <canvas ref="canvasElement" class="hidden"></canvas>

                  <!-- Overlay del scanner -->
                  <div class="absolute inset-0 pointer-events-none">
                    <div class="flex items-center justify-center h-full">
                      <div
                        class="w-64 h-64 border-4 border-white/50 rounded-2xl relative"
                      >
                        <!-- Esquinas del scanner -->
                        <div
                          class="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-[#C1272D]"
                        ></div>
                        <div
                          class="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-[#C1272D]"
                        ></div>
                        <div
                          class="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-[#C1272D]"
                        ></div>
                        <div
                          class="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-[#C1272D]"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                <p class="text-center text-gray-600 mt-4">
                  Apunta la cámara hacia el código QR del ticket
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Lista de Asistentes Tab -->
        <div v-else-if="activeSubTab === 'attendees'">
          <!-- Filtros y estadísticas -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div
              class="bg-linear-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white"
            >
              <div class="flex items-center">
                <svg
                  class="w-8 h-8 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857"
                  />
                </svg>
                <div>
                  <p class="text-sm text-blue-200">Total Reservas</p>
                  <p class="text-2xl font-bold">{{ totalReservations }}</p>
                </div>
              </div>
            </div>

            <div
              class="bg-linear-to-r from-green-500 to-green-600 rounded-xl p-4 text-white"
            >
              <div class="flex items-center">
                <svg
                  class="w-8 h-8 mr-3"
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
                <div>
                  <p class="text-sm text-green-200">Confirmadas</p>
                  <p class="text-2xl font-bold">{{ confirmedAttendance }}</p>
                </div>
              </div>
            </div>

            <div
              class="bg-linear-to-r from-yellow-500 to-yellow-600 rounded-xl p-4 text-white"
            >
              <div class="flex items-center">
                <svg
                  class="w-8 h-8 mr-3"
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
                <div>
                  <p class="text-sm text-yellow-200">Pendientes</p>
                  <p class="text-2xl font-bold">{{ pendingAttendance }}</p>
                </div>
              </div>
            </div>

            <div
              class="bg-linear-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white"
            >
              <div class="flex items-center">
                <svg
                  class="w-8 h-8 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <div>
                  <p class="text-sm text-purple-200">% Asistencia</p>
                  <p class="text-2xl font-bold">{{ attendancePercentage }}%</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Filtros -->
          <div class="bg-white rounded-xl border border-gray-200 p-4 mb-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Película</label
                >
                <select
                  v-model="selectedMovieFilter"
                  class="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#C1272D] focus:ring-[#C1272D]"
                >
                  <option value="">Todas las películas</option>
                  <option
                    v-for="movie in movies"
                    :key="movie.id"
                    :value="movie.id"
                  >
                    {{ movie.nombre }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Estado</label
                >
                <select
                  v-model="selectedStatusFilter"
                  class="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#C1272D] focus:ring-[#C1272D]"
                >
                  <option value="">Todos</option>
                  <option value="confirmed">Confirmados</option>
                  <option value="pending">Pendientes</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Buscar usuario</label
                >
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Nombre o email..."
                  class="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#C1272D] focus:ring-[#C1272D]"
                />
              </div>
            </div>
          </div>

          <!-- Lista de reservas -->
          <div class="bg-white rounded-xl shadow-lg border border-gray-100">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">
                Reservas y Asistencia
              </h3>
            </div>

            <div class="divide-y divide-gray-200">
              <div
                v-for="reservation in filteredReservations"
                :key="`${reservation.usuario_id}-${reservation.pelicula_id}-${reservation.asiento_numero}`"
                class="p-6 hover:bg-gray-50 transition-colors"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-4">
                    <!-- Avatar del usuario -->
                    <div
                      class="w-12 h-12 bg-linear-to-r from-[#C1272D] to-[#8B1F23] rounded-full flex items-center justify-center"
                    >
                      <span class="text-white font-bold text-lg">
                        {{ reservation.usuario_nombre.charAt(0).toUpperCase() }}
                      </span>
                    </div>

                    <div class="flex-1">
                      <div class="flex items-center space-x-2">
                        <h4 class="font-semibold text-gray-900">
                          {{ reservation.usuario_nombre }}
                        </h4>
                        <span
                          :class="[
                            'px-2 py-1 text-xs font-medium rounded-full',
                            reservation.asistencia_confirmada
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800',
                          ]"
                        >
                          {{
                            reservation.asistencia_confirmada
                              ? "Confirmado"
                              : "Pendiente"
                          }}
                        </span>
                      </div>
                      <p class="text-sm text-gray-600">
                        {{ reservation.usuario_email }}
                      </p>
                      <div class="mt-2 flex flex-wrap gap-2">
                        <span
                          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          🎬 {{ reservation.pelicula_nombre }}
                        </span>
                        <span
                          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                        >
                          🪑 Asiento {{ reservation.asiento_numero }}
                        </span>
                        <span
                          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          📅 {{ formatDate(reservation.fecha_reserva) }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="flex items-center space-x-3">
                    <!-- Botón de confirmar asistencia manual -->
                    <button
                      v-if="!reservation.asistencia_confirmada"
                      @click="confirmAttendanceManual(reservation)"
                      class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      ✓ Confirmar
                    </button>

                    <!-- Mostrar QR Button -->
                    <button
                      @click="showQRCode(reservation)"
                      class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      📱 Ver QR
                    </button>
                  </div>
                </div>
              </div>

              <div
                v-if="filteredReservations.length === 0"
                class="p-8 text-center"
              >
                <svg
                  class="w-16 h-16 text-gray-400 mx-auto mb-4"
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
                <p class="text-gray-600 text-lg">
                  No hay reservas que coincidan con los filtros
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación de QR -->
    <div
      v-if="scannedTicket"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-white rounded-2xl max-w-md w-full p-6 transform transition-all"
      >
        <div class="text-center">
          <!-- Icono de éxito -->
          <div
            class="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4"
          >
            <svg
              class="w-10 h-10 text-green-600"
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

          <h3 class="text-xl font-bold text-gray-900 mb-2">
            ¡Código QR Escaneado!
          </h3>

          <div class="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <div class="space-y-3">
              <div>
                <span class="text-sm font-medium text-gray-600">Usuario:</span>
                <p class="font-semibold text-gray-900">
                  {{ scannedTicket.usuario_nombre }}
                </p>
              </div>
              <div>
                <span class="text-sm font-medium text-gray-600">Email:</span>
                <p class="text-gray-900">{{ scannedTicket.usuario_email }}</p>
              </div>
              <div>
                <span class="text-sm font-medium text-gray-600">Película:</span>
                <p class="font-semibold text-gray-900">
                  {{ scannedTicket.pelicula_nombre }}
                </p>
              </div>
              <div>
                <span class="text-sm font-medium text-gray-600">Asiento:</span>
                <p class="font-semibold text-gray-900">
                  {{ scannedTicket.asiento_numero }}
                </p>
              </div>
              <div>
                <span class="text-sm font-medium text-gray-600">Fecha:</span>
                <p class="text-gray-900">
                  {{ formatDate(scannedTicket.fecha_reserva) }}
                </p>
              </div>
            </div>
          </div>

          <div class="flex space-x-3">
            <button
              @click="cancelScan"
              class="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-xl font-medium hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              @click="confirmAttendance"
              :disabled="isConfirming"
              class="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {{ isConfirming ? "Confirmando..." : "✓ Confirmar Asistencia" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para mostrar QR Code -->
    <div
      v-if="showQRModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-2xl max-w-sm w-full p-6">
        <div class="text-center">
          <h3 class="text-lg font-bold text-gray-900 mb-4">
            Código QR del Ticket
          </h3>
          <div ref="qrCodeContainer" class="mb-4"></div>
          <button
            @click="showQRModal = false"
            class="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import jsQR from "jsqr";
import QRCode from "qrcode";
import { computed, nextTick, onMounted, onUnmounted, ref } from "vue";
import { supabase } from "../../lib/supabase";

interface Reservation {
  usuario_id: string;
  usuario_nombre: string;
  usuario_email: string;
  pelicula_id: string;
  pelicula_nombre: string;
  asiento_numero: string;
  fecha_reserva: string;
  asistencia_confirmada: boolean;
  qr_code: string;
}

interface Movie {
  id: string;
  nombre: string;
}

// Estado del componente
const activeSubTab = ref("scanner");
const isScanning = ref(false);
const isLoading = ref(false);
const isConfirming = ref(false);
const reservations = ref<Reservation[]>([]);
const movies = ref<Movie[]>([]);
const scannedTicket = ref<Reservation | null>(null);
const showQRModal = ref(false);
const selectedQRReservation = ref<Reservation | null>(null);

// Filtros
const selectedMovieFilter = ref("");
const selectedStatusFilter = ref("");
const searchQuery = ref("");

// Referencias del DOM
const videoElement = ref<HTMLVideoElement | null>(null);
const canvasElement = ref<HTMLCanvasElement | null>(null);
const qrCodeContainer = ref<HTMLElement | null>(null);

// Variables para el streaming de video
let stream: MediaStream | null = null;
let scanInterval: ReturnType<typeof setInterval> | null = null;

// Computed properties para estadísticas
const totalReservations = computed(() => reservations.value.length);
const confirmedAttendance = computed(
  () => reservations.value.filter((r) => r.asistencia_confirmada).length
);
const pendingAttendance = computed(
  () => reservations.value.filter((r) => !r.asistencia_confirmada).length
);
const attendancePercentage = computed(() => {
  if (totalReservations.value === 0) return 0;
  return Math.round(
    (confirmedAttendance.value / totalReservations.value) * 100
  );
});

// Reservas filtradas
const filteredReservations = computed(() => {
  let filtered = reservations.value;

  if (selectedMovieFilter.value) {
    filtered = filtered.filter(
      (r) => r.pelicula_id === selectedMovieFilter.value
    );
  }

  if (selectedStatusFilter.value === "confirmed") {
    filtered = filtered.filter((r) => r.asistencia_confirmada);
  } else if (selectedStatusFilter.value === "pending") {
    filtered = filtered.filter((r) => !r.asistencia_confirmada);
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.usuario_nombre.toLowerCase().includes(query) ||
        r.usuario_email.toLowerCase().includes(query)
    );
  }

  return filtered;
});

// Cargar datos
const loadReservations = async () => {
  try {
    const { data, error } = await supabase
      .from("reserva")
      .select(
        `
        usuario_id,
        pelicula_id,
        asiento_numero,
        fecha_reserva,
        asistencia_confirmada,
        qr_code,
        usuario:usuario_id (
          id,
          nombre,
          email
        ),
        pelicula:pelicula_id (
          id,
          nombre
        )
      `
      )
      .order("fecha_reserva", { ascending: false });

    if (error) throw error;

    reservations.value =
      data?.map((reservation: any) => ({
        usuario_id: reservation.usuario_id,
        usuario_nombre: reservation.usuario?.nombre || "Usuario sin nombre",
        usuario_email: reservation.usuario?.email || "Sin email",
        pelicula_id: reservation.pelicula_id,
        pelicula_nombre: reservation.pelicula?.nombre || "Película sin nombre",
        asiento_numero: reservation.asiento_numero,
        fecha_reserva: reservation.fecha_reserva,
        asistencia_confirmada: reservation.asistencia_confirmada,
        qr_code: reservation.qr_code,
      })) || [];
  } catch (error) {
    console.error("Error al cargar reservas:", error);
  }
};

const loadMovies = async () => {
  try {
    const { data, error } = await supabase
      .from("pelicula")
      .select("id, nombre")
      .order("nombre");

    if (error) throw error;
    movies.value = data || [];
  } catch (error) {
    console.error("Error al cargar películas:", error);
  }
};

// Funciones del escáner
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

    // Verificar si hay navegador compatible
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error("Tu navegador no soporta acceso a la cámara");
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

    if (videoElement.value && stream) {
      videoElement.value.srcObject = stream;

      // Esperar a que el video esté listo
      await new Promise<void>((resolve) => {
        if (videoElement.value) {
          videoElement.value.onloadedmetadata = () => {
            videoElement.value
              ?.play()
              .then(() => {
                console.log("✅ Video iniciado correctamente");
                resolve();
              })
              .catch((playError) => {
                console.error("Error al reproducir video:", playError);
                resolve(); // Continuar aunque haya error de reproducción
              });
          };
        }
      });

      isScanning.value = true;
      startQRDetection();
      console.log("🎥 Escáner QR iniciado");
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

    alert(errorMessage);
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
};

const startQRDetection = () => {
  console.log("🔍 Iniciando detección QR...");

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
          context.drawImage(video, 0, 0, canvas.width, canvas.height);

          const imageData = context.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
          );

          try {
            const code = jsQR(
              imageData.data,
              imageData.width,
              imageData.height,
              {
                inversionAttempts: "attemptBoth",
              }
            );

            if (code) {
              console.log("📱 QR detectado:", code.data);
              handleQRDetected(code.data);
            }
          } catch (qrError) {
            console.error("Error al procesar QR:", qrError);
          }
        }
      }
    }
  }, 250); // Reducido a 250ms para mejor rendimiento
};

const handleQRDetected = (qrData: string) => {
  console.log("🔍 Procesando QR:", qrData);

  try {
    const ticketData = JSON.parse(qrData);
    console.log("📋 Datos del ticket:", ticketData);

    // Validar que tenga los campos necesarios
    if (
      !ticketData.usuario_id ||
      !ticketData.pelicula_id ||
      !ticketData.asiento_numero
    ) {
      throw new Error("QR no válido: faltan campos requeridos");
    }

    const reservation = reservations.value.find(
      (r) =>
        r.usuario_id === ticketData.usuario_id &&
        r.pelicula_id === ticketData.pelicula_id &&
        r.asiento_numero === ticketData.asiento_numero
    );

    if (reservation) {
      console.log("✅ Reserva encontrada:", reservation);
      scannedTicket.value = reservation;
      stopScanner();
    } else {
      console.warn("❌ Reserva no encontrada");
      alert("Código QR no válido o reserva no encontrada en el sistema");
    }
  } catch (error) {
    console.error("❌ Error al procesar QR:", error);
    alert("Código QR no válido o formato incorrecto");
  }
};

// Funciones de confirmación
const confirmAttendance = async () => {
  if (!scannedTicket.value) return;

  try {
    isConfirming.value = true;

    const { error } = await supabase
      .from("reserva")
      .update({ asistencia_confirmada: true })
      .eq("usuario_id", scannedTicket.value.usuario_id)
      .eq("pelicula_id", scannedTicket.value.pelicula_id)
      .eq("asiento_numero", scannedTicket.value.asiento_numero);

    if (error) throw error;

    // Actualizar la reserva local
    const reservationIndex = reservations.value.findIndex(
      (r) =>
        r.usuario_id === scannedTicket.value!.usuario_id &&
        r.pelicula_id === scannedTicket.value!.pelicula_id &&
        r.asiento_numero === scannedTicket.value!.asiento_numero
    );

    if (reservationIndex !== -1 && reservations.value[reservationIndex]) {
      reservations.value[reservationIndex].asistencia_confirmada = true;
    }

    scannedTicket.value = null;
  } catch (error) {
    console.error("Error al confirmar asistencia:", error);
    alert("Error al confirmar asistencia");
  } finally {
    isConfirming.value = false;
  }
};

const confirmAttendanceManual = async (reservation: Reservation) => {
  try {
    const { error } = await supabase
      .from("reserva")
      .update({ asistencia_confirmada: true })
      .eq("usuario_id", reservation.usuario_id)
      .eq("pelicula_id", reservation.pelicula_id)
      .eq("asiento_numero", reservation.asiento_numero);

    if (error) throw error;

    // Actualizar la reserva local
    const reservationIndex = reservations.value.findIndex(
      (r) =>
        r.usuario_id === reservation.usuario_id &&
        r.pelicula_id === reservation.pelicula_id &&
        r.asiento_numero === reservation.asiento_numero
    );

    if (reservationIndex !== -1 && reservations.value[reservationIndex]) {
      reservations.value[reservationIndex].asistencia_confirmada = true;
    }
  } catch (error) {
    console.error("Error al confirmar asistencia:", error);
    alert("Error al confirmar asistencia");
  }
};

const cancelScan = () => {
  scannedTicket.value = null;
};

// Función para probar permisos de cámara
const testCameraPermission = async () => {
  try {
    console.log("🧪 Probando acceso a la cámara...");

    // Verificar si el navegador soporta getUserMedia
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("❌ Tu navegador no soporta acceso a la cámara");
      return;
    }

    // Solicitar acceso temporal a la cámara
    const testStream = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480 },
    });

    console.log("✅ Acceso a cámara exitoso");
    alert("✅ Cámara disponible y funcionando correctamente");

    // Detener el stream de prueba
    testStream.getTracks().forEach((track) => track.stop());
  } catch (error: any) {
    console.error("❌ Error en prueba de cámara:", error);

    let message = "Error al acceder a la cámara: ";
    if (error.name === "NotAllowedError") {
      message +=
        "Permisos denegados. Permite el acceso a la cámara en tu navegador.";
    } else if (error.name === "NotFoundError") {
      message += "No se encontró ninguna cámara.";
    } else {
      message += error.message;
    }

    alert(message);
  }
};

// Mostrar QR Code
const showQRCode = async (reservation: Reservation) => {
  selectedQRReservation.value = reservation;
  showQRModal.value = true;

  await nextTick();

  if (qrCodeContainer.value) {
    qrCodeContainer.value.innerHTML = "";

    const qrData = JSON.stringify({
      usuario_id: reservation.usuario_id,
      pelicula_id: reservation.pelicula_id,
      asiento_numero: reservation.asiento_numero,
      usuario_nombre: reservation.usuario_nombre,
      pelicula_nombre: reservation.pelicula_nombre,
    });

    try {
      await QRCode.toCanvas(qrCodeContainer.value, qrData, {
        width: 200,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
    } catch (error) {
      console.error("Error generando QR:", error);
    }
  }
};

// Utility functions
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

// Lifecycle hooks
onMounted(() => {
  loadReservations();
  loadMovies();
});

onUnmounted(() => {
  stopScanner();
});
</script>
