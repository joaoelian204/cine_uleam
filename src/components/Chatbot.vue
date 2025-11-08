<template>
  <div class="fixed bottom-0 right-0 z-50">
    <transition name="chat">
      <div
        v-if="isOpen"
        class="bg-white rounded-2xl shadow-2xl w-96 h-[600px] flex flex-col border border-gray-200 mb-4 mr-4"
      >
        <div class="bg-linear-to-r from-[#C1272D] to-[#8B1F23] p-4 rounded-t-2xl flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-[#C1272D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h3 class="text-white font-bold text-lg">CineIA Cultural</h3>
              <p class="text-white/80 text-xs">Explorando culturas a través del cine</p>
            </div>
          </div>
          <button
            @click="isOpen = false"
            class="text-white hover:text-gray-200 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div
          ref="messagesContainer"
          class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
        >
          <div
            v-for="(message, index) in messages"
            :key="index"
            :class="[
              'flex',
              message.role === 'user' ? 'justify-end' : 'justify-start'
            ]"
          >
            <div
              :class="[
                'max-w-[80%] rounded-2xl p-3 shadow-sm',
                message.role === 'user'
                  ? 'bg-[#C1272D] text-white'
                  : 'bg-white text-gray-800 border border-gray-200'
              ]"
            >
              <div 
                v-if="message.role === 'assistant'"
                class="text-sm prose prose-sm max-w-none"
                v-html="formatMarkdown(message.content)"
              ></div>
              <p v-else class="text-sm whitespace-pre-wrap">{{ message.content }}</p>
              <span class="text-xs opacity-70 mt-1 block">{{ formatTime(message.timestamp) }}</span>
            </div>
          </div>

          <div v-if="isTyping" class="flex justify-start">
            <div class="bg-white rounded-2xl p-3 shadow-sm border border-gray-200">
              <div class="flex gap-1">
                <div class="w-2 h-2 bg-[#C1272D] rounded-full animate-bounce"></div>
                <div class="w-2 h-2 bg-[#C1272D] rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                <div class="w-2 h-2 bg-[#C1272D] rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
          <div class="flex gap-2 mb-2">
            <button
              v-for="suggestion in suggestions"
              :key="suggestion"
              @click="sendMessage(suggestion)"
              class="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
            >
              {{ suggestion }}
            </button>
          </div>
          <form @submit.prevent="handleSubmit" class="flex gap-2">
            <input
              v-model="userInput"
              type="text"
              placeholder="Pregunta sobre culturas o películas..."
              class="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#C1272D] focus:border-transparent"
              :disabled="isTyping"
            />
            <button
              type="submit"
              :disabled="!userInput.trim() || isTyping"
              class="bg-[#C1272D] hover:bg-[#8B1F23] text-white p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </transition>

    <transition name="logo">
      <button
        v-if="!isOpen"
        @click="isOpen = true"
        class="absolute bottom-0 right-0 w-40 h-40 transition-all duration-300 hover:scale-105"
      >
        <img 
          src="../assets/Gentleman.png" 
          alt="Chatbot Cultural" 
          class="w-full h-full object-contain drop-shadow-2xl"
        />
      </button>
    </transition>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { marked } from 'marked'
import { computed, nextTick, onMounted, ref } from 'vue'
import type { Pelicula } from '../interfaces/Pelicula'
import { supabase } from '../lib/supabase'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const isOpen = ref(false)
const userInput = ref('')
const isTyping = ref(false)
const messages = ref<Message[]>([])
const messagesContainer = ref<HTMLElement | null>(null)
const peliculasDisponibles = ref<Pelicula[]>([])

const PERPLEXITY_API_KEY = import.meta.env.VITE_PERPLEXITY_API_KEY
const PERPLEXITY_API_URL = import.meta.env.VITE_PERPLEXITY_API_URL

const suggestions = ref([
  '¿Qué temas culturales?',
  'Películas similares',
  'Contexto histórico'
])

// Cargar películas disponibles
const loadPeliculas = async () => {
  try {
    const { data, error } = await supabase
      .from('pelicula')
      .select('*')
      .order('fecha_hora_proyeccion', { ascending: true })
    
    if (error) throw error
    peliculasDisponibles.value = data || []
    // console.log(`🎬 ${peliculasDisponibles.value.length} películas cargadas para el chatbot`)
  } catch (error) {
    console.error('Error al cargar películas para el chatbot:', error)
  }
}

// Generar lista de películas para el prompt
const peliculasContext = computed(() => {
  if (peliculasDisponibles.value.length === 0) return 'No hay películas disponibles actualmente.'
  
  return peliculasDisponibles.value.map(p => {
    const fecha = new Date(p.fecha_hora_proyeccion).toLocaleDateString('es-ES')
    return `- "${p.nombre}" (${p.idioma}) - ${p.descripcion || 'Sin descripción'} - Proyección: ${fecha}`
  }).join('\n')
})

const systemPrompt = computed(() => `Eres un asistente cultural cinematográfico experto llamado "CineIA Cultural" para CineUleam. Tu misión es servir como puente cultural entre diferentes cinematografías del mundo, enfocándote ESPECÍFICAMENTE en las películas disponibles en nuestra plataforma.

🎬 PELÍCULAS DISPONIBLES EN CINEULEAM:
${peliculasContext.value}

📋 TUS CAPACIDADES (basadas en nuestro catálogo):

1. **Referencias Culturales**: Explica referencias culturales, históricas y sociales SOLO de las películas listadas arriba que están en nuestra plataforma.

2. **Conexiones Transculturales**: Establece conexiones entre las películas de NUESTRO CATÁLOGO, comparando cómo diferentes culturas abordan temas universales (honor, familia, libertad, identidad, etc.).

3. **Análisis de Películas Disponibles**: Proporciona análisis profundo del contexto histórico y social de las películas que TENEMOS en la plataforma.

4. **Comparaciones en Nuestro Catálogo**: Compara y contrasta las películas disponibles en nuestra plataforma según temas, estilos, culturas, épocas.

5. **Recomendaciones Externas**: SOLO cuando el usuario pida sugerencias de películas similares, puedes recomendar películas QUE NO ESTÁN en nuestra plataforma, pero SIEMPRE menciona primero las películas similares de nuestro catálogo y luego sugiere otras externas.

⚠️ REGLAS IMPORTANTES:
- SIEMPRE prioriza hablar de las películas que están en nuestra plataforma
- Si mencionas una película, verifica que esté en la lista de arriba
- Cuando hagas comparaciones, usa SOLO películas de nuestro catálogo
- Si el usuario pregunta por una película que NO está en nuestro catálogo, informa que no la tenemos y sugiere películas similares de las que SÍ tenemos
- Solo recomienda películas externas cuando específicamente pidan "películas similares" o "recomendaciones"

Cuando respondas:
- Sé conciso pero informativo
- Usa emojis relevantes (🎭, 🌍, 📽️, 💡, 🎬, 🎥)
- Proporciona ejemplos específicos de NUESTRAS películas
- Menciona las fechas de proyección cuando sea relevante
- Establece conexiones entre culturas usando nuestro catálogo
- Fomenta que los usuarios vean las películas disponibles

Responde en español de manera educativa, accesible y siempre enfocado en nuestro catálogo actual.`)

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

const formatMarkdown = (text: string): string => {
  // Configurar marked para mejor renderizado
  marked.setOptions({
    breaks: true,
    gfm: true
  })
  
  return marked.parse(text) as string
}

// Función para sanitizar y validar entrada del usuario
const sanitizeInput = (input: string): string | null => {
  // Limitar longitud máxima
  const MAX_LENGTH = 500
  if (input.length > MAX_LENGTH) {
    return null
  }

  // Eliminar espacios en blanco excesivos
  let sanitized = input.trim().replace(/\s+/g, ' ')

  // Patrones peligrosos a detectar
  const dangerousPatterns = [
    // SQL Injection
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|DECLARE|CAST|CONVERT)\b)/gi,
    /(-{2}|\/\*|\*\/|;|\|\||&&)/g, // Comentarios SQL y operadores
    /(0x[0-9a-f]+)/gi, // Números hexadecimales (común en inyecciones)
    /(\bOR\b|\bAND\b)\s+['"]?\w+['"]?\s*=\s*['"]?\w+['"]?/gi, // OR/AND conditions típicas de inyección
    
    // XSS y Scripts
    /(<script[^>]*>.*?<\/script>)/gi,
    /(<iframe[^>]*>.*?<\/iframe>)/gi,
    /(javascript:)/gi,
    /(on\w+\s*=)/gi, // Eventos JavaScript (onclick, onerror, etc)
    
    // Command Injection
    /(\$\(.*\))/g, // Command substitution
    /(&&|\|\||\||;|`)/g, // Shell operators
    /(\.\.\/|\.\.\\)/g, // Path traversal
    
    // Intentos de bypass del sistema
    /(system|systemPrompt|API|api_key|token|password|admin|root|sudo)/gi,
    /(ignore|forget|disregard)\s+(previous|all|instructions|rules)/gi,
  ]

  // Verificar patrones peligrosos
  for (const pattern of dangerousPatterns) {
    if (pattern.test(sanitized)) {
      console.warn('⚠️ Patrón peligroso detectado en entrada del usuario')
      return null
    }
  }

  // Limitar caracteres especiales repetidos
  sanitized = sanitized.replace(/([^\w\s])\1{2,}/g, '$1$1')

  // Verificar que contenga al menos algún carácter alfanumérico
  if (!/[a-zA-Z0-9áéíóúñÁÉÍÓÚÑ]/.test(sanitized)) {
    return null
  }

  return sanitized
}

const callPerplexityAPI = async (userMessage: string): Promise<string> => {
  try {
    // Sanitizar entrada del usuario ANTES de enviar a la API
    const sanitizedMessage = sanitizeInput(userMessage)
    
    if (!sanitizedMessage) {
      console.warn('⚠️ Mensaje bloqueado por seguridad')
      return '⚠️ Lo siento, tu mensaje contiene patrones no permitidos por razones de seguridad. Por favor, reformula tu pregunta sobre películas y cultura de manera natural.'
    }

    // Construir el historial de mensajes para contexto
    // Asegurarse de que los mensajes alternen entre user y assistant
    const conversationHistory: { role: string; content: string }[] = []
    const recentMessages = messages.value.slice(-6) // Últimos 6 mensajes
    
    // Filtrar para asegurar alternancia correcta: user -> assistant -> user -> assistant
    for (let i = 0; i < recentMessages.length - 1; i++) {
      const current = recentMessages[i]
      const next = recentMessages[i + 1]
      
      // Solo incluir pares user-assistant válidos con verificación de existencia
      if (current && next && current.role === 'user' && next.role === 'assistant') {
        conversationHistory.push({
          role: 'user',
          content: current.content
        })
        conversationHistory.push({
          role: 'assistant',
          content: next.content
        })
      }
    }

    const response = await axios.post(
      PERPLEXITY_API_URL,
      {
        model: 'sonar-pro', // Modelo actualizado de Perplexity
        messages: [
          {
            role: 'system',
            content: systemPrompt.value
          },
          ...conversationHistory,
          {
            role: 'user',
            content: sanitizedMessage // Usar mensaje sanitizado
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )

    return response.data.choices[0].message.content
  } catch (error: any) {
    console.error('Error al llamar a Perplexity API:', error)
    
    // Log detallado del error para debugging
    if (error.response) {
      console.error('Response status:', error.response.status)
      console.error('Response data:', JSON.stringify(error.response.data, null, 2))
      console.error('Response headers:', error.response.headers)
      
      // Mostrar mensaje específico del error
      const errorMsg = error.response.data?.error?.message || error.response.data?.detail || 'Error desconocido'
      return `❌ Error (${error.response.status}): ${errorMsg}`
    } else if (error.request) {
      console.error('No response received:', error.request)
      return '❌ No se recibió respuesta del servidor. Verifica tu conexión.'
    } else {
      console.error('Error message:', error.message)
      return `❌ Error: ${error.message}`
    }
  }
}

const sendMessage = async (content: string) => {
  if (!content.trim()) return

  // Validar longitud antes de agregar
  if (content.length > 500) {
    messages.value.push({
      role: 'assistant',
      content: '⚠️ Tu mensaje es demasiado largo. Por favor, mantén tus preguntas en menos de 500 caracteres.',
      timestamp: new Date()
    })
    scrollToBottom()
    return
  }

  messages.value.push({
    role: 'user',
    content: content,
    timestamp: new Date()
  })

  userInput.value = ''
  isTyping.value = true
  scrollToBottom()

  // Llamar a la API de Perplexity (ya incluye sanitización)
  const response = await callPerplexityAPI(content)

  messages.value.push({
    role: 'assistant',
    content: response,
    timestamp: new Date()
  })

  isTyping.value = false
  scrollToBottom()
}

const handleSubmit = () => {
  sendMessage(userInput.value)
}

onMounted(async () => {
  // Cargar películas primero
  await loadPeliculas()
  
  // Mensaje de bienvenida personalizado
  const numPeliculas = peliculasDisponibles.value.length
  const peliculasLista = peliculasDisponibles.value.length > 0
    ? '\n\n🎬 Películas disponibles:\n' + peliculasDisponibles.value.map(p => `• ${p.nombre} (${p.idioma})`).join('\n')
    : ''
  
  messages.value.push({
    role: 'assistant',
    content: `¡Hola! 👋 Soy tu asistente cultural cinematográfico de CineUleam. 

Actualmente tenemos ${numPeliculas} película${numPeliculas !== 1 ? 's' : ''} en cartelera.${peliculasLista}

Puedo ayudarte a:
🎭 Entender referencias culturales de nuestras películas
🌍 Comparar temas entre las películas de nuestro catálogo
📽️ Explorar contextos históricos y sociales
💡 Recomendar películas similares (dentro y fuera de nuestro catálogo)

¿Qué te gustaría descubrir hoy?`,
    timestamp: new Date()
  })
})
</script>

<style scoped>
.chat-enter-active,
.chat-leave-active {
  transition: all 0.3s ease;
}

.chat-enter-from,
.chat-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.logo-enter-active,
.logo-leave-active {
  transition: all 0.3s ease;
}

.logo-enter-from,
.logo-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-8px);
  }
}

.animate-bounce {
  animation: bounce 1s infinite;
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #C1272D;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #8B1F23;
}

/* Estilos para contenido Markdown */
.prose {
  color: inherit;
}

.prose strong {
  color: #C1272D;
  font-weight: 700;
}

.prose p {
  margin: 0.5em 0;
  line-height: 1.6;
}

.prose ul,
.prose ol {
  margin: 0.5em 0;
  padding-left: 1.5em;
}

.prose li {
  margin: 0.25em 0;
}

.prose h1,
.prose h2,
.prose h3 {
  color: #C1272D;
  font-weight: 700;
  margin: 0.5em 0 0.3em 0;
}

.prose h1 {
  font-size: 1.25em;
}

.prose h2 {
  font-size: 1.1em;
}

.prose h3 {
  font-size: 1em;
}

.prose code {
  background: #f3f4f6;
  padding: 0.1em 0.3em;
  border-radius: 0.25em;
  font-size: 0.9em;
}

.prose a {
  color: #C1272D;
  text-decoration: underline;
}

.prose blockquote {
  border-left: 3px solid #C1272D;
  padding-left: 1em;
  margin: 0.5em 0;
  font-style: italic;
  color: #6b7280;
}
</style>