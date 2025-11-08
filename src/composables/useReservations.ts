import { supabase } from "../lib/supabase";

export const useReservations = () => {
  // Función para verificar reserva existente con manejo específico de errores
  const checkExistingReservation = async (
    userId: string,
    peliculaId: string
  ) => {
    try {
      console.log("🔍 Verificando reserva existente:", { userId, peliculaId });

      const { data, error, status } = await supabase
        .from("reserva")
        .select("id")
        .eq("usuario_id", userId)
        .eq("pelicula_id", peliculaId)
        .limit(1);

      if (error) {
        console.error("❌ Error en checkExistingReservation:", error);
        if (status === 406) {
          console.warn("⚠️ Error 406: Problema de configuración API");
          return null; // Retorna null en lugar de fallar
        }
        throw error;
      }

      console.log("✅ Resultado checkExistingReservation:", data);
      return data && data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error("❌ Error verificando reserva:", error);
      // En lugar de fallar completamente, retornamos null
      return null;
    }
  };

  // Función para obtener asiento con manejo específico de errores
  const getSeatId = async (salaId: string, fila: string, numero: number) => {
    try {
      console.log("🪑 Obteniendo ID de asiento:", { salaId, fila, numero });

      const { data, error, status } = await supabase
        .from("asiento")
        .select("id")
        .eq("sala_id", salaId)
        .eq("fila", fila)
        .eq("numero", numero)
        .limit(1);

      if (error) {
        console.error("❌ Error en getSeatId:", error);
        if (status === 406) {
          console.warn("⚠️ Error 406: Problema de configuración API");
          return null;
        }
        throw error;
      }

      console.log("✅ Resultado getSeatId:", data);
      return data && data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error("❌ Error obteniendo asiento:", error);
      return null;
    }
  };

  // Función para verificar si un asiento está reservado
  const checkSeatReservation = async (
    peliculaId: string,
    asientoId: string
  ) => {
    try {
      console.log("🎟️ Verificando reserva de asiento:", {
        peliculaId,
        asientoId,
      });

      const { data, error, status } = await supabase
        .from("reserva")
        .select("id")
        .eq("pelicula_id", peliculaId)
        .eq("asiento_id", asientoId)
        .limit(1);

      if (error) {
        console.error("❌ Error en checkSeatReservation:", error);
        if (status === 406) {
          console.warn("⚠️ Error 406: Problema de configuración API");
          return null;
        }
        throw error;
      }

      console.log("✅ Resultado checkSeatReservation:", data);
      return data && data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error("❌ Error verificando reserva de asiento:", error);
      return null;
    }
  };

  // Función para crear nueva reserva
  const createReservation = async (reservaData: {
    usuario_id: string;
    pelicula_id: string;
    asiento_id: string;
  }) => {
    try {
      console.log("📝 Creando nueva reserva:", reservaData);

      // Validar que los IDs no estén vacíos
      if (
        !reservaData.usuario_id ||
        !reservaData.pelicula_id ||
        !reservaData.asiento_id
      ) {
        throw new Error("Faltan datos requeridos para crear la reserva");
      }

      // Verificación adicional: comprobar si ya existe una reserva para este usuario y película
      console.log("🔍 Verificando duplicados antes de insertar...");
      const existingUserReservation = await checkExistingReservation(
        reservaData.usuario_id,
        reservaData.pelicula_id
      );

      if (existingUserReservation) {
        throw new Error("Ya tienes una reserva para esta película");
      }

      // Verificación adicional: comprobar si el asiento ya está reservado
      const existingSeatReservation = await checkSeatReservation(
        reservaData.pelicula_id,
        reservaData.asiento_id
      );

      if (existingSeatReservation) {
        throw new Error("Este asiento ya está reservado");
      }

      // Crear el objeto con la estructura exacta esperada por la base de datos
      // Solo enviamos los campos requeridos, fecha_creacion es automática
      const reservaToInsert = {
        usuario_id: reservaData.usuario_id,
        pelicula_id: reservaData.pelicula_id,
        asiento_id: reservaData.asiento_id,
        // fecha_creacion se genera automáticamente en la DB
      };

      console.log("📝 Datos a insertar:", reservaToInsert);

      const { data, error } = await supabase
        .from("reserva")
        .insert(reservaToInsert)
        .select("*")
        .single();

      if (error) {
        console.error("❌ Error creando reserva:", {
          error,
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
        });

        // Manejar errores específicos
        if (error.code === "23505") {
          throw new Error(
            "Ya existe una reserva para este asiento o usuario en esta película"
          );
        } else if (error.code === "23503") {
          throw new Error(
            "Error de referencia: verifica que el usuario, película y asiento existan"
          );
        } else if (error.code === "42703") {
          throw new Error(
            "Error de columna: verifica la estructura de la tabla reserva"
          );
        } else {
          throw new Error(`Error al crear reserva: ${error.message}`);
        }
      }

      if (!data) {
        throw new Error("No se pudo crear la reserva - sin datos devueltos");
      }

      console.log("✅ Reserva creada exitosamente:", data);
      return data;
    } catch (error: any) {
      console.error("❌ Error en createReservation:", error);
      throw error;
    }
  };

  // Función para eliminar una reserva
  const deleteReservation = async (userId: string, peliculaId: string) => {
    try {
      console.log("🗑️ Eliminando reserva:", { userId, peliculaId });

      // Validar que los IDs no estén vacíos
      if (!userId || !peliculaId) {
        throw new Error("Faltan datos requeridos para eliminar la reserva");
      }

      const { data, error } = await supabase
        .from("reserva")
        .delete()
        .eq("usuario_id", userId)
        .eq("pelicula_id", peliculaId)
        .select();

      if (error) {
        console.error("❌ Error eliminando reserva:", error);
        throw new Error(`Error al eliminar reserva: ${error.message}`);
      }

      if (!data || data.length === 0) {
        throw new Error("No se encontró la reserva a eliminar");
      }

      console.log("✅ Reserva eliminada exitosamente:", data);
      return data[0];
    } catch (error: any) {
      console.error("❌ Error en deleteReservation:", error);
      throw error;
    }
  };

  // Función para obtener el historial de reservas del usuario
  const getUserReservations = async (userId: string) => {
    try {
      console.log("📚 Obteniendo historial de reservas para usuario:", userId);

      const { data, error } = await supabase
        .from("reserva")
        .select(`
          id,
          fecha_creacion,
          pelicula:pelicula_id (
            id,
            nombre,
            descripcion,
            url_poster,
            idioma,
            fecha_hora_proyeccion,
            sala:sala_id (
              nombre,
              capacidad
            )
          ),
          asiento:asiento_id (
            id,
            fila,
            numero
          )
        `)
        .eq("usuario_id", userId)
        .order("fecha_creacion", { ascending: false });

      if (error) {
        console.error("❌ Error obteniendo historial:", error);
        throw new Error(`Error al obtener historial: ${error.message}`);
      }

      console.log("✅ Historial obtenido:", data);
      return data || [];
    } catch (error: any) {
      console.error("❌ Error en getUserReservations:", error);
      throw error;
    }
  };

  return {
    checkExistingReservation,
    getSeatId,
    checkSeatReservation,
    createReservation,
    deleteReservation,
    getUserReservations,
  };
};
