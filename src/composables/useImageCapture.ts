import * as domtoimage from "dom-to-image-more";

export const useImageCapture = () => {
  // Configuración optimizada para máxima calidad y evitar errores CORS
  const getOptimizedOptions = () => ({
    quality: 1.0, // Máxima calidad
    bgcolor: "#ffffff",
    useCORS: true,
    allowTaint: true,
    scale: 2, // Escala 2x para mejor resolución
    width: 800, // Ancho fijo para mejor calidad
    height: 1200, // Alto proporcional
    style: {
      "font-family":
        '"Inter", "Segoe UI", Arial, sans-serif, -apple-system, BlinkMacSystemFont, Roboto',
      transform: "scale(1)",
      "transform-origin": "top left",
      "font-smoothing": "antialiased",
      "-webkit-font-smoothing": "antialiased",
      "-moz-osx-font-smoothing": "grayscale",
    },
    filter: (node: any) => {
      // Filtrar nodos problemáticos
      if (!node || !node.tagName) return true;

      const tagName = node.tagName.toUpperCase();

      // Filtrar links de Google Fonts y otros recursos externos
      if (tagName === "LINK") {
        const href = node.getAttribute("href") || "";
        if (
          href.includes("fonts.googleapis.com") ||
          href.includes("fonts.gstatic.com") ||
          href.includes("google.com")
        ) {
          return false;
        }
      }

      // Filtrar scripts externos
      if (tagName === "SCRIPT") {
        const src = node.getAttribute("src") || "";
        if (
          src.includes("google") ||
          src.includes("gtag") ||
          src.includes("analytics")
        ) {
          return false;
        }
      }

      return true;
    },
    imagePlaceholder:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
  });

  // Función para capturar imagen con múltiples intentos y mayor calidad
  const captureElementAsImage = async (
    element: HTMLElement,
    retries = 3
  ): Promise<string> => {
    let lastError: any;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(
          `📷 Intento ${attempt} de captura de imagen de alta calidad...`
        );

        // Pausa más larga para asegurar que el DOM esté completamente renderizado
        await new Promise((resolve) => setTimeout(resolve, 200 * attempt));

        // Forzar repaint del elemento
        element.style.transform = "translateZ(0)";
        element.offsetHeight; // Trigger reflow

        const dataUrl = await domtoimage.toPng(element, getOptimizedOptions());

        // Verificar que la imagen se generó correctamente
        if (dataUrl && dataUrl.startsWith("data:image/png;base64,")) {
          console.log("✅ Imagen de alta calidad capturada exitosamente");
          return dataUrl;
        } else {
          throw new Error("Imagen generada inválida");
        }
      } catch (error) {
        console.warn(`⚠️ Intento ${attempt} falló:`, error);
        lastError = error;

        if (attempt < retries) {
          // Esperar progresivamente más tiempo
          await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
        }
      }
    }

    // Si todos los intentos fallaron, intentar con configuración media
    try {
      console.log("🔄 Intentando captura con configuración media...");

      const mediumOptions = {
        quality: 0.9,
        bgcolor: "#ffffff",
        scale: 1.5,
        useCORS: true,
        style: {
          "font-family": '"Inter", Arial, sans-serif',
          "font-smoothing": "antialiased",
        },
        filter: (node: any) => {
          if (!node || !node.tagName) return true;
          const tagName = node.tagName.toUpperCase();
          return !(
            tagName === "LINK" &&
            node.getAttribute("href")?.includes("fonts.googleapis.com")
          );
        },
      };

      const dataUrl = await domtoimage.toPng(element, mediumOptions);
      if (dataUrl && dataUrl.startsWith("data:image/png;base64,")) {
        console.log("✅ Imagen de calidad media capturada exitosamente");
        return dataUrl;
      }
      throw new Error("Imagen media generada inválida");
    } catch (mediumError) {
      console.warn(
        "⚠️ Configuración media falló, intentando configuración básica..."
      );

      try {
        const basicOptions = {
          quality: 0.8,
          bgcolor: "#ffffff",
          scale: 1,
          style: {
            "font-family": "Arial, sans-serif",
          },
        };

        return await domtoimage.toPng(element, basicOptions);
      } catch (finalError) {
        console.error("❌ Error final en captura de imagen:", finalError);
        throw new Error(
          `No se pudo capturar la imagen después de ${retries} intentos. Error: ${
            lastError?.message || "Desconocido"
          }`
        );
      }
    }
  };

  // Función específica para capturar tickets
  const captureTicketImage = async (
    ticketElement: HTMLElement
  ): Promise<string> => {
    try {
      // Asegurar que las fuentes estén cargadas
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      return await captureElementAsImage(ticketElement, 3);
    } catch (error) {
      console.error("❌ Error capturando ticket:", error);
      throw error;
    }
  };

  return {
    captureElementAsImage,
    captureTicketImage,
  };
};
