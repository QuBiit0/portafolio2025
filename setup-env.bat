@echo off
echo ========================================
echo  Configurar URL del Worker
echo ========================================
echo.

set /p WORKER_URL="Pega aqui la URL de tu Cloudflare Worker: "

echo VITE_WORKER_URL=%WORKER_URL% > .env.local

echo.
echo [OK] Archivo .env.local creado exitosamente!
echo.
echo Contenido:
type .env.local
echo.
echo.
echo Ahora puedes ejecutar:
echo   npm install
echo   npm run dev
echo.

pause
