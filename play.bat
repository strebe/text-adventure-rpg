@echo off
REM Simple script to run the RPG game on Windows
REM Make sure Node.js is installed on your system

echo Starting Game...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    echo Minimum version required: 18.0.0
    pause
    exit /b 1
)

REM Install dependencies if needed
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    echo.
)

REM Start the game
echo Launching game...
echo.
npm start

pause
