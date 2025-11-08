<template>
  <div class="space-y-4 sm:space-y-6">
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
      <div>
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Configuración de Salas</h2>
        <p class="text-sm sm:text-base text-gray-600 mt-1">Gestiona las salas de cine disponibles</p>
      </div>
      <button 
        @click="showCreateSalaForm = true"
        class="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2 text-sm sm:text-base"
      >
        <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Nueva Sala
      </button>
    </div>

    <!-- Formulario de Crear/Editar Sala -->
    <div v-if="showCreateSalaForm || editingSala" class="bg-white shadow rounded-lg p-4 sm:p-6">
      <h3 class="text-base sm:text-lg font-medium text-gray-900 mb-4">
        {{ editingSala ? 'Editar Sala' : 'Nueva Sala' }}
      </h3>
      <form @submit.prevent="submitSala" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Nombre de la Sala</label>
            <input 
              v-model="salaForm.nombre" 
              type="text" 
              required
              placeholder="Ej: Sala Premium, Sala VIP, etc."
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm sm:text-base"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Capacidad</label>
            <input 
              v-model.number="salaForm.capacidad" 
              type="number" 
              required
              min="1"
              max="500"
              placeholder="Número de asientos"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm sm:text-base"
            >
          </div>
        </div>
        <div class="flex flex-col sm:flex-row justify-end gap-3">
          <button 
            type="button" 
            @click="cancelSalaForm"
            class="w-full sm:w-auto order-2 sm:order-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded text-sm sm:text-base"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            class="w-full sm:w-auto order-1 sm:order-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-sm sm:text-base"
          >
            {{ editingSala ? 'Actualizar' : 'Crear' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Lista de Salas -->
    <div class="bg-white shadow overflow-hidden rounded-lg">
      <div class="px-4 py-3 sm:px-6 sm:py-4 bg-gray-50 border-b">
        <h3 class="text-base sm:text-lg font-medium text-gray-900">Salas Configuradas ({{ salas.length }})</h3>
      </div>
      <ul class="divide-y divide-gray-200">
        <li v-for="sala in salas" :key="sala.id" class="p-4 sm:px-6 sm:py-4">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div class="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0 flex-1">
              <div class="shrink-0">
                <div class="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m-12 0H3m2 0h2m0 0v-3.5a2 2 0 011-1.732l.5-.289a2 2 0 011 0l.5.289a2 2 0 011 1.732V21"/>
                  </svg>
                </div>
              </div>
              <div class="min-w-0 flex-1">
                <div class="text-base sm:text-lg font-semibold text-gray-900 truncate">{{ sala.nombre }}</div>
                <div class="text-sm text-gray-600 mt-1">
                  <span class="inline-flex items-center gap-1">
                    <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                    <span class="text-xs sm:text-sm">Capacidad: {{ sala.capacidad }} asientos</span>
                  </span>
                </div>
                <div class="text-xs text-gray-500 mt-1">ID: {{ sala.id }}</div>
              </div>
            </div>
            <div class="flex flex-row sm:flex-col lg:flex-row gap-2 flex-shrink-0">
              <button 
                @click="editSala(sala)"
                class="flex-1 sm:flex-none text-blue-600 hover:text-blue-900 text-sm font-medium flex items-center justify-center gap-1 px-3 py-1 rounded border border-blue-200 hover:bg-blue-50"
              >
                <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
                <span class="hidden sm:inline">Editar</span>
              </button>
              <button 
                @click="deleteSala(sala.id)"
                class="flex-1 sm:flex-none text-red-600 hover:text-red-900 text-sm font-medium flex items-center justify-center gap-1 px-3 py-1 rounded border border-red-200 hover:bg-red-50"
              >
                <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
                <span class="hidden sm:inline">Eliminar</span>
              </button>
            </div>
          </div>
        </li>
      </ul>
      
      <!-- Estado vacío -->
      <div v-if="salas.length === 0" class="text-center py-8 sm:py-12">
        <svg class="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m-12 0H3m2 0h2m0 0v-3.5a2 2 0 011-1.732l.5-.289a2 2 0 011 0l.5.289a2 2 0 011 1.732V21"/>
        </svg>
        <h3 class="text-base sm:text-lg font-medium text-gray-900 mb-2">No hay salas configuradas</h3>
        <p class="text-sm sm:text-base text-gray-500 mb-4">Agrega tu primera sala para comenzar</p>
        <button 
          @click="showCreateSalaForm = true"
          class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-sm sm:text-base"
        >
          Crear Primera Sala
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Sala } from '../../interfaces/Sala'

interface Props {
  salas: Sala[]
}

interface Emits {
  (e: 'create-sala', salaData: Partial<Sala>): void
  (e: 'update-sala', id: string, salaData: Partial<Sala>): void
  (e: 'delete-sala', id: string): void
  (e: 'show-toast', title: string, message: string, type: 'success' | 'error' | 'warning' | 'info'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

// Estado del componente
const showCreateSalaForm = ref(false)
const editingSala = ref<Sala | null>(null)

// Formulario de sala
const salaForm = ref<Partial<Sala>>({
  nombre: '',
  capacidad: 0
})

// Métodos
const editSala = (sala: Sala) => {
  editingSala.value = sala
  salaForm.value = { ...sala }
  showCreateSalaForm.value = false
}

const cancelSalaForm = () => {
  showCreateSalaForm.value = false
  editingSala.value = null
  salaForm.value = {
    nombre: '',
    capacidad: 0
  }
}

const submitSala = () => {
  if (editingSala.value) {
    emit('update-sala', editingSala.value.id, salaForm.value)
  } else {
    emit('create-sala', salaForm.value)
  }
  cancelSalaForm()
}

const deleteSala = (id: string) => {
  if (confirm('¿Estás seguro de que quieres eliminar esta sala?')) {
    emit('delete-sala', id)
  }
}
</script>

<style scoped>
input, select, textarea {
  border: 1px solid #d1d5db;
  padding: 0.5rem;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}
</style>