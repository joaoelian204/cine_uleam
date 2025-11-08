import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'
import { router } from '../router/router'
import type { Usuario } from '../interfaces'

const currentUser = ref<Usuario | null>(null)
const isAuthenticated = computed(() => currentUser.value !== null)
const isAdmin = computed(() => currentUser.value?.tipo === 'admin')
const isStudent = computed(() => currentUser.value?.tipo === 'estudiante')

export function useAuth() {
  const login = async (email: string, password: string, redirect: boolean = true) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    if (data.user) {
      const { data: usuario, error: usuarioError } = await supabase
        .from('usuario')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (usuarioError) throw usuarioError

      currentUser.value = usuario
      localStorage.setItem('user', JSON.stringify(usuario))

      // Redirección automática según el tipo de usuario
      if (redirect) {
        if (usuario.tipo === 'admin') {
          router.push('/admin')
        } else if (usuario.tipo === 'estudiante') {
          router.push('/')
        }
      }
    }

    return data
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error

    currentUser.value = null
    localStorage.removeItem('user')
    
    // Redirigir al login después del logout
    router.push('/login')
  }

  const getRedirectPath = (usuario: Usuario): string => {
    switch (usuario.tipo) {
      case 'admin':
        return '/admin'
      case 'estudiante':
        return '/'
      default:
        return '/'
    }
  }

  const redirectToUserDashboard = () => {
    if (currentUser.value) {
      const path = getRedirectPath(currentUser.value)
      router.push(path)
    }
  }

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session?.user) {
      const { data: usuario } = await supabase
        .from('usuario')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (usuario) {
        currentUser.value = usuario
      }
    } else {
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        currentUser.value = JSON.parse(savedUser)
      }
    }
  }

  const register = async (email: string, password: string, nombre: string, tipo: string = 'estudiante') => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nombre,
          tipo,
        }
      }
    })

    if (error) throw error

    if (data.user) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const { error: insertError } = await supabase
        .from('usuario')
        .upsert({
          id: data.user.id,
          nombre,
          correo_institucional: email,
          tipo,
        }, {
          onConflict: 'id'
        })

      if (insertError) {
        console.error('Error al insertar usuario:', insertError)
      }
    }

    return data
  }

  return {
    currentUser,
    isAuthenticated,
    isAdmin,
    isStudent,
    login,
    logout,
    checkSession,
    register,
    getRedirectPath,
    redirectToUserDashboard,
  }
}
