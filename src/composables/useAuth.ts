import { computed, ref } from "vue";
import type { Usuario } from "../interfaces";
import { getRedirectURL, supabase } from "../lib/supabase";
import { router } from "../router/router";

const currentUser = ref<Usuario | null>(null);
const isAuthenticated = computed(() => currentUser.value !== null);
const isAdmin = computed(() => currentUser.value?.tipo === "admin");
const isStudent = computed(() => currentUser.value?.tipo === "estudiante");
const sessionCheckInterval = ref<ReturnType<typeof setInterval> | null>(null);

// 🔥 NUEVO: Función para limpiar intervalos
const clearSessionCheck = () => {
  if (sessionCheckInterval.value) {
    clearInterval(sessionCheckInterval.value);
    sessionCheckInterval.value = null;
  }
};

// 🔥 NUEVO: Función para verificar sesión periódicamente
const startSessionCheck = () => {
  clearSessionCheck(); // Limpiar cualquier intervalo anterior

  // Verificar sesión cada 5 minutos
  sessionCheckInterval.value = setInterval(async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        console.warn("⚠️ Sesión expirada o inválida, cerrando sesión...");
        await forceLogout();
      } else {
        // Refrescar token si está cerca de expirar
        const expiresAt = session.expires_at;
        const now = Math.floor(Date.now() / 1000);

        if (expiresAt) {
          const timeUntilExpiry = expiresAt - now;

          // Si expira en menos de 10 minutos, refrescar
          if (timeUntilExpiry < 600) {
            const { error: refreshError } =
              await supabase.auth.refreshSession();
            if (refreshError) {
              console.warn("⚠️ Error refrescando sesión:", refreshError);
              await forceLogout();
            } else {
              console.log("✅ Sesión refrescada automáticamente");
            }
          }
        }
      }
    } catch (error) {
      console.error("❌ Error verificando sesión:", error);
    }
  }, 5 * 60 * 1000); // 5 minutos
};

// 🔥 NUEVO: Función para forzar logout sin hacer request a Supabase
const forceLogout = async () => {
  clearSessionCheck();
  currentUser.value = null;
  localStorage.removeItem("user");

  // Redirigir al login
  if (router.currentRoute.value.path !== "/login") {
    router.push("/login");
  }
};

export function useAuth() {
  const login = async (
    email: string,
    password: string,
    redirect: boolean = true
  ) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      const { data: usuario, error: usuarioError } = await supabase
        .from("usuario")
        .select("*")
        .eq("id", data.user.id)
        .single();

      if (usuarioError) throw usuarioError;

      currentUser.value = usuario;
      localStorage.setItem("user", JSON.stringify(usuario));

      // 🔥 NUEVO: Iniciar verificación periódica de sesión
      startSessionCheck();

      // Redirección automática según el tipo de usuario
      if (redirect) {
        if (usuario.tipo === "admin") {
          router.push("/admin");
        } else if (usuario.tipo === "estudiante") {
          router.push("/");
        }
      }
    }

    return data;
  };

  const logout = async () => {
    try {
      // 🔥 MEJORADO: Limpiar interval antes de logout
      clearSessionCheck();

      const { error } = await supabase.auth.signOut();
      if (error) {
        console.warn("⚠️ Error en signOut, pero forzando logout:", error);
      }
    } catch (error) {
      console.warn("⚠️ Error durante logout, pero forzando limpieza:", error);
    }

    // Limpiar estado local siempre
    currentUser.value = null;
    localStorage.removeItem("user");

    // Redirigir al login después del logout
    router.push("/login");
  };

  const getRedirectPath = (usuario: Usuario): string => {
    switch (usuario.tipo) {
      case "admin":
        return "/admin";
      case "estudiante":
        return "/";
      default:
        return "/";
    }
  };

  const redirectToUserDashboard = () => {
    if (currentUser.value) {
      const path = getRedirectPath(currentUser.value);
      router.push(path);
    }
  };

  const checkSession = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const { data: usuario } = await supabase
          .from("usuario")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (usuario) {
          currentUser.value = usuario;
          // 🔥 NUEVO: Iniciar verificación periódica si hay sesión activa
          startSessionCheck();
          return;
        }
      }

      // Si no hay sesión válida, intentar desde localStorage
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          currentUser.value = JSON.parse(savedUser);
          // Verificar que la sesión local aún sea válida
          const {
            data: { session: currentSession },
          } = await supabase.auth.getSession();
          if (currentSession?.user) {
            startSessionCheck();
          } else {
            // Sesión inválida, limpiar
            await forceLogout();
          }
        } catch (parseError) {
          // localStorage corrupto, limpiar
          localStorage.removeItem("user");
        }
      }
    } catch (error) {
      console.error("❌ Error verificando sesión:", error);
      await forceLogout();
    }
  };

  const register = async (
    email: string,
    password: string,
    nombre: string,
    tipo: string = "estudiante"
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nombre,
          tipo,
        },
      },
    });

    if (error) throw error;

    if (data.user) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const { error: insertError } = await supabase.from("usuario").upsert(
        {
          id: data.user.id,
          nombre,
          correo_institucional: email,
          tipo,
        },
        {
          onConflict: "id",
        }
      );

      if (insertError) {
        console.error("Error al insertar usuario:", insertError);
      }
    }

    return data;
  };

  // Función para solicitar reset de password
  const requestPasswordReset = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${getRedirectURL()}/reset-password`,
    });

    if (error) {
      throw error;
    }
  };

  // Función para actualizar password con token
  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw error;
    }
  };

  return {
    currentUser,
    isAuthenticated,
    isAdmin,
    isStudent,
    login,
    logout,
    checkSession,
    register,
    requestPasswordReset,
    updatePassword,
    getRedirectPath,
    redirectToUserDashboard,
    // 🔥 NUEVO: Exponer funciones de manejo de sesión
    clearSessionCheck,
    forceLogout,
    startSessionCheck,
  };
}
