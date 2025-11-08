<template>
  <Transition name="modal">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-md"
      @click="closeModal"
    >
      <div
        ref="ticketRef"
        class="bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl max-w-72 w-full overflow-hidden transform transition-all border border-white/20"
        style="font-family: 'Inter', 'Segoe UI', sans-serif; backdrop-filter: blur(20px); max-height: 80vh; overflow-y: auto;"
        @click.stop
      >
        <!-- Header ultra compacto -->
        <div
          class="bg-linear-to-r from-[#C1272D] via-[#DC2626] to-[#8B1F23] p-2 text-white relative"
          style="background: linear-gradient(135deg, #C1272D 0%, #DC2626 50%, #8B1F23 100%);"
        >
          <button
            @click="closeModal"
            class="absolute top-1 right-1 text-white hover:text-gray-200 transition-colors bg-white/20 rounded-full p-0.5 backdrop-blur-sm"
          >
            <svg
              class="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          
          <div class="text-center">
            <h2 class="text-sm font-bold">CineUleam</h2>
            <p class="text-xs text-white/90">ENTRADA DIGITAL</p>
            <div class="mt-1 bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5 inline-block">
              <p class="text-xs font-semibold">¡Reserva Confirmada!</p>
            </div>
          </div>
        </div>

        <!-- Ticket Content ultra compacto -->
        <div class="p-2 space-y-2 bg-white/80 backdrop-blur-sm">
          <!-- Movie Info mini -->
          <div class="bg-linear-to-r from-gray-900 to-gray-700 rounded-md p-2 text-white">
            <h3 class="text-xs font-bold mb-1 leading-tight">
              {{ ticketData.movieName }}
            </h3>
            <div class="flex items-center gap-1">
              <span class="bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs">
                {{ ticketData.movieLanguage }}
              </span>
            </div>
          </div>

          <!-- Details Grid mini -->
          <div class="grid grid-cols-2 gap-1">
            <!-- Fecha -->
            <div class="bg-white/90 rounded p-1.5 border border-blue-100 text-center">
              <p class="text-xs text-blue-600 font-semibold">📅 FECHA</p>
              <p class="font-bold text-gray-800 text-xs">
                {{ formatDate(ticketData.dateTime) }}
              </p>
            </div>
            
            <!-- Hora -->
            <div class="bg-white/90 rounded p-1.5 border border-green-100 text-center">
              <p class="text-xs text-green-600 font-semibold">🕐 HORA</p>
              <p class="font-bold text-gray-800 text-xs">
                {{ formatTime(ticketData.dateTime) }}
              </p>
            </div>

            <!-- Sala -->
            <div class="bg-white/90 rounded p-1.5 border border-purple-100 text-center">
              <p class="text-xs text-purple-600 font-semibold">🏢 SALA</p>
              <p class="font-bold text-gray-800 text-xs">
                {{ ticketData.salaName }}
              </p>
            </div>

            <!-- Asiento -->
            <div class="bg-white/90 rounded p-1.5 border border-red-100 text-center">
              <p class="text-xs text-red-600 font-semibold">💺 ASIENTO</p>
              <p class="font-bold text-gray-800 text-sm">
                {{ ticketData.seatRow }}{{ ticketData.seatNumber }}
              </p>
            </div>
          </div>

          <!-- Usuario mini -->
          <div class="bg-linear-to-r from-gray-900 to-gray-800 rounded p-1.5 text-white">
            <p class="text-xs font-semibold text-white/90 mb-1">👤 {{ ticketData.userName }}</p>
            <p class="text-xs text-white/70">{{ ticketData.userEmail }}</p>
          </div>

          <!-- QR Code mini -->
          <div class="text-center">
            <p class="text-xs font-semibold text-gray-700 mb-1">CÓDIGO QR</p>
            <div class="flex justify-center">
              <div class="bg-white/90 p-1.5 rounded border border-gray-200">
                <canvas ref="qrCanvas" class="w-12 h-12"></canvas>
              </div>
            </div>
          </div>

          <!-- ID Reserva mini -->
          <div class="text-center bg-gray-100/80 rounded p-1.5">
            <p class="text-xs text-gray-600 mb-1 font-semibold">ID RESERVA</p>
            <p class="font-mono text-xs text-gray-800 bg-white/90 py-1 px-2 rounded">
              {{ ticketData.reservationId.substring(0, 8) }}
            </p>
          </div>
        </div>

        <!-- Footer Actions compacto con fondo semi-transparente -->
        <div class="bg-gray-50/80 backdrop-blur-sm p-3 space-y-2 border-t border-[#C1272D]/20">
          <!-- Instrucciones importantes compactas -->
          <div class="bg-yellow-50/80 border-l-2 border-yellow-400 p-2 rounded-r-md">
            <div class="flex items-start gap-2">
              <svg class="w-3 h-3 text-yellow-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div class="text-yellow-800">
                <p class="text-xs font-semibold">Importante:</p>
                <p class="text-xs">Presenta este email o código QR en la entrada</p>
              </div>
            </div>
          </div>
          
          <button
            @click="downloadTicket"
            class="w-full bg-[#C1272D] hover:bg-[#8B1F23] text-white font-bold py-2 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 text-xs shadow-md"
          >
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
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Descargar PDF
          </button>
          
          
          <p class="text-xs text-gray-500 text-center">
            Válido 30 min antes de la función
          </p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import QRCode from "qrcode";
