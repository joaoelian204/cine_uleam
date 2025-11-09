<template>
  <div class="bg-white rounded-xl border border-gray-200 p-4">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2"
          >Película</label
        >
        <select
          :value="filters.movieId"
          @input="
            updateFilter('movieId', ($event.target as HTMLSelectElement).value)
          "
          class="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#C1272D] focus:ring-[#C1272D]"
        >
          <option value="">Todas las películas</option>
          <option v-for="movie in movies" :key="movie.id" :value="movie.id">
            {{ movie.nombre }}
          </option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2"
          >Estado</label
        >
        <select
          :value="filters.status"
          @input="
            updateFilter('status', ($event.target as HTMLSelectElement).value)
          "
          class="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#C1272D] focus:ring-[#C1272D]"
        >
          <option value="">Todos</option>
          <option value="confirmed">Confirmados</option>
          <option value="pending">Pendientes</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2"
          >Buscar usuario</label
        >
        <input
          :value="filters.search"
          @input="
            updateFilter('search', ($event.target as HTMLInputElement).value)
          "
          type="text"
          placeholder="Nombre o email..."
          class="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#C1272D] focus:ring-[#C1272D]"
        />
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
