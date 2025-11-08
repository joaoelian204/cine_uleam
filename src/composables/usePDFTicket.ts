import jsPDF from "jspdf";
import QRCode from "qrcode";

export interface TicketPDFData {
  reservationId: string;
  movieName: string;
  movieLanguage: string;
  dateTime: string;
  salaName: string;
  seatRow: string;
  seatNumber: number;
  userName: string;
  userEmail: string;
}

export const usePDFTicket = () => {
  const generateTicketPDF = async (
    ticketData: TicketPDFData
  ): Promise<Blob> => {
    try {
      // Crear nuevo documento PDF (tamaño carta)
      const pdf = new jsPDF("portrait", "mm", "a4");

      // Configurar colores con tipos explícitos
      const primaryColor: [number, number, number] = [193, 39, 45]; // #C1272D
      const darkGray: [number, number, number] = [51, 51, 51];
      const lightGray: [number, number, number] = [128, 128, 128];
      const white: [number, number, number] = [255, 255, 255];

      // Dimensiones del ticket
      const pageWidth = pdf.internal.pageSize.getWidth();
      const ticketWidth = 160;
      const ticketHeight = 220;
      const startX = (pageWidth - ticketWidth) / 2;
      const startY = 20;

      // Fondo blanco del ticket con borde
      pdf.setFillColor(...white);
      pdf.setDrawColor(...primaryColor);
      pdf.setLineWidth(2);
      pdf.roundedRect(startX, startY, ticketWidth, ticketHeight, 8, 8, "FD");

      // Header con gradiente simulado
      pdf.setFillColor(...primaryColor);
      pdf.roundedRect(startX, startY, ticketWidth, 40, 8, 8, "F");

      // Logo/Título en el header
      pdf.setTextColor(...white);
      pdf.setFontSize(24);
      pdf.setFont("helvetica", "bold");
      pdf.text("CineUleam", startX + ticketWidth / 2, startY + 15, {
        align: "center",
      });

      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.text("ENTRADA DIGITAL", startX + ticketWidth / 2, startY + 25, {
        align: "center",
      });

      // Badge de confirmación
      pdf.setFillColor(...white);
      pdf.setDrawColor(...white);
      pdf.roundedRect(startX + 40, startY + 30, 80, 8, 4, 4, "FD");
      pdf.setTextColor(...primaryColor);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.text("¡RESERVA CONFIRMADA!", startX + ticketWidth / 2, startY + 36, {
        align: "center",
      });

      // Información de la película
      let currentY = startY + 50;

      // Título de la película
      pdf.setFillColor(...darkGray);
      pdf.roundedRect(startX + 10, currentY, ticketWidth - 20, 25, 4, 4, "F");

      pdf.setTextColor(...white);
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");

      // Dividir el título si es muy largo
      const splitMovieName = pdf.splitTextToSize(
        ticketData.movieName,
        ticketWidth - 30
      );
      pdf.text(splitMovieName, startX + ticketWidth / 2, currentY + 10, {
        align: "center",
      });

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.text(
        `${ticketData.movieLanguage} • Función Regular`,
        startX + ticketWidth / 2,
        currentY + 20,
        { align: "center" }
      );

      currentY += 35;

      // Grid de información
      const gridItems = [
        { label: "FECHA", value: formatDate(ticketData.dateTime), icon: "📅" },
        { label: "HORA", value: formatTime(ticketData.dateTime), icon: "🕐" },
        { label: "SALA", value: ticketData.salaName, icon: "🏢" },
        {
          label: "ASIENTO",
          value: `${ticketData.seatRow}${ticketData.seatNumber}`,
          icon: "💺",
        },
      ];

      const itemWidth = (ticketWidth - 30) / 2;
      const itemHeight = 25;

      gridItems.forEach((item, index) => {
        const col = index % 2;
        const row = Math.floor(index / 2);
        const x = startX + 10 + col * (itemWidth + 5);
        const y = currentY + row * (itemHeight + 5);

        // Fondo del item con colores definidos
        const colors: [number, number, number][] = [
          [59, 130, 246], // blue
          [16, 185, 129], // green
          [139, 92, 246], // purple
          [239, 68, 68], // red
        ];

        const itemColor = colors[index];
        if (itemColor) {
          // Fondo del item (sin setGlobalAlpha ya que no está disponible)
          pdf.setFillColor(itemColor[0], itemColor[1], itemColor[2]);
          pdf.roundedRect(x, y, itemWidth, itemHeight, 4, 4, "F");

          // Borde
          pdf.setDrawColor(...itemColor);
          pdf.setLineWidth(1);
          pdf.roundedRect(x, y, itemWidth, itemHeight, 4, 4, "S");

          // Texto del label
          pdf.setTextColor(...itemColor);
          pdf.setFontSize(8);
          pdf.setFont("helvetica", "bold");
          pdf.text(item.label, x + 5, y + 8);

          // Texto del valor
          pdf.setTextColor(...darkGray);
          pdf.setFontSize(12);
          pdf.setFont("helvetica", "bold");
          pdf.text(item.value, x + 5, y + 18);
        }
      });

      currentY += 60;

      // Información del usuario
      pdf.setFillColor(...darkGray);
      pdf.roundedRect(startX + 10, currentY, ticketWidth - 20, 25, 4, 4, "F");

      pdf.setTextColor(...white);
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "bold");
      pdf.text("RESERVADO POR", startX + 15, currentY + 8);

      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text(ticketData.userName, startX + 15, currentY + 16);

      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.text(ticketData.userEmail, startX + 15, currentY + 22);

      currentY += 35;

      // Código QR
      const qrData = JSON.stringify({
        id: ticketData.reservationId,
        movie: ticketData.movieName,
        seat: `${ticketData.seatRow}${ticketData.seatNumber}`,
        date: ticketData.dateTime,
        user: ticketData.userEmail,
      });

      const qrCodeDataURL = await QRCode.toDataURL(qrData, {
        width: 200,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
        errorCorrectionLevel: "M",
      });

      // Agregar QR al PDF
      const qrSize = 40;
      const qrX = startX + (ticketWidth - qrSize) / 2;
      pdf.addImage(qrCodeDataURL, "PNG", qrX, currentY, qrSize, qrSize);

      currentY += 50;

      // ID de reserva
      pdf.setFillColor(240, 240, 240);
      pdf.roundedRect(startX + 20, currentY, ticketWidth - 40, 15, 4, 4, "F");

      pdf.setTextColor(...lightGray);
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "bold");
      pdf.text("ID DE RESERVA", startX + ticketWidth / 2, currentY + 6, {
        align: "center",
      });

      pdf.setTextColor(...darkGray);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      const shortId = `${ticketData.reservationId.substring(
        0,
        8
      )}-${ticketData.reservationId.substring(8, 16)}`;
      pdf.text(shortId, startX + ticketWidth / 2, currentY + 12, {
        align: "center",
      });

      // Instrucciones importantes al final
      currentY = startY + ticketHeight + 10;

      pdf.setFillColor(255, 248, 220); // lightyellow
      pdf.setDrawColor(255, 193, 7); // warning color
      pdf.setLineWidth(2);
      pdf.roundedRect(startX, currentY, ticketWidth, 30, 4, 4, "FD");

      pdf.setTextColor(139, 69, 19); // dark orange
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("⚠️ Importante:", startX + 10, currentY + 10);

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.text(
        "• Presenta este PDF o escanea el código QR en la entrada",
        startX + 10,
        currentY + 18
      );
      pdf.text(
        "• Llega 30 minutos antes del inicio de la función",
        startX + 10,
        currentY + 24
      );

      console.log("✅ PDF del ticket generado exitosamente");
      return pdf.output("blob");
    } catch (error) {
      console.error("❌ Error generando PDF del ticket:", error);
      throw new Error(`Error al generar PDF: ${error}`);
    }
  };

  const downloadTicketPDF = async (
    ticketData: TicketPDFData,
    fileName?: string
  ) => {
    try {
      const pdfBlob = await generateTicketPDF(ticketData);

      // Crear URL temporal para descarga
      const url = URL.createObjectURL(pdfBlob);

      // Crear enlace de descarga
      const link = document.createElement("a");
      link.href = url;
      link.download =
        fileName || `ticket-${ticketData.reservationId.substring(0, 8)}.pdf`;

      // Ejecutar descarga
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Limpiar URL temporal
      URL.revokeObjectURL(url);

      console.log("✅ PDF del ticket descargado exitosamente");
    } catch (error) {
      console.error("❌ Error descargando PDF:", error);
      throw error;
    }
  };

  // Funciones auxiliares para formato de fecha
  const formatDate = (dateTime: string) => {
    try {
      const date = new Date(dateTime);
      return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "Fecha no válida";
    }
  };

  const formatTime = (dateTime: string) => {
    try {
      const date = new Date(dateTime);
      return date.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Hora no válida";
    }
  };

  const generateTicketPDFAsBase64 = async (
    ticketData: TicketPDFData
  ): Promise<string> => {
    try {
      const pdfBlob = await generateTicketPDF(ticketData);

      // Convertir Blob a base64
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // Remover el prefijo data:application/pdf;base64,
          const base64 = result.split(",")[1];
          if (base64) {
            resolve(base64);
          } else {
            reject(new Error("No se pudo extraer el contenido base64"));
          }
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(pdfBlob);
      });
    } catch (error) {
      console.error("❌ Error generando PDF como base64:", error);
      throw error;
    }
  };

  return {
    generateTicketPDF,
    generateTicketPDFAsBase64,
    downloadTicketPDF,
  };
};
