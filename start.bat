@echo off
title Brand Studio
echo.
echo   =============================
echo    Brand Studio
echo   =============================
echo.

:: Check if node is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo   Node.js is not installed.
    echo   Download it from https://nodejs.org
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

:: Create .env and prompt for keys if missing
if not exist .env (
    echo   First-time setup - configure your API keys.
    echo   You only need ONE provider. Press Enter to skip any.
    echo   Keys are stored locally in .env and never leave your machine.
    echo.

    set /p ANTHROPIC_KEY="  Anthropic API key (https://console.anthropic.com/settings/keys): "
    set /p OPENAI_KEY="  OpenAI API key (https://platform.openai.com/api-keys): "
    set /p GEMINI_KEY="  Gemini API key (https://aistudio.google.com/apikey - free): "

    (
        echo ANTHROPIC_API_KEY=%ANTHROPIC_KEY%
        echo OPENAI_API_KEY=%OPENAI_KEY%
        echo GEMINI_API_KEY=%GEMINI_KEY%
        echo PORT=3000
    ) > .env

    echo.
    echo   .env created. You can edit it later in any text editor.
    echo.
)

:: Check if at least one key is set
findstr /r "API_KEY=." .env >nul 2>nul
if %errorlevel% neq 0 (
    echo   Warning: No API keys found in .env
    echo   Edit .env to add at least one provider key, then restart.
    echo.
    notepad .env
    pause
    exit /b 0
)

:: Start server and open browser
echo   Starting server...
echo   Opening http://localhost:3000
echo   Press Ctrl+C to stop.
echo.
start "" http://localhost:3000
node server.js
