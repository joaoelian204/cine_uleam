import { computed, ref } from "vue";
import { supabase } from "../lib/supabase";

export interface Reservation {
  id: string;
  usuario_id: string;
  usuario_nombre: string;
  usuario_email: string;
  pelicula_id: string;
  pelicula_nombre: string;
  asiento_id: string;
  asiento_fila: string;
  asiento_numero: number;
  sala_nombre: string;
  fecha_reserva: string;
  fecha_proyeccion: string;
  asistencia_confirmada: boolean;
  qr_code: string;
}

export interface Movie {
  id: string;
  nombre: string;
}

export interface AttendanceFilters {
  movieId: string;
  status: string;
  search: string;
}

export const useAttendance = () => {
  // Estado reactivo
  const reservations = ref<Reservation[]>([]);
  const movies = ref<Movie[]>([]);
  const loadingReservations = ref(true);
  const scannedTicket = ref<Reservation | null>(null);
  const isConfirming = ref(false);
  const showQRModal = ref(false);
  const selectedQRReservation = ref<Reservation | null>(null);

  // Filtros
  const filters = ref<AttendanceFilters>({
    movieId: "",
    status: "",
    search: "",
  });

  // Computed properties para estadísticas
  const totalReservations = computed(() => reservations.value.length);
  const confirmedAttendance = computed(
    () => reservations.value.filter((r) => r.asistencia_confirmada).length
  );
  const pendingAttendance = computed(
    () => reservations.value.filter((r) => !r.asistencia_confirmada).length
  );
  const attendancePercentage = computed(() => {
    if (totalReservations.value === 0) return 0;
    return Math.round(
      (confirmedAttendance.value / totalReservations.value) * 100
    );
  });

  // Reservas filtradas
  const filteredReservations = computed(() => {
    let filtered = reservations.value;

    if (filters.value.movieId) {
      filtered = filtered.filter(
        (r) => r.pelicula_id === filters.value.movieId
      );
    }

    if (filters.value.status === "confirmed") {
      filtered = filtered.filter((r) => r.asistencia_confirmada);
    } else if (filters.value.status === "pending") {
      filtered = filtered.filter((r) => !r.asistencia_confirmada);
    }

    if (filters.value.search) {
      const query = filters.value.search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.usuario_nombre.toLowerCase().includes(query) ||
          r.usuario_email.toLowerCase().includes(query)
      );
    }

    return filtered;
  });

  // Verificar si el usuario actual es admin
  const checkIfUserIsAdmin = async (): Promise<boolean> => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return false;

      const { data: userData, error: userError } = await supabase
        .from("usuario")
        .select("tipo")
        .eq("id", user.id)
        .single();

      if (userError) return false;

      return userData?.tipo === "admin";
    } catch (error) {
      console.error("Error verificando permisos de admin:", error);
      return false;
    }
  };

  // Cargar reservas con permisos de admin
  const loadReservationsAsAdmin = async () => {
    const { data: adminReservas, error: adminError } = await supabase.from(
      "reserva"
    ).select(`
        *,
        usuario:usuario_id (nombre, correo_institucional),
        pelicula:pelicula_id (titulo, duracion),
        asiento:asiento_id (fila, numero, sala:sala_id (nombre))
      `);

    if (!adminError && adminReservas) {
      return adminReservas.map((reserva: any) => ({
        ...reserva,
        usuario_nombre: reserva.usuario?.nombre || "Usuario desconocido",
        usuario_email: reserva.usuario?.correo_institucional || "",
        pelicula_titulo: reserva.pelicula?.titulo || "Película desconocida",
        pelicula_duracion: reserva.pelicula?.duracion || 0,
        asiento_fila: reserva.asiento?.fila || "A",
        asiento_numero: reserva.asiento?.numero || 1,
        sala_nombre: reserva.asiento?.sala?.nombre || "Sala desconocida",
        fecha_proyeccion: reserva.fecha_proyeccion,
      }));
    }

    return null;
  };

  const loadReservations = async () => {
    try {
      loadingReservations.value = true;

      // Verificar si el usuario es admin
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const isAdmin = await checkIfUserIsAdmin();

        if (isAdmin) {
          const adminData = await loadReservationsAsAdmin();
          if (adminData && adminData.length > 0) {
            reservations.value = adminData;
            return;
          }
        }
      }

      // Consulta estándar con JOINs
      const { data: reservasData, error } = await supabase
        .from("reserva")
        .select(
          `
          id,
          usuario_id,
          pelicula_id,
          asiento_id,
          fecha_creacion,
          asistencia_confirmada,
          qr_code,
          usuario:usuario_id (
            nombre,
            correo_institucional
          ),
          pelicula:pelicula_id (
            nombre,
            fecha_hora_proyeccion,
            sala_id,
            sala:sala_id (
              nombre
            )
          ),
          asiento:asiento_id (
            fila,
            numero
          )
        `
        )
        .order("fecha_creacion", { ascending: false });

      if (error) throw error;

      const transformedReservations = (reservasData || []).map(
        (reserva: any) => ({
          id: reserva.id,
          usuario_id: reserva.usuario_id,
          usuario_nombre: reserva.usuario?.nombre || "Usuario sin nombre",
          usuario_email:
            reserva.usuario?.correo_institucional || "Email no disponible",
          pelicula_id: reserva.pelicula_id,
          pelicula_nombre: reserva.pelicula?.nombre || "Película no disponible",
          asiento_id: reserva.asiento_id,
          asiento_fila: reserva.asiento?.fila || "?",
          asiento_numero: reserva.asiento?.numero || 0,
          sala_nombre: reserva.pelicula?.sala?.nombre || "Sala no disponible",
          fecha_reserva: reserva.fecha_creacion,
          fecha_proyeccion: reserva.pelicula?.fecha_hora_proyeccion || "",
          asistencia_confirmada: reserva.asistencia_confirmada || false,
          qr_code: reserva.qr_code || `reservation-${reserva.id}`,
        })
      );

      reservations.value = transformedReservations;
    } catch (error) {
      console.error("Error al cargar reservas:", error);
      reservations.value = [];
    } finally {
      loadingReservations.value = false;
    }
  };

  // Cargar películas
  const loadMovies = async () => {
    try {
      const { data, error } = await supabase
        .from("pelicula")
        .select("id, nombre")
        .order("fecha_hora_proyeccion", { ascending: true });

      if (error) throw error;
      movies.value = data || [];
    } catch (error) {
      console.error("Error al cargar películas:", error);
      movies.value = [];
    }
  };

  // Confirmar asistencia por QR
  const confirmAttendanceByQR = async () => {
    if (!scannedTicket.value) return;

    try {
      isConfirming.value = true;

      const { error } = await supabase
        .from("reserva")
        .update({ asistencia_confirmada: true })
        .eq("id", scannedTicket.value.id);

      if (error) throw error;

      const reservationIndex = reservations.value.findIndex(
        (r) => r.id === scannedTicket.value!.id
      );

      if (reservationIndex !== -1 && reservations.value[reservationIndex]) {
        reservations.value[reservationIndex].asistencia_confirmada = true;
      }

      scannedTicket.value = null;
    } catch (error) {
      console.error("Error al confirmar asistencia:", error);
      alert("Error al confirmar asistencia");
    } finally {
      isConfirming.value = false;
    }
  };

  // Confirmar asistencia manual
  const confirmAttendanceManual = async (reservation: Reservation) => {
    try {
      const { error } = await supabase
        .from("reserva")
        .update({ asistencia_confirmada: true })
        .eq("id", reservation.id);

      if (error) throw error;

      const reservationIndex = reservations.value.findIndex(
        (r) => r.id === reservation.id
      );

      if (reservationIndex !== -1 && reservations.value[reservationIndex]) {
        reservations.value[reservationIndex].asistencia_confirmada = true;
      }
    } catch (error) {
      console.error("Error al confirmar asistencia:", error);
      alert("Error al confirmar asistencia");
    }
  };

  // Manejar detección de QR con confirmación automática
  const handleQRDetected = async (ticket: Reservation) => {
    // Verificar si ya está confirmada la asistencia
    if (ticket.asistencia_confirmada) {
      alert(`✅ La asistencia de ${ticket.usuario_nombre} ya está confirmada.`);
      return;
    }

    try {
      // Confirmar automáticamente la asistencia
      const { error } = await supabase
        .from("reserva")
        .update({ asistencia_confirmada: true })
        .eq("id", ticket.id);

      if (error) throw error;

      // Actualizar la reserva en el estado local
      const reservationIndex = reservations.value.findIndex(
        (r) => r.id === ticket.id
      );

      if (reservationIndex !== -1 && reservations.value[reservationIndex]) {
        reservations.value[reservationIndex].asistencia_confirmada = true;
      }

      // Mostrar mensaje de éxito
      alert(`🎉 ¡Asistencia confirmada automáticamente!
      
Usuario: ${ticket.usuario_nombre}
Película: ${ticket.pelicula_nombre}
Asiento: ${ticket.asiento_fila}${ticket.asiento_numero}
Hora: ${new Date().toLocaleTimeString()}`);
    } catch (error) {
      console.error("Error al confirmar asistencia automáticamente:", error);
      // Si hay error, mostrar el modal de confirmación manual como respaldo
      scannedTicket.value = ticket;
      alert(
        "Error en la confirmación automática. Se mostrará el modal de confirmación manual."
      );
    }
  };

  // Cancelar escaneo
  const cancelScan = () => {
    scannedTicket.value = null;
  };

  // Mostrar código QR
  const showQRCode = (reservation: Reservation) => {
    selectedQRReservation.value = reservation;
    showQRModal.value = true;
  };

  // Cerrar modal QR
  const closeQRModal = () => {
    showQRModal.value = false;
    selectedQRReservation.value = null;
  };

  // Actualizar filtros
  const updateFilter = (key: keyof AttendanceFilters, value: string) => {
    filters.value[key] = value;
  };

  return {
    // Estado
    reservations,
    movies,
    loadingReservations,
    scannedTicket,
    isConfirming,
    showQRModal,
    selectedQRReservation,
    filters,

    // Computed
    totalReservations,
    confirmedAttendance,
    pendingAttendance,
    attendancePercentage,
    filteredReservations,

    // Métodos
    loadReservations,
    loadMovies,
    confirmAttendanceByQR,
    confirmAttendanceManual,
    handleQRDetected,
    cancelScan,
    showQRCode,
    closeQRModal,
    updateFilter,
  };
};
