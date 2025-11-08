#!/bin/bash
# Script de build robusto para Netlify

echo "🚀 Iniciando build de CineUleam con reintentos automáticos..."

# Función para instalar dependencias con reintentos
install_dependencies() {
    local max_attempts=5
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        echo "📦 Intento $attempt de $max_attempts: Instalando dependencias..."
        
        if npm install --legacy-peer-deps --fetch-timeout=600000 --fetch-retries=10; then
            echo "✅ Dependencias instaladas exitosamente"
            return 0
        else
            echo "❌ Falló el intento $attempt"
            if [ $attempt -lt $max_attempts ]; then
                echo "⏳ Esperando 10 segundos antes del siguiente intento..."
                sleep 10
                # Limpiar cache de npm
                npm cache clean --force 2>/dev/null || true
            fi
        fi
        
        attempt=$((attempt + 1))
    done
    
    echo "💥 Error: No se pudieron instalar las dependencias después de $max_attempts intentos"
    return 1
}

# Ejecutar instalación con reintentos
if install_dependencies; then
    echo "🏗️ Iniciando build de la aplicación..."
    npm run build
    echo "🎉 Build completado exitosamente!"
else
    echo "💥 Error: Build fallido por problemas de dependencias"
    exit 1
fi