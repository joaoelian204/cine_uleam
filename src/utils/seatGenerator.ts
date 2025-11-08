import { supabase } from "../lib/supabase";

/**
 * Genera asientos para una sala basándose en su capacidad
 * @param salaId - ID de la sala
 * @param capacidad - Capacidad total de la sala
 */
export async function generateSeatsForSala(salaId: string, capacidad: number) {
  try {
    // Calcular número de filas y columnas basado en la capacidad
    // Asumimos un ratio aproximado de 1:2 (filas:columnas)
    const filas = Math.ceil(Math.sqrt(capacidad / 2));
    const columnas = Math.ceil(capacidad / filas);

    console.log(
      `Generando ${filas} filas y ${columnas} columnas para capacidad ${capacidad}`
    );

    const asientos = [];
    let totalAsientos = 0;

    // Generar filas desde A hasta la letra correspondiente
    for (let i = 0; i < filas && totalAsientos < capacidad; i++) {
      const fila = String.fromCharCode(65 + i); // A, B, C, D...

      // Generar asientos por fila
      for (let j = 1; j <= columnas && totalAsientos < capacidad; j++) {
        asientos.push({
          sala_id: salaId,
          fila: fila,
          numero: j,
        });
        totalAsientos++;
      }
    }

    // Insertar asientos en la base de datos
    const { data, error } = await supabase
      .from("asiento")
      .insert(asientos)
      .select();

    if (error) throw error;

    console.log(
      `✅ Se generaron ${asientos.length} asientos para la sala ${salaId}`
    );
    return data;
  } catch (error) {
    console.error("❌ Error al generar asientos:", error);
    throw error;
  }
}

/**
 * Elimina todos los asientos de una sala
 * @param salaId - ID de la sala
 */
export async function deleteSeatsForSala(salaId: string) {
  try {
    const { error } = await supabase
      .from("asiento")
      .delete()
      .eq("sala_id", salaId);

    if (error) throw error;

    console.log(`✅ Asientos eliminados de la sala ${salaId}`);
  } catch (error) {
    console.error("❌ Error al eliminar asientos:", error);
    throw error;
  }
}

/**
 * Regenera los asientos de una sala (elimina los existentes y crea nuevos)
 * @param salaId - ID de la sala
 * @param capacidad - Nueva capacidad de la sala
 */
export async function regenerateSeatsForSala(
  salaId: string,
  capacidad: number
) {
  try {
    // Primero eliminar asientos existentes
    await deleteSeatsForSala(salaId);

    // Luego generar nuevos asientos
    return await generateSeatsForSala(salaId, capacidad);
  } catch (error) {
    console.error("❌ Error al regenerar asientos:", error);
    throw error;
  }
}

/**
 * Inicializa asientos para todas las salas que no tengan asientos
 */
export async function initializeAllSeats() {
  try {
    // Obtener todas las salas
    const { data: salas, error: salasError } = await supabase
      .from("sala")
      .select("id, nombre, capacidad");

    if (salasError) throw salasError;

    if (!salas || salas.length === 0) {
      console.log("No hay salas en la base de datos");
      return;
    }

    for (const sala of salas) {
      // Verificar si la sala ya tiene asientos
      const { data: asientosExistentes, error: asientosError } = await supabase
        .from("asiento")
        .select("id")
        .eq("sala_id", sala.id)
        .limit(1);

      if (asientosError) throw asientosError;

      if (!asientosExistentes || asientosExistentes.length === 0) {
        console.log(`🔄 Generando asientos para sala: ${sala.nombre}`);
        await generateSeatsForSala(sala.id, sala.capacidad);
      } else {
        console.log(`✓ La sala ${sala.nombre} ya tiene asientos`);
      }
    }

    console.log("✅ Inicialización de asientos completada");
  } catch (error) {
    console.error("❌ Error al inicializar asientos:", error);
    throw error;
  }
}
