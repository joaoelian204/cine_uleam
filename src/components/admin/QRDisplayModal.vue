<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
  >
    <div class="bg-white rounded-2xl max-w-sm w-full p-6">
      <div class="text-center">
        <h3 class="text-lg font-bold text-gray-900 mb-4">
          Código QR del Ticket
        </h3>
        <div ref="qrCodeContainer" class="mb-4"></div>
        <button
          @click="$emit('close')"
          class="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import QRCode from "qrcode";
import { nextTick, ref, watch } from "vue";

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
  reservation: Reservation | null;
}

const props = defineProps<Props>();

defineEmits<{
  close: [];
}>();

const qrCodeContainer = ref<HTMLElement | null>(null);

const generateQRCode = async (reservation: Reservation) => {
  await nextTick();

  if (qrCodeContainer.value) {
    qrCodeContainer.value.innerHTML = "";

    const qrData = JSON.stringify({
      reserva_id: reservation.id,
      usuario_id: reservation.usuario_id,
      pelicula_id: reservation.pelicula_id,
      asiento_id: reservation.asiento_id,
      asiento_fila: reservation.asiento_fila,
      asiento_numero: reservation.asiento_numero,
      usuario_nombre: reservation.usuario_nombre,
      pelicula_nombre: reservation.pelicula_nombre,
    });

    try {
      // Crear un elemento canvas para QRCode
      const canvas = document.createElement("canvas");
      await QRCode.toCanvas(canvas, qrData, {
        width: 200,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
      qrCodeContainer.value.appendChild(canvas);
    } catch (error) {
      console.error("Error generando QR:", error);
    }
  }
};

// Watch para generar el QR cuando se muestra el modal
watch(
  () => [props.isVisible, props.reservation],
  ([visible, reservation]) => {
    if (visible && reservation && typeof reservation === "object") {
      generateQRCode(reservation);
    }
  },
  { immediate: true }
);
</script>
