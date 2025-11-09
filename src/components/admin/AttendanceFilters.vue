<template>
  <div class="bg-white rounded-xl border border-gray-200 p-3 sm:p-4">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      <!-- Filtro de Película -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
          🎬 Película
        </label>
        <select
          :value="filters.movieId"
          @input="
            updateFilter('movieId', ($event.target as HTMLSelectElement).value)
          "
          class="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#C1272D] focus:ring-[#C1272D] text-sm"
        >
          <option value="">Todas las películas</option>
          <option v-for="movie in movies" :key="movie.id" :value="movie.id">
            {{ movie.nombre }}
          </option>
        </select>
      </div>

      <!-- Filtro de Estado -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
          ✅ Estado
        </label>
        <select
          :value="filters.status"
          @input="
            updateFilter('status', ($event.target as HTMLSelectElement).value)
          "
          class="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#C1272D] focus:ring-[#C1272D] text-sm"
        >
          <option value="">Todos</option>
          <option value="confirmed">✅ Confirmados</option>
          <option value="pending">⏳ Pendientes</option>
        </select>
      </div>

      <!-- Búsqueda de Usuario -->
      <div class="sm:col-span-2 lg:col-span-1">
        <label class="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
          👤 Buscar usuario
        </label>
        <div class="relative">
          <input
            :value="filters.search"
            @input="
              updateFilter('search', ($event.target as HTMLInputElement).value)
            "
            type="text"
            placeholder="Nombre o email..."
            class="w-full pl-8 pr-3 py-2 rounded-lg border-gray-300 shadow-sm focus:border-[#C1272D] focus:ring-[#C1272D] text-sm"
          />
          <svg
            class="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Movie {
  id: string;
  nombre: string;
}

interface AttendanceFilters {
  movieId: string;
  status: string;
  search: string;
}

interface Props {
  movies: Movie[];
  filters: AttendanceFilters;
}

defineProps<Props>();

const emit = defineEmits<{
  updateFilter: [key: keyof AttendanceFilters, value: string];
}>();

const updateFilter = (key: keyof AttendanceFilters, value: string) => {
  emit("updateFilter", key, value);
};
</script>
