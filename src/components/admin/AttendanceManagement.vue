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
          <QRScanner 
            :reservations="reservations" 
            @qr-detected="handleQRDetected" 
          />
        </div>

        <!-- Lista de Asistentes Tab -->
        <div v-else-if="activeSubTab === 'attendees'">
          <!-- Estadísticas -->
          <AttendanceStats 
            :reservations="reservations" 
            class="mb-6" 
          />

          <!-- Filtros -->
          <AttendanceFilters
            :movies="movies"
            :filters="filters"
            @update-filter="updateFilter"
            class="mb-6"
          />

          <!-- Lista de reservas -->
          <AttendanceList
            :reservations="filteredReservations"
            :all-reservations="reservations"
            :loading="loadingReservations"
            @reload="loadReservations"
            @confirm-attendance="confirmAttendanceManual"
            @show-q-r="showQRCode"
          />
        </div>
      </div>
    </div>

    <!-- Modal de confirmación de QR -->
    <QRConfirmationModal
      :is-visible="!!scannedTicket"
      :ticket="scannedTicket"
      :is-confirming="isConfirming"
      @confirm="confirmAttendanceByQR"
      @cancel="cancelScan"
    />

    <!-- Modal para mostrar QR Code -->
    <QRDisplayModal
      :is-visible="showQRModal"
      :reservation="selectedQRReservation"
      @close="closeQRModal"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useAttendance } from "../../composables/useAttendance";
import AttendanceFilters from "./AttendanceFilters.vue";
import AttendanceList from "./AttendanceList.vue";
import AttendanceStats from "./AttendanceStats.vue";
import QRConfirmationModal from "./QRConfirmationModal.vue";
import QRDisplayModal from "./QRDisplayModal.vue";
import QRScanner from "./QRScanner.vue";

// Estado de la interfaz
const activeSubTab = ref("scanner");

// Usar el composable de asistencia
const {
  // Estado
  reservations,
  movies,
  loadingReservations,
  scannedTicket,
  isConfirming,
  showQRModal,
  selectedQRReservation,
  filters,

  // Computed
  filteredReservations,

  // Métodos
  loadReservations,
  loadMovies,
  confirmAttendanceByQR,
  confirmAttendanceManual,
  handleQRDetected,
  cancelScan,
  showQRCode,
  closeQRModal,
  updateFilter,
} = useAttendance();

// Lifecycle hooks
onMounted(() => {
  loadReservations();
  loadMovies();
});
</script>