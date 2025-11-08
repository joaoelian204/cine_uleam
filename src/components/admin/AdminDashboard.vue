<template>
  <div class="space-y-4 sm:space-y-6">
    <div class="text-center">
      <div class="mb-2">
        <div class="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#C1272D] to-[#1E3A8A] rounded-2xl shadow-lg mb-3">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
        </div>
      </div>
      <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">
        <span class="bg-gradient-to-r from-[#C1272D] via-purple-600 to-[#1E3A8A] bg-clip-text text-transparent">
          Dashboard General
        </span>
      </h2>
      <p class="text-sm sm:text-base text-gray-600 font-medium">CineUleam - Sistema de Gestión</p>
      <div class="w-20 h-0.5 bg-gradient-to-r from-[#C1272D] to-[#1E3A8A] rounded-full mx-auto mt-2"></div>
    </div>
    
    <!-- Tarjetas de Estadísticas en disposición 2x2 -->
    <div class="max-w-5xl mx-auto">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
        
        <!-- Primera fila -->
        <!-- Tarjeta de Películas - Rojo ULEAM -->
        <div class="bg-gradient-to-br from-[#C1272D] via-[#A91F26] to-[#8B1F23] overflow-hidden shadow-2xl rounded-2xl transform hover:scale-105 hover:shadow-3xl transition-all duration-300 border border-red-200/20">
          <div class="p-4 sm:p-5 relative">
            <!-- Patrón de fondo decorativo -->
            <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
            <div class="relative flex items-center justify-between">
              <div class="min-w-0 flex-1">
                <p class="text-red-100 text-xs sm:text-sm font-semibold truncate uppercase tracking-wide">Total Películas</p>
                <p class="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-1 mb-1">{{ totalPeliculas }}</p>
                <p class="text-red-200 text-xs font-medium">En cartelera</p>
              </div>
              <div class="bg-white/20 backdrop-blur-sm rounded-xl p-3 ml-3 shadow-lg">
                <svg class="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4zM9 12l2 2 4-4"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Tarjeta de Usuarios - Azul Marino ULEAM -->
        <div class="bg-gradient-to-br from-[#1E3A8A] via-[#1E40AF] to-[#1D4ED8] overflow-hidden shadow-2xl rounded-2xl transform hover:scale-105 hover:shadow-3xl transition-all duration-300 border border-blue-200/20">
          <div class="p-4 sm:p-5 relative">
            <!-- Patrón de fondo decorativo -->
            <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
            <div class="relative flex items-center justify-between">
              <div class="min-w-0 flex-1">
                <p class="text-blue-100 text-xs sm:text-sm font-semibold truncate uppercase tracking-wide">Total Usuarios</p>
                <p class="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-1 mb-1">{{ totalUsuarios }}</p>
                <p class="text-blue-200 text-xs font-medium">Registrados</p>
              </div>
              <div class="bg-white/20 backdrop-blur-sm rounded-xl p-3 ml-3 shadow-lg">
                <svg class="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Segunda fila -->
        <!-- Tarjeta de Reservas - Dorado ULEAM -->
        <div class="bg-gradient-to-br from-[#F59E0B] via-[#F97316] to-[#D97706] overflow-hidden shadow-2xl rounded-2xl transform hover:scale-105 hover:shadow-3xl transition-all duration-300 border border-orange-200/20">
          <div class="p-4 sm:p-5 relative">
            <!-- Patrón de fondo decorativo -->
            <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
            <div class="relative flex items-center justify-between">
              <div class="min-w-0 flex-1">
                <p class="text-amber-100 text-xs sm:text-sm font-semibold truncate uppercase tracking-wide">Total Reservas</p>
                <p class="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-1 mb-1">{{ totalReservas }}</p>
                <p class="text-amber-200 text-xs font-medium">Confirmadas</p>
              </div>
              <div class="bg-white/20 backdrop-blur-sm rounded-xl p-3 ml-3 shadow-lg">
                <svg class="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Tarjeta de Salas - Verde ULEAM (complementario) -->
        <div class="bg-gradient-to-br from-[#059669] via-[#10B981] to-[#047857] overflow-hidden shadow-2xl rounded-2xl transform hover:scale-105 hover:shadow-3xl transition-all duration-300 border border-emerald-200/20">
          <div class="p-4 sm:p-5 relative">
            <!-- Patrón de fondo decorativo -->
            <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
            <div class="relative flex items-center justify-between">
              <div class="min-w-0 flex-1">
                <p class="text-emerald-100 text-xs sm:text-sm font-semibold truncate uppercase tracking-wide">Salas Activas</p>
                <p class="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-1 mb-1">{{ totalSalas }}</p>
                <p class="text-emerald-200 text-xs font-medium">En funcionamiento</p>
              </div>
              <div class="bg-white/20 backdrop-blur-sm rounded-xl p-3 ml-3 shadow-lg">
                <svg class="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  totalPeliculas: number
  totalUsuarios: number
  totalReservas: number
  totalSalas: number
}

defineProps<Props>()
</script>