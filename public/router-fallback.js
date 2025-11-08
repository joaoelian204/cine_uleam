// Configuración específica para historyApiFallback en producción
// Este archivo ayuda con el routing en SPAs desplegadas

window.__ROUTER_BASE__ = "/";

// Función para manejar errores de routing
window.addEventListener("error", function (e) {
  if (e.message && e.message.includes("Loading chunk")) {
    window.location.reload();
  }
});

// Prevenir errores 404 en navegación directa
if (typeof window !== "undefined") {
  const path = window.location.pathname;

  // Lista de rutas válidas de tu aplicación
  const validRoutes = [
    "/",
    "/login",
    "/registro",
    "/reset-password",
    "/alquiler-sala",
    "/mis-tickets",
    "/admin",
  ];

  // Rutas con parámetros
  const parameterRoutes = ["/movie/", "/reserve/", "/admin/"];

  const isValidRoute =
    validRoutes.includes(path) ||
    parameterRoutes.some((route) => path.startsWith(route));

  if (!isValidRoute && path !== "/" && !path.includes(".")) {
    console.log("Ruta no reconocida, redirigiendo al home:", path);
    // No redirigir automáticamente, dejar que Vue Router maneje
  }
}
