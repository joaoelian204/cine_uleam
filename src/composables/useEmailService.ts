import emailjs from "@emailjs/browser";
import { ref } from "vue";

// Configuración de EmailJS usando variables de entorno
const EMAIL_CONFIG = {
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_fbu6meg",
  TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_cineuleam",
  PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "sgK2GE1Ny08WUbBBL",
};

// Estado reactivo
const isEmailLoading = ref(false);
const emailError = ref<string | null>(null);

export const useEmailService = () => {
  // Inicializar EmailJS
  emailjs.init(EMAIL_CONFIG.PUBLIC_KEY);

  // Función principal para enviar ticket por email
  const sendTicketEmail = async (ticketData: {
    userEmail: string;
    userName: string;
    movieName: string;
    seatRow: string;
    seatNumber: number;
    dateTime: string;
    reservationId: string;
    salaName: string;
  }) => {
    isEmailLoading.value = true;
    emailError.value = null;

    try {
      // Formatear fecha para mostrar en español
      const formattedDate = new Date(ticketData.dateTime).toLocaleDateString(
        "es-EC",
        {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "America/Guayaquil",
        }
      );

      const templateParams = {
        // Datos del destinatario
        to_email: ticketData.userEmail,
        to_name: ticketData.userName,

        // Datos de la película y función
        movie_title: ticketData.movieName,
        show_date: formattedDate,
        sala_name: ticketData.salaName,

        // Datos del asiento
        seat_info: `${ticketData.seatRow}${ticketData.seatNumber}`,
        seat_row: ticketData.seatRow,
        seat_number: ticketData.seatNumber.toString(),

        // Datos de la reserva
        reservation_id: ticketData.reservationId.substring(0, 8).toUpperCase(),
        full_reservation_id: ticketData.reservationId,

        // Datos del cine
        cinema_name: "CineUleam - Universidad Eloy Alfaro de Manabí",
        cinema_short_name: "CineUleam",

        // Fecha actual para el footer
        current_year: new Date().getFullYear().toString(),

        // Información adicional
        arrival_time: "15-20 minutos antes de la función",
        support_contact: "Personal de CineUleam",
      };

      console.log("📧 Enviando email con los siguientes datos:", {
        destinatario: templateParams.to_email,
        pelicula: templateParams.movie_title,
        fecha: templateParams.show_date,
        asiento: templateParams.seat_info,
      });

      const result = await emailjs.send(
        EMAIL_CONFIG.SERVICE_ID,
        EMAIL_CONFIG.TEMPLATE_ID,
        templateParams,
        EMAIL_CONFIG.PUBLIC_KEY
      );

      console.log("✅ Email enviado exitosamente:", result);
      return {
        success: true,
        result,
        message: "Ticket enviado por email exitosamente",
      };
    } catch (error: any) {
      console.error("❌ Error enviando email:", error);
      emailError.value = error.text || error.message || "Error desconocido";

      return {
        success: false,
        error,
        message: `Error al enviar email: ${emailError.value}`,
      };
    } finally {
      isEmailLoading.value = false;
    }
  };

  // Función con sistema de reintentos para mayor confiabilidad
  const sendEmailWithRetry = async (ticketData: any, maxRetries = 3) => {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`📧 Intento ${attempt}/${maxRetries} de envío de email...`);

        const result = await sendTicketEmail(ticketData);

        if (result.success) {
          if (attempt > 1) {
            console.log(
              `✅ Email enviado exitosamente en el intento ${attempt}`
            );
          }
          return result;
        }

        lastError = result.error;
      } catch (error) {
        lastError = error;
        console.warn(`⚠️ Intento ${attempt} falló:`, error);

        // Esperar antes de reintentar (incrementalmente)
        if (attempt < maxRetries) {
          const waitTime = attempt * 1500; // 1.5s, 3s, etc.
          console.log(
            `⏳ Esperando ${waitTime}ms antes del siguiente intento...`
          );
          await new Promise((resolve) => setTimeout(resolve, waitTime));
        }
      }
    }

    console.error(
      `❌ Todos los intentos de envío fallaron. Último error:`,
      lastError
    );
    return {
      success: false,
      error: lastError,
      message: `Error después de ${maxRetries} intentos: ${
        lastError?.text || lastError?.message || "Error desconocido"
      }`,
    };
  };

  // Función para validar email antes de enviar
  const validateEmailData = (ticketData: any): string | null => {
    if (!ticketData.userEmail || !ticketData.userEmail.includes("@")) {
      return "Email inválido";
    }

    if (!ticketData.userName || ticketData.userName.trim().length < 2) {
      return "Nombre de usuario inválido";
    }

    if (!ticketData.movieName || ticketData.movieName.trim().length < 1) {
      return "Nombre de película requerido";
    }

    if (!ticketData.reservationId || ticketData.reservationId.length < 8) {
      return "ID de reserva inválido";
    }

    return null; // Datos válidos
  };

  // Función pública con validación incluida
  const sendValidatedTicketEmail = async (ticketData: any) => {
    const validationError = validateEmailData(ticketData);

    if (validationError) {
      console.error("❌ Datos de email inválidos:", validationError);
      return {
        success: false,
        error: validationError,
        message: `Validación falló: ${validationError}`,
      };
    }

    return await sendEmailWithRetry(ticketData);
  };

  return {
    // Estados reactivos
    isEmailLoading,
    emailError,

    // Funciones principales
    sendTicketEmail,
    sendEmailWithRetry,
    sendValidatedTicketEmail,

    // Utilidades
    validateEmailData,

    // Configuración (readonly)
    EMAIL_CONFIG: { ...EMAIL_CONFIG },
  };
};
