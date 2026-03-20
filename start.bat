@echo off
title Brand Studio
echo.
echo   Brand Studio - Starting...
echo.

:: Check if node is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo   Node.js is not installed. Download it from https://nodejs.org
    echo.
    pause
    exit /b 1
)

:: Install dependencies if needed
if not exist node_modules (
    echo   Installing dependencies...
    npm install
    echo.
)

:: Copy .env if it doesn't exist
if not exist .env (
    copy .env.example .env >nul
    echo   Created .env file - add your API key and restart.
    echo   Opening .env for editing...
    notepad .env
    pause
    exit /b 0
)

:: Start server and open browser
echo   Starting server...
start "" http://localhost:3000
node server.js
