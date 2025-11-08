import { supabase } from '../lib/supabase'

/**
 * Script para insertar películas de ejemplo en la base de datos
 * Ejecutar desde la consola del navegador o como script de Node
 */

export const peliculasEjemplo = [
  {
    nombre: "THE MATRIX",
    descripcion: "Un hacker descubre que la realidad tal como la conoce es una simulación creada por máquinas.",
    url_poster: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    idioma: "Inglés",
    fecha_hora_proyeccion: "2025-11-15T19:30:00Z",
    sala_id: '56c73a02-647a-4073-b4cc-72e877ce0fd8'
  },
  {
    nombre: "INCEPTION",
    descripcion: "Un ladrón que roba secretos corporativos mediante tecnología de sueños compartidos.",
    url_poster: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    idioma: "Inglés",
    fecha_hora_proyeccion: "2025-11-16T20:00:00Z",
    sala_id: '56c73a02-647a-4073-b4cc-72e877ce0fd8'
  },
  {
    nombre: "ZOOPOCALIPSIS",
    descripcion: "Aventura animada llena de acción y humor para toda la familia.",
    url_poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    idioma: "Español",
    fecha_hora_proyeccion: "2025-11-14T16:00:00Z",
    sala_id: '56c73a02-647a-4073-b4cc-72e877ce0fd8'
  },
  {
    nombre: "VOLVER AL FUTURO",
    descripcion: "Un adolescente viaja accidentalmente 30 años al pasado en un DeLorean.",
    url_poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    idioma: "Inglés",
    fecha_hora_proyeccion: "2025-11-17T18:30:00Z",
    sala_id: '56c73a02-647a-4073-b4cc-72e877ce0fd8'
  },
  {
    nombre: "EL CADAVER DE LA NOVIA",
    descripcion: "Animación gótica de Tim Burton sobre amor más allá de la muerte.",
    url_poster: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    idioma: "Español",
    fecha_hora_proyeccion: "2025-11-15T15:00:00Z",
    sala_id: '56c73a02-647a-4073-b4cc-72e877ce0fd8'
  },
  {
    nombre: "TELEFONO NEGRO 2",
    descripcion: "Terror psicológico que explora los horrores del pasado.",
    url_poster: "https://image.tmdb.org/t/p/w500/5vUux2vNUTqwCzb7tVcH18XnsF5.jpg",
    idioma: "Inglés",
    fecha_hora_proyeccion: "2025-11-18T21:30:00Z",
    sala_id: '56c73a02-647a-4073-b4cc-72e877ce0fd8'
  },
  {
    nombre: "LA VITA È BELLA",
    descripcion: "Un padre usa su imaginación para proteger a su hijo en un campo de concentración.",
    url_poster: "https://image.tmdb.org/t/p/w500/mGJuQwMq1bEboaVTqQAW9UZZfMo.jpg",
    idioma: "Italiano",
    fecha_hora_proyeccion: "2025-11-16T17:00:00Z",
    sala_id: '56c73a02-647a-4073-b4cc-72e877ce0fd8'
  },
  {
    nombre: "AMÉLIE",
    descripcion: "Una joven parisina decide cambiar la vida de quienes la rodean.",
    url_poster: "https://image.tmdb.org/t/p/w500/6DrHO1jr3qVrViUO6s6kFiAGM7.jpg",
    idioma: "Francés",
    fecha_hora_proyeccion: "2025-11-19T19:00:00Z",
    sala_id: '56c73a02-647a-4073-b4cc-72e877ce0fd8'
  }
]

export async function insertarPeliculasEjemplo() {
  try {
    console.log('🎬 Insertando películas de ejemplo...')
    
    const { data, error } = await supabase
      .from('pelicula')
      .insert(peliculasEjemplo)
      .select()
    
    if (error) {
      console.error('❌ Error al insertar películas:', error)
      return { success: false, error }
    }
    
    console.log(`✅ ${data?.length} películas insertadas correctamente:`, data)
    return { success: true, data }
  } catch (err) {
    console.error('❌ Error inesperado:', err)
    return { success: false, error: err }
  }
}

// Para ejecutar desde la consola del navegador:
// import { insertarPeliculasEjemplo } from './scripts/seedPeliculas'
// insertarPeliculasEjemplo()
