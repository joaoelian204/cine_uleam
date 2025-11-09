<template>
  <Transition name="modal">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-md"
      @click="closeModal"
    >
      <div
        ref="ticketRef"
        class="bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl max-w-80 w-full overflow-hidden transform transition-all border border-white/20"
        style="font-family: 'Inter', 'Segoe UI', sans-serif; backdrop-filter: blur(20px); max-height: 85vh; overflow-y: auto;"
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

        <!-- Ticket Content mejorado -->
        <div class="p-3 space-y-3 bg-white/85 backdrop-blur-sm">
          <!-- Movie Info mejorada -->
          <div class="bg-linear-to-r from-gray-900 to-gray-700 rounded-lg p-3 text-white shadow-lg">
            <h3 class="text-sm font-bold mb-2 leading-tight text-center">
              {{ ticketData.movieName }}
            </h3>
            <div class="flex items-center justify-center gap-2">
              <span class="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium">
                {{ ticketData.movieLanguage }}
              </span>
            </div>
          </div>

          <!-- Details Grid mejorado -->
          <div class="grid grid-cols-2 gap-2">
            <!-- Fecha -->
            <div class="bg-white/95 rounded-lg p-2 border border-blue-200 text-center shadow-sm">
              <p class="text-xs text-blue-600 font-bold mb-1">📅 FECHA</p>
              <p class="font-bold text-gray-800 text-xs leading-tight">
                {{ formatDate(ticketData.dateTime) }}
              </p>
            </div>
            
            <!-- Hora -->
            <div class="bg-white/95 rounded-lg p-2 border border-green-200 text-center shadow-sm">
              <p class="text-xs text-green-600 font-bold mb-1">🕐 HORA</p>
              <p class="font-bold text-gray-800 text-sm">
                {{ formatTime(ticketData.dateTime) }}
              </p>
            </div>

            <!-- Sala -->
            <div class="bg-white/95 rounded-lg p-2 border border-purple-200 text-center shadow-sm">
              <p class="text-xs text-purple-600 font-bold mb-1">🏢 SALA</p>
              <p class="font-bold text-gray-800 text-sm">
                {{ ticketData.salaName }}
              </p>
            </div>

            <!-- Asiento -->
            <div class="bg-white/95 rounded-lg p-2 border border-red-200 text-center shadow-sm">
              <p class="text-xs text-red-600 font-bold mb-1">💺 ASIENTO</p>
              <p class="font-bold text-gray-800 text-lg">
                {{ ticketData.seatRow }}{{ ticketData.seatNumber }}
              </p>
            </div>
          </div>

          <!-- Usuario mejorado -->
          <div class="bg-linear-to-r from-gray-900 to-gray-800 rounded-lg p-3 text-white shadow-lg">
            <p class="text-sm font-bold text-white mb-1">👤 {{ ticketData.userName }}</p>
            <p class="text-xs text-white/80">{{ ticketData.userEmail }}</p>
          </div>

          <!-- QR Code mejorado y más grande -->
          <div class="text-center bg-white/95 rounded-lg p-3 border-2 border-gray-100">
            <p class="text-sm font-bold text-gray-800 mb-2 tracking-wide">📱 CÓDIGO QR</p>
            <div class="flex justify-center bg-white rounded-lg p-4 shadow-inner">
              <div class="bg-white p-3 rounded-lg border-2 border-gray-200 shadow-sm">
                <canvas ref="qrCanvas" class="w-24 h-24"></canvas>
              </div>
            </div>
            <p class="text-xs text-gray-500 mt-2 font-medium">Escanea en la entrada</p>
          </div>

          <!-- ID Reserva mejorado -->
          <div class="text-center bg-gray-50/90 rounded-lg p-2 border border-gray-200">
            <p class="text-xs text-gray-600 mb-1 font-bold">🔖 ID RESERVA</p>
            <p class="font-mono text-sm text-gray-800 bg-white/90 py-1 px-3 rounded-md border">
              {{ ticketData.reservationId.substring(0, 8) }}
            </p>
          </div>
        </div>

        <!-- Footer Actions mejorado -->
        <div class="bg-gray-50/90 backdrop-blur-sm p-4 space-y-3 border-t border-[#C1272D]/20">
          <!-- Instrucciones importantes mejoradas -->
          <div class="bg-blue-50/90 border-l-4 border-blue-400 p-3 rounded-r-lg">
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 text-blue-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div class="text-blue-800">
                <p class="text-sm font-bold mb-1">📱 Instrucciones de Uso:</p>
                <ul class="text-xs space-y-1">
                  <li>• Presenta este código QR en la entrada</li>
                  <li>• Descarga el PDF como respaldo</li>
                  <li>• Llega 30 minutos antes de la función</li>
                </ul>
              </div>
            </div>
          </div>
          
          <button
            @click="downloadTicket"
            class="w-full bg-[#C1272D] hover:bg-[#8B1F23] text-white font-bold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 text-sm shadow-md"
          >
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
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            📄 Descargar Ticket PDF
          </button>
          
          <div class="bg-green-50 rounded-lg p-2 text-center">
            <p class="text-xs text-green-700 font-medium">
              ✅ Tu reserva está confirmada
            </p>
            <p class="text-xs text-green-600">
              Válido hasta 30 min después del inicio
            </p>
          </div>
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
import { generateQRString, type ReservationData } from "../utils/qrGenerator";

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

  // Crear datos estandarizados del QR usando el nuevo formato
  const reservationData: ReservationData = {
    id: props.ticketData.reservationId,
    usuario_id: '', // Este valor debería venir del ticket, temporalmente vacío
    usuario_nombre: props.ticketData.userName,
    usuario_email: props.ticketData.userEmail,
    pelicula_id: '', // Este valor debería venir del ticket, temporalmente vacío
    pelicula_nombre: props.ticketData.movieName,
    pelicula_idioma: props.ticketData.movieLanguage,
    asiento_id: '', // Este valor debería venir del ticket, temporalmente vacío
    asiento_fila: props.ticketData.seatRow,
    asiento_numero: props.ticketData.seatNumber,
    sala_nombre: props.ticketData.salaName,
    fecha_proyeccion: props.ticketData.dateTime,
  };

  const qrData = generateQRString(reservationData);

  try {
    await QRCode.toCanvas(qrCanvas.value, qrData, {
      width: 96, // Aumentado de 64 a 96 para mejor legibilidad
      margin: 2, // Aumentado margen para mejor contraste
      color: {
        dark: "#1F2937", // Color oscuro más definido
        light: "#FFFFFF",
      },
      errorCorrectionLevel: 'M', // Nivel de corrección de errores medio para mejor lectura
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
