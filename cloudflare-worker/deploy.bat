@echo off
echo ========================================
echo  Cloudflare Worker Deployment Script
echo ========================================
echo.

REM Verificar si wrangler está instalado
where wrangler >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Wrangler no esta instalado.
    echo Instalando Wrangler globalmente...
    call npm install -g wrangler
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Fallo al instalar Wrangler
        pause
        exit /b 1
    )
)

echo [OK] Wrangler instalado
echo.

REM Verificar si el usuario está autenticado
echo Verificando autenticacion con Cloudflare...
call wrangler whoami >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo No estas autenticado. Abriendo navegador para login...
    call wrangler login
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Fallo en la autenticacion
        pause
        exit /b 1
    )
)

echo [OK] Autenticado con Cloudflare
echo.

REM Desplegar el worker
echo Desplegando worker a Cloudflare...
call wrangler deploy
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Fallo al desplegar el worker
    pause
    exit /b 1
)

echo.
echo ========================================
echo  DESPLEGADO EXITOSAMENTE!
echo ========================================
echo.
echo IMPORTANTE: Ahora debes configurar la API key
echo.
echo Ejecuta este comando para configurarla de forma segura:
echo.
echo   wrangler secret put GEMINI_API_KEY
echo.
echo Cuando te lo pida, pega tu API key de Gemini.
echo.
echo Luego copia la URL del worker que aparece arriba
echo y actualizala en el archivo .env.local del proyecto:
echo.
echo   VITE_WORKER_URL=TU_URL_DEL_WORKER
echo.

pause
