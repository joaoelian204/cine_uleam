import { readonly, ref } from "vue";

export interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  duration?: number;
  show: boolean;
}

const toasts = ref<Toast[]>([]);

export const useNotifications = () => {
  const addToast = (toast: Omit<Toast, "id" | "show">) => {
    const id = Date.now().toString();
    const newToast: Toast = {
      id,
      show: true,
      duration: 5000,
      ...toast,
    };

    toasts.value.push(newToast);

    // Auto-remove after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }

    return id;
  };

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex((t) => t.id === id);
    if (index > -1) {
      const toast = toasts.value[index];
      if (toast) {
        toast.show = false;
        setTimeout(() => {
          toasts.value.splice(index, 1);
        }, 300); // Wait for transition
      }
    }
  };

  const clearAll = () => {
    toasts.value.forEach((toast) => {
      toast.show = false;
    });
    setTimeout(() => {
      toasts.value.splice(0);
    }, 300);
  };

  // Helper methods for different types
  const showSuccess = (title: string, message: string, duration = 5000) => {
    return addToast({ type: "success", title, message, duration });
  };

  const showError = (title: string, message: string, duration = 8000) => {
    return addToast({ type: "error", title, message, duration });
  };

  const showWarning = (title: string, message: string, duration = 6000) => {
    return addToast({ type: "warning", title, message, duration });
  };

  const showInfo = (title: string, message: string, duration = 5000) => {
    return addToast({ type: "info", title, message, duration });
  };

  // Error handlers for different error types
  const handleSupabaseError = (error: any, context: string) => {
    console.error(`Supabase error in ${context}:`, error);

    let title = "Error del Servidor";
    let message = "Ha ocurrido un error inesperado.";

    if (error?.message) {
      if (error.message.includes("406")) {
        title = "Error de Configuración";
        message =
          "Problema con los headers de la API. Por favor, intenta nuevamente.";
      } else if (error.message.includes("500")) {
        title = "Error del Servidor";
        message =
          "El servidor está experimentando problemas. Intenta más tarde.";
      } else if (error.message.includes("Network")) {
        title = "Error de Conexión";
        message = "Verifica tu conexión a internet e intenta nuevamente.";
      } else {
        message = error.message;
      }
    }

    return showError(title, message);
  };

  const handleEmailError = (error: any) => {
    console.error("Email error:", error);

    return showWarning(
      "Email no Enviado",
      "No se pudo enviar el ticket por email automáticamente. Puedes descargarlo desde el modal.",
      10000
    );
  };

  const handleImageError = (error: any) => {
    console.error("Image processing error:", error);

    return showError(
      "Error de Imagen",
      "No se pudo procesar la imagen del ticket. Intenta nuevamente.",
      6000
    );
  };

  return {
    toasts: readonly(toasts),
    addToast,
    removeToast,
    clearAll,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    handleSupabaseError,
    handleEmailError,
    handleImageError,
  };
};
