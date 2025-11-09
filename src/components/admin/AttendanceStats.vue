<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
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
          <p class="text-2xl font-bold">{{ stats.total }}</p>
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
          <p class="text-2xl font-bold">{{ stats.confirmed }}</p>
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
          <p class="text-2xl font-bold">{{ stats.pending }}</p>
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
          <p class="text-2xl font-bold">{{ stats.percentage }}%</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Reservation {
  id: string;
  asistencia_confirmada: boolean;
}

interface Props {
  reservations: Reservation[];
}

const props = defineProps<Props>();

const stats = computed(() => {
  const total = props.reservations.length;
  const confirmed = props.reservations.filter(
    (r) => r.asistencia_confirmada
  ).length;
  const pending = total - confirmed;
  const percentage = total === 0 ? 0 : Math.round((confirmed / total) * 100);

  return {
    total,
    confirmed,
    pending,
    percentage,
  };
});
</script>
