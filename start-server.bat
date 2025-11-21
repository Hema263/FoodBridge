@echo off
echo ========================================
echo   FoodBridge Server Starting...
echo ========================================
echo.
echo Server will run on: http://localhost:4000
echo.
echo Browser will open automatically in 3 seconds...
echo.
echo Press Ctrl+C to stop the server
echo.
echo ========================================
echo.

start "" "http://localhost:4000/login.html"

timeout /t 3 /nobreak >nul

npm start

pause
