@echo off
echo Starting On-Ground.ai Call Centre App...
echo.
echo [1/2] Starting backend server on port 3001...
start "On-Ground Backend" cmd /k "cd /d "%~dp0server" && node index.js"

echo [2/2] Starting frontend on port 5173...
start "On-Ground Frontend" cmd /k "cd /d "%~dp0" && npx vite"

echo.
echo Both servers are starting. Open http://localhost:5173 in your browser.
echo.
echo Backend: http://localhost:3001
echo Frontend: http://localhost:5173
pause