import { nextTick, onMounted, ref, watch } from "vue";
import { useNotifications } from "../composables/useNotifications";
import { usePDFTicket, type TicketPDFData } from "../composables/usePDFTicket";
import { useSupabaseHelpers } from "../composables/useSupabaseHelpers";

const { sendEmailWithRetry } = useSupabaseHelpers();
const { showSuccess, handleEmailError } = useNotifications();
const { generateTicketPDFAsBase64, downloadTicketPDF } = usePDFTicket();

interface TicketData {
  reservationId: string;
  movieName: string;
  movieLanguage: string;
  dateTime: string;
  salaName: string;
  seatRow: string;
  seatNumber: number;
  userName: string;
  userEmail: string;
}

interface Props {
  show: boolean;
  ticketData: TicketData;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
}>();

const qrCanvas = ref<HTMLCanvasElement | null>(null);
const ticketRef = ref<HTMLElement | null>(null);
const emailSending = ref(false);

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const generateQR = async () => {
  if (!qrCanvas.value) return;

  const qrData = JSON.stringify({
    reservationId: props.ticketData.reservationId,
    movieName: props.ticketData.movieName,
    dateTime: props.ticketData.dateTime,
    seat: `${props.ticketData.seatRow}${props.ticketData.seatNumber}`,
    sala: props.ticketData.salaName,
    userEmail: props.ticketData.userEmail,
  });

  try {
    await QRCode.toCanvas(qrCanvas.value, qrData, {
      width: 64, // Reducido de 96 a 64
      margin: 1,
      color: {
        dark: "#1F2937",
        light: "#FFFFFF",
      },
    });
  } catch (error) {
    console.error("Error generando QR:", error);
  }
};

const closeModal = () => {
  emit("close");
};

const downloadTicket = async () => {
  try {
    // Preparar datos del ticket para PDF
    const ticketPDFData: TicketPDFData = {
      reservationId: props.ticketData.reservationId,
      movieName: props.ticketData.movieName,
      movieLanguage: props.ticketData.movieLanguage,
      dateTime: props.ticketData.dateTime,
      salaName: props.ticketData.salaName,
      seatRow: props.ticketData.seatRow,
      seatNumber: props.ticketData.seatNumber,
      userName: props.ticketData.userName,
      userEmail: props.ticketData.userEmail
    };

    // Generar y descargar PDF
    await downloadTicketPDF(
      ticketPDFData, 
      `ticket-cineuleam-${props.ticketData.reservationId.substring(0, 8)}.pdf`
    );

    showSuccess('Descarga Exitosa', 'Tu ticket PDF se ha descargado correctamente.');
  } catch (error) {
    console.error('Error al descargar ticket PDF:', error);
    handleEmailError(error);
  }
};

