<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">Gestión de Asientos</h1>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div
          class="animate-spin rounded-full h-16 w-16 border-b-2 border-[#C1272D]"
        ></div>
      </div>

      <!-- Success/Error Messages -->
      <div
        v-if="message"
        :class="
          messageType === 'success'
            ? 'bg-green-50 border-green-200 text-green-700'
            : 'bg-red-50 border-red-200 text-red-700'
        "
        class="border rounded-lg p-4 mb-6"
      >
        {{ message }}
      </div>

      <!-- Salas List -->
      <div v-if="!loading" class="space-y-4">
        <div
          v-for="sala in salas"
          :key="sala.id"
          class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
        >
          <div class="flex items-center justify-between mb-4">
            <div>
              <h2 class="text-xl font-semibold text-gray-800">
                {{ sala.nombre }}
              </h2>
              <p class="text-sm text-gray-600">
                Capacidad: {{ sala.capacidad }} asientos
              </p>
              <p class="text-sm text-gray-600">
                Asientos creados: {{ sala.asientos_count || 0 }}
              </p>
            </div>
            <div class="flex gap-2">
              <button
                v-if="!sala.asientos_count || sala.asientos_count === 0"
                @click="generateSeats(sala)"
                class="bg-[#C1272D] hover:bg-[#8B1F23] text-white px-4 py-2 rounded-lg transition-colors"
              >
                Generar Asientos
              </button>
              <button
                v-else
                @click="regenerateSeats(sala)"
                class="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Regenerar Asientos
              </button>
              <button
                v-if="sala.asientos_count && sala.asientos_count > 0"
                @click="deleteSeats(sala)"
                class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Eliminar Asientos
              </button>
            </div>
          </div>

          <!-- Seat Preview -->
          <div
            v-if="sala.asientos_count && sala.asientos_count > 0"
            class="mt-4 p-4 bg-gray-50 rounded-lg"
          >
            <p class="text-sm text-gray-600 mb-2">Vista previa de asientos:</p>
            <div class="text-xs text-gray-500">
              <span class="font-medium">Filas:</span>
              {{ calculateRows(sala.capacidad) }} |
              <span class="font-medium">Columnas aprox:</span>
              {{ calculateColumns(sala.capacidad) }}
            </div>
          </div>
        </div>

        <!-- Initialize All Button -->
        <div class="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 class="text-lg font-semibold text-blue-900 mb-2">
            Inicializar todas las salas
          </h3>
          <p class="text-sm text-blue-700 mb-4">
            Esta opción generará asientos automáticamente para todas las salas
            que no tengan asientos creados.
          </p>
          <button
            @click="initializeAll"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Inicializar Todas las Salas
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { supabase } from "../lib/supabase";
import {
  deleteSeatsForSala,
  generateSeatsForSala,
  initializeAllSeats,
  regenerateSeatsForSala,
} from "../utils/seatGenerator";

interface Sala {
  id: string;
  nombre: string;
  capacidad: number;
  asientos_count?: number;
}

const salas = ref<Sala[]>([]);
const loading = ref(true);
const message = ref("");
const messageType = ref<"success" | "error">("success");

const calculateRows = (capacidad: number) => {
  return Math.ceil(Math.sqrt(capacidad / 2));
};

const calculateColumns = (capacidad: number) => {
  const filas = calculateRows(capacidad);
  return Math.ceil(capacidad / filas);
};

const showMessage = (msg: string, type: "success" | "error") => {
  message.value = msg;
  messageType.value = type;
  setTimeout(() => {
    message.value = "";
  }, 5000);
};

const loadSalas = async () => {
  try {
    loading.value = true;

    // Obtener todas las salas
    const { data: salasData, error: salasError } = await supabase
      .from("sala")
      .select("id, nombre, capacidad");

    if (salasError) throw salasError;

    // Para cada sala, contar cuántos asientos tiene
    const salasConAsientos = await Promise.all(
      (salasData || []).map(async (sala) => {
        const { count } = await supabase
          .from("asiento")
          .select("*", { count: "exact", head: true })
          .eq("sala_id", sala.id);

        return {
          ...sala,
          asientos_count: count || 0,
        };
      })
    );

    salas.value = salasConAsientos;
  } catch (err: any) {
    console.error("Error al cargar salas:", err);
    showMessage("Error al cargar las salas", "error");
  } finally {
    loading.value = false;
  }
};

const generateSeats = async (sala: Sala) => {
  try {
    loading.value = true;
    await generateSeatsForSala(sala.id, sala.capacidad);
    showMessage(
      `Asientos generados exitosamente para ${sala.nombre}`,
      "success"
    );
    await loadSalas();
  } catch (err: any) {
    showMessage(`Error al generar asientos: ${err.message}`, "error");
  } finally {
    loading.value = false;
  }
};

const deleteSeats = async (sala: Sala) => {
  if (
    !confirm(`¿Estás seguro de eliminar todos los asientos de ${sala.nombre}?`)
  ) {
    return;
  }

  try {
    loading.value = true;
    await deleteSeatsForSala(sala.id);
    showMessage(
      `Asientos eliminados exitosamente de ${sala.nombre}`,
      "success"
    );
    await loadSalas();
  } catch (err: any) {
    showMessage(`Error al eliminar asientos: ${err.message}`, "error");
  } finally {
    loading.value = false;
  }
};

const regenerateSeats = async (sala: Sala) => {
  if (
    !confirm(
      `¿Estás seguro de regenerar todos los asientos de ${sala.nombre}? Esto eliminará los asientos existentes.`
    )
  ) {
    return;
  }

  try {
    loading.value = true;
    await regenerateSeatsForSala(sala.id, sala.capacidad);
    showMessage(
      `Asientos regenerados exitosamente para ${sala.nombre}`,
      "success"
    );
    await loadSalas();
  } catch (err: any) {
    showMessage(`Error al regenerar asientos: ${err.message}`, "error");
  } finally {
    loading.value = false;
  }
};

const initializeAll = async () => {
  if (
    !confirm(
      "¿Estás seguro de inicializar asientos para todas las salas sin asientos?"
    )
  ) {
    return;
  }

  try {
    loading.value = true;
    await initializeAllSeats();
    showMessage(
      "Todas las salas han sido inicializadas correctamente",
      "success"
    );
    await loadSalas();
  } catch (err: any) {
    showMessage(`Error al inicializar salas: ${err.message}`, "error");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadSalas();
});
</script>
