# 🚀 Variables de Entorno para Netlify - CineUleam

## 📋 Variables de EmailJS para Netlify

### 🔧 Variables Necesarias

En tu panel de Netlify, ve a **Site settings > Environment variables** y agrega estas variables:

```bash
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=service_fbu6meg
VITE_EMAILJS_TEMPLATE_ID=template_cineuleam
VITE_EMAILJS_PUBLIC_KEY=sgK2GE1Ny08WUbBBL
```

### 📝 Instrucciones Paso a Paso

#### 1. Acceder a Netlify Dashboard

1. Ve a https://app.netlify.com/
2. Selecciona tu sitio de CineUleam
3. Ve a **Site settings**
4. En el menú lateral, busca **Environment variables**

#### 2. Agregar Variables de EmailJS

Agrega estas 3 variables exactamente como se muestra:

| Nombre de Variable         | Valor                | Descripción                 |
| -------------------------- | -------------------- | --------------------------- |
| `VITE_EMAILJS_SERVICE_ID`  | `service_fbu6meg`    | Tu Service ID de EmailJS    |
| `VITE_EMAILJS_TEMPLATE_ID` | `template_cineuleam` | ID del template que creaste |
| `VITE_EMAILJS_PUBLIC_KEY`  | `sgK2GE1Ny08WUbBBL`  | Tu Public Key de EmailJS    |

#### 3. Variables de Supabase (si no están configuradas)

También asegúrate de tener estas variables para Supabase:

| Nombre de Variable       | Ejemplo                           | Descripción                 |
| ------------------------ | --------------------------------- | --------------------------- |
| `VITE_SUPABASE_URL`      | `https://tu-proyecto.supabase.co` | URL de tu proyecto Supabase |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIs...`         | Anon/public key de Supabase |

### 🔄 Redeploy Después de Configurar

Después de agregar las variables:

1. **Trigger Deploy** - Haz un nuevo deploy para que las variables surtan efecto
2. **Clear Cache** - Asegúrate de que el cache esté limpio
3. **Test** - Prueba hacer una reserva para verificar el envío de emails

### 🛡️ Seguridad de Variables

#### ✅ Variables Públicas (VITE\_\*)

- Estas variables son seguras para el frontend
- Se incluyen en el bundle de producción
- Son visibles para los usuarios (pero está bien para EmailJS)

#### ⚠️ Buenas Prácticas

- No incluyas claves privadas en variables `VITE_*`
- Las Public Keys de EmailJS están diseñadas para ser públicas
- Tu Service ID y Template ID no son sensibles

### 🔧 Verificación Local

Para probar localmente, crea un archivo `.env` en la raíz del proyecto:

```bash
# .env (solo para desarrollo local)
VITE_EMAILJS_SERVICE_ID=service_fbu6meg
VITE_EMAILJS_TEMPLATE_ID=template_cineuleam
VITE_EMAILJS_PUBLIC_KEY=sgK2GE1Ny08WUbBBL

# Supabase (si no las tienes)
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key
```

⚠️ **IMPORTANTE**: El archivo `.env` ya debería estar en `.gitignore` para no subir las variables al repositorio.

### ✅ Verificación de Configuración

Después de configurar, verifica que todo funcione:

1. **Deploy exitoso** - Sin errores de build
2. **Console logs** - Revisa la consola del navegador
3. **Test email** - Haz una reserva de prueba
4. **Variables cargadas** - Verifica en DevTools que las variables se carguen

### 📧 Estado del Sistema

Una vez configurado correctamente:

- ✅ **Reservas**: Se crean normalmente
- ✅ **QR Codes**: Se generan automáticamente
- ✅ **Emails**: Se envían automáticamente
- ✅ **Variables**: Seguras y configuradas
- ✅ **Producción**: Listo para uso real

### 🐛 Troubleshooting

Si algo no funciona:

1. **Variables mal configuradas**: Verifica nombres exactos
2. **Template no existe**: Confirma que creaste `template_cineuleam`
3. **Service ID incorrecto**: Verifica en dashboard EmailJS
4. **Cache de Netlify**: Haz un redeploy limpio

---

**🎯 Resultado Final**: Sistema de emails completamente automatizado y seguro en producción con Netlify.
