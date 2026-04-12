# 🚀 Guía de Deployment en Vercel - LindasGT.com

## Requisitos Previos

- Cuenta en [Vercel](https://vercel.com)
- Repositorio GitHub en [Fgarache/pageModelos](https://github.com/Fgarache/pageModelos)
- Git configurado localmente

## Pasos para Desplegar en Vercel

### 1. Conectar Repositorio a Vercel

1. Accede a [vercel.com/new](https://vercel.com/new)
2. Selecciona **"Import Git Repository"**
3. Conecta tu cuenta de GitHub
4. Selecciona el repositorio `pageModelos`
5. Haz clic en **"Import"**

### 2. Configurar Variables de Entorno

En la pantalla de configuración de Vercel, agrega las variables de entorno:

```
VITE_FIREBASE_DB_URL=https://sitemodelgt-default-rtdb.firebaseio.com
VITE_FIREBASE_API_KEY=(opcional)
VITE_FIREBASE_AUTH_DOMAIN=(opcional)
VITE_FIREBASE_PROJECT_ID=(opcional)
```

**Nota:** Solo `VITE_FIREBASE_DB_URL` es requerida para lectura pública de datos.

### 3. Configuración Automática

Vercel automáticamente:
- ✅ Detecta Vite como framework
- ✅ Ejecuta `npm run build` (definido en `vercel.json`)
- ✅ Sirve los archivos desde `/dist`
- ✅ Redirige rutas a `index.html` para React Router

### 4. Iniciar Deployment

1. Haz clic en **"Deploy"**
2. Vercel construirá y deployará automáticamente
3. Obtén tu URL de producción (ej: `https://lindas-gt.vercel.app`)

### 5. Configurar Dominio Personalizado (Opcional)

Para usar tu dominio personalizado (ej: `lindasgt.com`):

1. En el dashboard de Vercel, ve a **"Settings"** → **"Domains"**
2. Agrega tu dominio personalizado
3. Vercel te dará instrucciones de DNS
4. Actualiza los registros DNS en tu proveedor de dominio
5. Vercel generará certificado SSL automáticamente

## Variables de Entorno Requeridas

| Variable | Valor | Requerida |
|----------|-------|-----------|
| `VITE_FIREBASE_DB_URL` | URL de la base de datos realtime | ✅ Sí |
| `VITE_FIREBASE_API_KEY` | API Key de Firebase | ❌ No |
| `VITE_FIREBASE_AUTH_DOMAIN` | Auth domain | ❌ No |
| `VITE_FIREBASE_PROJECT_ID` | ID del proyecto | ❌ No |

## Configuración de Seguridad

La configuración de `vercel.json` incluye:

- **X-Content-Type-Options**: Previene MIME-sniffing
- **X-Frame-Options**: Protege contra clickjacking
- **Referrer-Policy**: Controla información del referrer
- **X-XSS-Protection**: Protección contra XSS
- **Cache-Control**: Assets estáticos cacheados por 1 año

## Deployments Automáticos

Cada vez que hagas push a `main`:

1. GitHub notifica a Vercel
2. Vercel automáticamente construye la aplicación
3. Si el build tiene éxito, se despliega automáticamente
4. Si falla, recibes notificación de error

## Monitoreo

- **Analytics**: Vercel proporciona analytics automático
- **Speed Insights**: Ve el rendimiento en tiempo real
- **Web Vitals**: Monitorea Core Web Vitals

## Rollback

Si algo falla en producción:

1. En Vercel Dashboard → **"Deployments"**
2. Selecciona el deployment anterior que funcionaba
3. Haz clic en **"Promote to Production"**

## Logs en Tiempo Real

Para ver logs de tu deployment en vivo:

```bash
vercel logs --prod
```

## Firebase Rules ⚠️ IMPORTANTE

Antes de ir a producción:

1. Configura **Firebase Realtime Database Rules** en Firebase Console
2. Limita escrituras solo a usuarios autenticados
3. Asegura que solo datos públicos sean legibles

Ejemplo de reglas básicas (en Firebase Console):

```json
{
  "rules": {
    ".read": true,
    ".write": false
  }
}
```

## Troubleshooting

### El sitio muestra 404 en rutas dinámicas

✅ **Solución**: Ya está configurado con rewrites en `vercel.json`

### Variables de entorno no funcionen

1. Verifica que estén definidas en Vercel Dashboard
2. Redeploy después de cambiar variables
3. Verifica que usen prefijo `VITE_` (obligatorio en Vite)

### Build falla en Vercel pero funciona localmente

1. Verifica que `npm run build` funciona localmente: `npm run build`
2. Asegura que todos los archivos estén en git: `git status`
3. Revisa logs en Vercel Dashboard → **"Deployments"** → **"Build Logs"**

---

**LinedasGT.com** está listo para producción en Vercel ✅
