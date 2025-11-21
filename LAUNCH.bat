@echo off
title FoodBridge - Server Launcher
color 0A

echo.
echo ========================================
echo        FOODBRIDGE SERVER LAUNCHER
echo ========================================
echo.
echo Starting server and opening browser...
echo.
echo Server: http://localhost:4000
echo Login: http://localhost:4000/login.html
echo.
echo ========================================
echo.

REM Start server in new window
start "FoodBridge Server" cmd /k "npm start"

REM Wait 4 seconds for server to start
echo Waiting for server to start...
timeout /t 4 /nobreak >nul

REM Open browser
echo Opening browser...
start "" "http://localhost:4000/login.html"

echo.
echo ========================================
echo   Server is running!
echo   Browser should be open now.
echo ========================================
echo.
echo To stop server: Close the "FoodBridge Server" window
echo.
pause

