<template>
  <div class="space-y-4">
    <!-- Área de Drag & Drop -->
    <div
      @drop.prevent="handleDrop"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @click="triggerFileInput"
      :class="[
        'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200',
        isDragging 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50',
        uploading ? 'opacity-50 cursor-not-allowed' : ''
      ]"
    >
      <!-- Vista previa de la imagen -->
      <div v-if="previewUrl" class="space-y-4">
        <div class="relative inline-block">
          <img 
            :src="previewUrl" 
            alt="Preview" 
            class="max-h-64 rounded-lg shadow-lg mx-auto"
          />
          <button
            v-if="!uploading"
            @click.stop="clearImage"
            class="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors"
            title="Eliminar imagen"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <p class="text-sm text-gray-600">
          Haz clic o arrastra otra imagen para reemplazar
        </p>
      </div>

      <!-- Estado de subida -->
      <div v-else-if="uploading" class="space-y-3">
        <svg class="w-16 h-16 mx-auto text-blue-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-blue-600 font-medium">Subiendo imagen...</p>
        <div class="w-full bg-gray-200 rounded-full h-2 max-w-xs mx-auto">
          <div 
            class="bg-blue-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: uploadProgress + '%' }"
          ></div>
        </div>
        <p class="text-sm text-gray-600">{{ uploadProgress }}%</p>
      </div>

      <!-- Estado inicial -->
      <div v-else class="space-y-3">
        <svg class="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
        </svg>
        <div>
          <p class="text-lg font-medium text-gray-700">
            Arrastra y suelta una imagen aquí
          </p>
          <p class="text-sm text-gray-500 mt-1">
            o haz clic para seleccionar
          </p>
        </div>
        <p class="text-xs text-gray-400">
          PNG, JPG, WEBP hasta 10MB
        </p>
      </div>
    </div>

    <!-- Input file oculto -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      @change="handleFileSelect"
      class="hidden"
    />

    <!-- Mensaje de error -->
    <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
      <svg class="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <div class="flex-1">
        <p class="text-sm font-medium text-red-800">Error al subir la imagen</p>
        <p class="text-sm text-red-600 mt-1">{{ error }}</p>
      </div>
      <button @click="error = ''" class="text-red-400 hover:text-red-600">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <!-- URL del póster (si existe) -->
    <div v-if="modelValue" class="bg-green-50 border border-green-200 rounded-lg p-4">
      <div class="flex items-start gap-3">
        <svg class="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-green-800">Imagen subida correctamente</p>
          <p class="text-xs text-green-600 mt-1 truncate">{{ modelValue }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { supabase } from '../lib/supabase'

const props = defineProps<{
  modelValue?: string
  bucketName?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'upload-success': [url: string]
  'upload-error': [error: string]
}>()

const fileInput = ref<HTMLInputElement>()
const isDragging = ref(false)
const uploading = ref(false)
const uploadProgress = ref(0)
const error = ref('')
const previewUrl = ref('')

// Bucket de Supabase
const BUCKET_NAME = props.bucketName || 'posters'

// Cargar preview si hay una URL inicial
watch(() => props.modelValue, (newValue) => {
  if (newValue && !previewUrl.value) {
    previewUrl.value = newValue
  }
}, { immediate: true })

const triggerFileInput = () => {
  if (!uploading.value) {
    fileInput.value?.click()
  }
}

const validateFile = (file: File): string | null => {
  // Validar tipo de archivo
  const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
  if (!validTypes.includes(file.type)) {
    return 'Solo se permiten archivos PNG, JPG y WEBP'
  }

  // Validar tamaño (10MB máximo)
  const maxSize = 10 * 1024 * 1024 // 10MB en bytes
  if (file.size > maxSize) {
    return 'El archivo no puede superar los 10MB'
  }

  return null
}

const uploadToSupabase = async (file: File) => {
  try {
    uploading.value = true
    uploadProgress.value = 0
    error.value = ''

    // Validar archivo
    const validationError = validateFile(file)
    if (validationError) {
      error.value = validationError
      return
    }

    // Crear nombre único para el archivo
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = fileName

    console.log(`📤 Subiendo imagen a Supabase: ${BUCKET_NAME}/${filePath}`)

    // Simular progreso inicial
    uploadProgress.value = 20

    // Subir archivo a Supabase Storage
    const { data, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    uploadProgress.value = 70

    if (uploadError) {
      throw uploadError
    }

    console.log('✅ Imagen subida:', data)

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath)

    uploadProgress.value = 100

    const publicUrl = urlData.publicUrl
    console.log('🔗 URL pública:', publicUrl)

    // Actualizar preview y emitir eventos
    previewUrl.value = publicUrl
    emit('update:modelValue', publicUrl)
    emit('upload-success', publicUrl)

  } catch (err: any) {
    console.error('❌ Error al subir imagen:', err)
    error.value = err.message || 'Error desconocido al subir la imagen'
    emit('upload-error', error.value)
  } finally {
    uploading.value = false
    uploadProgress.value = 0
    isDragging.value = false
  }
}

const handleDrop = (e: DragEvent) => {
  isDragging.value = false
  
  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    const file = files[0]
    if (file) {
      uploadToSupabase(file)
    }
  }
}

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  const files = target.files
  
  if (files && files.length > 0) {
    const file = files[0]
    if (file) {
      uploadToSupabase(file)
    }
  }
}

const clearImage = () => {
  previewUrl.value = ''
  error.value = ''
  emit('update:modelValue', '')
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
