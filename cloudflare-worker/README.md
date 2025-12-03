# 🔐 Cloudflare Worker - Gemini API Proxy

Este worker actúa como un proxy seguro entre tu frontend y la API de Gemini, manteniendo tu API key completamente segura.

## 📋 Requisitos Previos

1. Una cuenta de Cloudflare (gratuita): https://dash.cloudflare.com/sign-up
2. Node.js instalado (v16 o superior)
3. Tu API key de Gemini

## 🚀 Configuración (Solo 5 minutos)

### Paso 1: Instalar Wrangler (CLI de Cloudflare)

```bash
npm install -g wrangler
```

### Paso 2: Autenticarte con Cloudflare

```bash
wrangler login
```

Esto abrirá tu navegador para autorizar Wrangler con tu cuenta de Cloudflare.

### Paso 3: Configurar la API Key de Gemini (SEGURA)

Desde esta carpeta (`cloudflare-worker`), ejecuta:

```bash
wrangler secret put GEMINI_API_KEY
```

Cuando te lo pida, pega tu API key de Gemini y presiona Enter. **Esta clave se almacenará de forma segura en Cloudflare y NUNCA estará expuesta en tu código.**

### Paso 4: (Opcional) Configurar System Instruction personalizada

Si quieres personalizar el comportamiento del chatbot:

```bash
wrangler secret put SYSTEM_INSTRUCTION
```

Pega la instrucción del sistema y presiona Enter.

### Paso 5: Desplegar el Worker

```bash
wrangler deploy
```

¡Listo! Tu worker estará desplegado. Wrangler te dará una URL como:
```
https://leandro-portfolio-gemini-proxy.TU-SUBDOMAIN.workers.dev
```

**Copia esta URL**, la necesitarás para el frontend.

## 🔄 Actualizar el Frontend

Una vez desplegado el worker, necesitas actualizar tu frontend para que use esta URL en lugar de llamar directamente a Gemini.

La URL del worker será algo como:
```
https://leandro-portfolio-gemini-proxy.TU-SUBDOMAIN.workers.dev
```

## 🔒 Seguridad

### ✅ Lo que ESTÁ protegido:
- Tu API key de Gemini (almacenada como secret en Cloudflare)
- Las llamadas a Gemini (se hacen desde el worker, no desde el navegador)

### ⚠️ Próximos pasos de seguridad (Opcional):

1. **Restringir CORS**: En `worker.js`, cambia:
   ```javascript
   'Access-Control-Allow-Origin': '*'
   ```
   Por:
   ```javascript
   'Access-Control-Allow-Origin': 'https://leandroalvarez.com.ar'
   ```

2. **Rate Limiting**: Considera agregar rate limiting para evitar abuso.

## 📊 Monitoreo

Puedes ver las estadísticas de uso en tu dashboard de Cloudflare:
https://dash.cloudflare.com/

## 🛠️ Comandos Útiles

```bash
# Ver logs en tiempo real
wrangler tail

# Actualizar el worker después de cambios
wrangler deploy

# Ver/actualizar secrets
wrangler secret list
wrangler secret put GEMINI_API_KEY

# Eliminar el worker
wrangler delete
```

## 💰 Costos

Plan gratuito de Cloudflare Workers:
- ✅ 100,000 requests/día
- ✅ Sin costo adicional
- ✅ Suficiente para un portfolio personal

## 🆘 Troubleshooting

### Error: "Wrangler command not found"
```bash
npm install -g wrangler
```

### Error: "Not authenticated"
```bash
wrangler login
```

### El worker no responde
1. Verifica que la API key esté configurada: `wrangler secret list`
2. Verifica los logs: `wrangler tail`
3. Asegúrate de haber desplegado: `wrangler deploy`

## 📞 Soporte

Si tienes problemas, revisa la documentación oficial:
https://developers.cloudflare.com/workers/
