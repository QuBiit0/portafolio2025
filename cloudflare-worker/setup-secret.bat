@echo off
echo ========================================
echo  Configurar API Key de Gemini
echo ========================================
echo.
echo Este script te ayudara a configurar la API key
echo de forma SEGURA en Cloudflare.
echo.
echo La clave se almacenara cifrada en Cloudflare
echo y NUNCA estara expuesta en tu codigo.
echo.

pause

echo.
echo Configurando GEMINI_API_KEY...
echo.
echo Cuando se te pida, pega tu API key de Gemini.
echo.

call wrangler secret put GEMINI_API_KEY

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo  API KEY CONFIGURADA EXITOSAMENTE!
    echo ========================================
    echo.
) else (
    echo.
    echo [ERROR] Fallo al configurar la API key
    echo.
)

pause
