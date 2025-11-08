import { supabase } from "../lib/supabase";

export const useSupabaseHelpers = () => {
  // Función para realizar consultas con manejo de errores mejorado
  const safeQuery = async (query: any) => {
    try {
      const { data, error, status } = await query;

      if (error) {
        console.error("Error en consulta Supabase:", {
          error,
          status,
          message: error.message,
          details: error.details,
        });
        if (status === 406) {
          throw new Error(
            `Not Acceptable (406): ${error.message}. Posible problema de configuración de API.`
          );
        }

        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error: any) {
      console.error("Error en safeQuery:", error);
      throw error;
    }
  };

  // Función para verificar si existe una reserva
  const checkReservationExists = async (userId: string, peliculaId: string) => {
    try {
      const query = supabase
        .from("reserva")
        .select("id")
        .eq("usuario_id", userId)
        .eq("pelicula_id", peliculaId)
        .maybeSingle();

      return await safeQuery(query);
    } catch (error) {
      console.error("Error verificando reserva:", error);
      return null;
    }
  };

  // Función para obtener un asiento específico
  const getSeat = async (salaId: string, fila: string, numero: number) => {
    try {
      const query = supabase
        .from("asiento")
        .select("id")
        .eq("sala_id", salaId)
        .eq("fila", fila)
        .eq("numero", numero)
        .maybeSingle();

      return await safeQuery(query);
    } catch (error) {
      console.error("Error obteniendo asiento:", error);
      return null;
    }
  };

  // Función para verificar si un asiento está reservado
  const checkSeatReservation = async (
    peliculaId: string,
    asientoId: string
  ) => {
    try {
      const query = supabase
        .from("reserva")
        .select("id")
        .eq("pelicula_id", peliculaId)
        .eq("asiento_id", asientoId)
        .maybeSingle();

      return await safeQuery(query);
    } catch (error) {
      console.error("Error verificando reserva de asiento:", error);
      return null;
    }
  };

  // Función para enviar email con reintentos
  const sendEmailWithRetry = async (emailData: any, maxRetries = 3) => {
    let lastError: any;

    for (let i = 0; i < maxRetries; i++) {
      try {
        const { data, error } = await supabase.functions.invoke(
          "send-ticket-email",
          {
            body: emailData,
          }
        );

        if (error) {
          console.error(`Intento ${i + 1} fallido:`, error);
          lastError = error;

          if (i < maxRetries - 1) {
            // Esperar antes del siguiente intento
            await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
            continue;
          }
        } else {
          console.log("✅ Email enviado exitosamente");
          return { success: true, data };
        }
      } catch (error) {
        console.error(`Intento ${i + 1} fallido:`, error);
        lastError = error;

        if (i < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
        }
      }
    }

    return { success: false, error: lastError };
  };

  return {
    safeQuery,
    checkReservationExists,
    getSeat,
    checkSeatReservation,
    sendEmailWithRetry,
  };
};
