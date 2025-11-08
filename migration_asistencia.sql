-- Migración para añadir las columnas necesarias para el control de asistencia
-- Este script se debe ejecutar en Supabase SQL Editor

-- Verificar si las columnas ya existen y añadirlas si no existen
DO $$ 
BEGIN
    -- Añadir columna asistencia_confirmada si no existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reserva' AND column_name = 'asistencia_confirmada'
    ) THEN
        ALTER TABLE reserva ADD COLUMN asistencia_confirmada BOOLEAN DEFAULT FALSE;
    END IF;

    -- Añadir columna qr_code si no existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reserva' AND column_name = 'qr_code'
    ) THEN
        ALTER TABLE reserva ADD COLUMN qr_code TEXT;
    END IF;
END $$;

-- Actualizar registros existentes para tener valor por defecto
UPDATE reserva 
SET asistencia_confirmada = FALSE 
WHERE asistencia_confirmada IS NULL;

-- Comentarios sobre las nuevas columnas:
-- asistencia_confirmada: BOOLEAN - Indica si el usuario confirmó su asistencia mediante QR
-- qr_code: TEXT - Almacena el código QR generado para la reserva (opcional)