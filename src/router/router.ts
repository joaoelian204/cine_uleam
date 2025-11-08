import { createRouter, createWebHistory } from "vue-router";
import { useAuth } from "../composables/useAuth";

import HomePage from "../pages/HomePage.vue";
import Login from "../pages/Login.vue";
import MovieDetails from "../pages/MovieDetails.vue";
import Registro from "../pages/Registro.vue";
import Reserve from "../pages/Reserve.vue";
import ResetPassword from "../pages/ResetPassword.vue";
import AlquilerSala from "../pages/AlquilerSala.vue";
import MisTickets from "../pages/MisTickets.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomePage,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/registro",
    name: "registro",
    component: Registro,
  },
  {
    path: "/reset-password",
    name: "resetPassword",
    component: ResetPassword,
  },
  {
    path: "/movie/:movie",
    name: "movieDetails",
    component: MovieDetails,
  },
  {
    path: "/reserve/:movie",
    name: "Reserve",
    component: Reserve,
  },
  {
    path: "/alquiler-sala",
    name: "alquilerSala",
    component: AlquilerSala,
  },
  {
    path: "/mis-tickets",
    name: "misTickets",
    component: MisTickets,
    meta: { requiresAuth: true }
  },
  {
    path: "/admin",
    name: "admin",
    component: () => import("../pages/Admin.vue"),
    meta: { requiresAuth: true, requiresAdmin: true }
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard para proteger rutas
router.beforeEach(async (to, _from, next) => {
  const { isAuthenticated, isAdmin, checkSession } = useAuth();

  // Esperar a que se verifique la sesión antes de evaluar
  await checkSession();

  // Debug logs comentados para producción
  // console.log('🔐 Router Guard:', {
  //   route: to.path,
  //   requiresAuth: to.meta.requiresAuth,
  //   requiresAdmin: to.meta.requiresAdmin,
  //   isAuthenticated: isAuthenticated.value,
  //   isAdmin: isAdmin.value
  // });

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    // console.log('❌ Guard: No autenticado, redirigiendo a /login');
    next("/login");
  } else if (to.meta.requiresAdmin && !isAdmin.value) {
    // console.log('❌ Guard: No es admin, redirigiendo a /');
    next("/"); // Redirigir al home si no es admin
  } else {
    // console.log('✅ Guard: Acceso permitido');
    next();
  }
});
