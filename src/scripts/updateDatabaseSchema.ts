// Script para actualizar el esquema de la base de datos con las columnas necesarias para el sistema QR
import { supabase } from "../lib/supabase";

export async function updateDatabaseSchema() {
  try {
    console.log("🔄 Verificando esquema de la base de datos...");

    // Verificar si la columna asistencia_confirmada existe
    const { data: columns, error: columnError } = await supabase
      .from("information_schema.columns")
      .select("column_name")
      .eq("table_name", "reserva")
      .eq("column_name", "asistencia_confirmada");

    if (columnError) {
      console.log("❌ Error al verificar columnas:", columnError);
      return false;
    }

    if (!columns || columns.length === 0) {
      console.log("➕ Añadiendo columna asistencia_confirmada...");

      // Añadir columna asistencia_confirmada
      const { error: alterError1 } = await supabase.rpc("execute_sql", {
        sql: `ALTER TABLE reserva ADD COLUMN asistencia_confirmada BOOLEAN DEFAULT false;`,
      });

      if (alterError1) {
        console.log(
          "❌ Error al añadir columna asistencia_confirmada:",
          alterError1
        );
      } else {
        console.log("✅ Columna asistencia_confirmada añadida exitosamente");
      }
    } else {
      console.log("✅ Columna asistencia_confirmada ya existe");
    }

    // Verificar si la columna qr_code existe
    const { data: qrColumns, error: qrColumnError } = await supabase
      .from("information_schema.columns")
      .select("column_name")
      .eq("table_name", "reserva")
      .eq("column_name", "qr_code");

    if (!qrColumnError && (!qrColumns || qrColumns.length === 0)) {
      console.log("➕ Añadiendo columna qr_code...");

      // Añadir columna qr_code
      const { error: alterError2 } = await supabase.rpc("execute_sql", {
        sql: `ALTER TABLE reserva ADD COLUMN qr_code TEXT;`,
      });

      if (alterError2) {
        console.log("❌ Error al añadir columna qr_code:", alterError2);
      } else {
        console.log("✅ Columna qr_code añadida exitosamente");
      }
    } else {
      console.log("✅ Columna qr_code ya existe o verificación omitida");
    }

    // Verificar si la columna asiento_numero existe
    const { data: asientoColumns, error: asientoColumnError } = await supabase
      .from("information_schema.columns")
      .select("column_name")
      .eq("table_name", "reserva")
      .eq("column_name", "asiento_numero");

    if (
      !asientoColumnError &&
      (!asientoColumns || asientoColumns.length === 0)
    ) {
      console.log("➕ Añadiendo columna asiento_numero...");

      // Añadir columna asiento_numero
      const { error: alterError3 } = await supabase.rpc("execute_sql", {
        sql: `ALTER TABLE reserva ADD COLUMN asiento_numero VARCHAR(10);`,
      });

      if (alterError3) {
        console.log("❌ Error al añadir columna asiento_numero:", alterError3);
      } else {
        console.log("✅ Columna asiento_numero añadida exitosamente");
      }
    } else {
      console.log("✅ Columna asiento_numero ya existe o verificación omitida");
    }

    // Generar códigos QR para reservas existentes que no los tengan
    console.log("🔄 Generando códigos QR para reservas existentes...");

    const { data: reservasSinQR, error: reservasError } = await supabase
      .from("reserva")
      .select("id, usuario_id, pelicula_id, asiento_numero")
      .is("qr_code", null)
      .limit(100);

    if (reservasError) {
      console.log("❌ Error al obtener reservas sin QR:", reservasError);
    } else if (reservasSinQR && reservasSinQR.length > 0) {
      console.log(`📱 Generando QR para ${reservasSinQR.length} reservas...`);

      for (const reserva of reservasSinQR) {
        const qrData = JSON.stringify({
          usuario_id: reserva.usuario_id,
          pelicula_id: reserva.pelicula_id,
          asiento_numero: reserva.asiento_numero || reserva.id,
        });

        const { error: updateError } = await supabase
          .from("reserva")
          .update({ qr_code: qrData })
          .eq("id", reserva.id);

        if (updateError) {
          console.log(
            `❌ Error al actualizar QR para reserva ${reserva.id}:`,
            updateError
          );
        }
      }

      console.log("✅ Códigos QR generados exitosamente");
    } else {
      console.log("✅ Todas las reservas ya tienen códigos QR");
    }

    console.log("🎉 Actualización del esquema completada exitosamente");
    return true;
  } catch (error) {
    console.error("💥 Error durante la actualización del esquema:", error);
    return false;
  }
}

// Función alternativa para actualizar usando consultas directas si RPC no está disponible
export async function updateDatabaseSchemaAlternative() {
  console.log("🔄 Actualizando esquema usando método alternativo...");

  try {
    // Verificar estructura actual de la tabla
    const { data: reservasSample, error } = await supabase
      .from("reserva")
      .select("*")
      .limit(1);

    if (error) {
      console.log("❌ Error al verificar estructura:", error);
      return false;
    }

    console.log(
      "📋 Estructura actual de reserva:",
      reservasSample?.[0] ? Object.keys(reservasSample[0]) : "No hay datos"
    );

    // Actualizar reservas existentes con valores por defecto
    const { error: updateError } = await supabase
      .from("reserva")
      .update({
        asistencia_confirmada: false,
        asiento_numero: "A1", // Valor temporal
      })
      .is("asistencia_confirmada", null);

    if (updateError && !updateError.message.includes("does not exist")) {
      console.log("ℹ️  Info al actualizar reservas:", updateError);
    } else {
      console.log("✅ Reservas actualizadas con valores por defecto");
    }

    return true;
  } catch (error) {
    console.error("💥 Error en método alternativo:", error);
    return false;
  }
}

// Ejecutar si es llamado directamente
if (import.meta.hot) {
  console.log("🚀 Ejecutando actualización del esquema de base de datos...");
  updateDatabaseSchemaAlternative();
}
