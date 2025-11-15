<template>
  <div
    v-if="isVisible"
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

        <div v-if="ticket" class="bg-gray-50 rounded-xl p-4 mb-6 text-left">
          <div class="space-y-3">
            <div>
              <span class="text-sm font-medium text-gray-600">Usuario:</span>
              <p class="font-semibold text-gray-900">
                {{ ticket.usuario_nombre }}
              </p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-600">Email:</span>
              <p class="text-gray-900">{{ ticket.usuario_email }}</p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-600">Película:</span>
              <p class="font-semibold text-gray-900">
                {{ ticket.pelicula_nombre }}
              </p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-600">Asiento:</span>
              <p class="font-semibold text-gray-900">
                {{ ticket?.asiento_fila }}{{ ticket?.asiento_numero }}
              </p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-600">Fecha:</span>
              <p class="text-gray-900">
                {{ ticket ? formatDate(ticket.fecha_reserva) : "" }}
              </p>
            </div>
          </div>
        </div>

        <div class="flex space-x-3">
          <button
            @click="$emit('cancel')"
            class="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-xl font-medium hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="$emit('confirm')"
            :disabled="isConfirming"
            class="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {{ isConfirming ? "Confirmando..." : "✓ Confirmar Asistencia" }}
          </button>
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
  isVisible: boolean;
  ticket: Reservation | null;
  isConfirming: boolean;
}

defineProps<Props>();

defineEmits<{
  confirm: [];
  cancel: [];
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
</script>