const sendEmail = async () => {
  emailSending.value = true;

  try {
    // Preparar datos del ticket para PDF
    const ticketPDFData: TicketPDFData = {
      reservationId: props.ticketData.reservationId,
      movieName: props.ticketData.movieName,
      movieLanguage: props.ticketData.movieLanguage,
      dateTime: props.ticketData.dateTime,
      salaName: props.ticketData.salaName,
      seatRow: props.ticketData.seatRow,
      seatNumber: props.ticketData.seatNumber,
      userName: props.ticketData.userName,
      userEmail: props.ticketData.userEmail
    };

    // Generar PDF como base64
    console.log('📄 Generando PDF del ticket...');
    const pdfBase64 = await generateTicketPDFAsBase64(ticketPDFData);
    console.log('✅ PDF generado, tamaño base64:', pdfBase64.length, 'caracteres');
    
    // Preparar datos del email con contenido mejorado
    const emailData = {
      to: props.ticketData.userEmail,
      userName: props.ticketData.userName,
      movieName: props.ticketData.movieName,
      movieLanguage: props.ticketData.movieLanguage,
      dateTime: `${formatDate(props.ticketData.dateTime)} a las ${formatTime(props.ticketData.dateTime)}`,
      sala: props.ticketData.salaName,
      seat: `${props.ticketData.seatRow}${props.ticketData.seatNumber}`,
      reservationId: props.ticketData.reservationId,
      shortReservationId: props.ticketData.reservationId.substring(0, 8),
      // Incluir tanto el PDF como datos de respaldo
      ticketPDF: pdfBase64, // PDF del ticket como adjunto base64
      pdfFileName: `ticket-cineuleam-${props.ticketData.reservationId.substring(0, 8)}.pdf`,
      // Datos del ticket para mostrar en el email HTML
      ticketInfo: {
        movieName: props.ticketData.movieName,
        movieLanguage: props.ticketData.movieLanguage,
        dateTime: `${formatDate(props.ticketData.dateTime)} a las ${formatTime(props.ticketData.dateTime)}`,
        sala: props.ticketData.salaName,
        seat: `${props.ticketData.seatRow}${props.ticketData.seatNumber}`,
        userName: props.ticketData.userName,
        userEmail: props.ticketData.userEmail,
        reservationId: props.ticketData.reservationId.substring(0, 8)
      },
      subject: `🎬 Tu entrada para ${props.ticketData.movieName} - CineUleam`,
      // Datos adicionales para el template del email
      companyName: 'CineUleam',
      supportEmail: 'soporte@cineuleam.com',
      websiteUrl: 'https://cineuleam.com',
      // Instrucciones importantes
      instructions: [
        'Presenta el PDF adjunto o escanea el código QR en la entrada del cinema',
        'Llega 30 minutos antes del inicio de la función',
        'Este ticket es válido únicamente para la función, fecha y asiento especificados',
        'En caso de problemas, contacta nuestro equipo de soporte'
      ]
    };

    console.log('📧 Enviando email con datos:', {
      to: emailData.to,
      subject: emailData.subject,
      hasPDF: !!emailData.ticketPDF,
      pdfSize: emailData.ticketPDF?.length || 0,
      hasTicketInfo: !!emailData.ticketInfo
    });

    // Usar el helper mejorado para enviar email con reintentos
    const result = await sendEmailWithRetry(emailData);

    if (result.success) {
      console.log('✉️ Email enviado exitosamente a:', props.ticketData.userEmail);
      showSuccess('Email Enviado', `Tu ticket PDF fue enviado a ${props.ticketData.userEmail}`);
    } else {
      console.error('❌ Error al enviar email después de varios intentos:', result.error);
      handleEmailError(result.error);
    }
    
  } catch (error: any) {
    console.error('❌ Error al procesar ticket para email:', error);
    handleEmailError(error);
  } finally {
    emailSending.value = false;
  }
};

// Enviar automáticamente el email cuando se muestra el ticket
watch(
  () => props.show,
  async (newValue) => {
    if (newValue) {
      await nextTick();
      generateQR();
      // Enviar email automáticamente después de generar el QR
      setTimeout(() => {
        sendEmail();
      }, 500);
    }
  }
);

onMounted(() => {
  if (props.show) {
    generateQR();
  }
});
</script>

<style scoped>
/* Animaciones del modal con glassmorphism */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  backdrop-filter: blur(0px);
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.7) translateY(-50px);
  opacity: 0;
}

/* Efecto glassmorphism para el ticket */
.bg-white\/95 {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 8px 32px 0 rgba(31, 38, 135, 0.37),
    0 0 0 1px rgba(255, 255, 255, 0.1);
}

.bg-white\/80 {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
}

.bg-white\/90 {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
}

.bg-gray-50\/80 {
  background: rgba(249, 250, 251, 0.8);
  backdrop-filter: blur(10px);
}

.bg-yellow-50\/80 {
  background: rgba(254, 252, 232, 0.8);
  backdrop-filter: blur(8px);
}

/* Mejoras visuales adicionales */
.rounded-xl {
  border-radius: 12px;
}

.rounded-lg {
  border-radius: 8px;
}

/* Efecto hover suave para botones */
button {
  transition: all 0.2s ease;
}

button:hover {
  transform: translateY(-1px);
}

button:active {
  transform: translateY(0);
}

/* Sombras suaves para glassmorphism */
.shadow-2xl {
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.05);
}

.shadow-md {
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06),
    0 0 0 1px rgba(255, 255, 255, 0.1);
}

.shadow-sm {
  box-shadow: 
    0 1px 2px 0 rgba(0, 0, 0, 0.05),
    0 0 0 1px rgba(255, 255, 255, 0.1);
}
</style>
