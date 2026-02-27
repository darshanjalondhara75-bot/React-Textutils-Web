@echo off
echo ===============================================
echo Starting TextUtils Development Server
echo ===============================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js is installed
node --version
echo.

REM Check if npm start works
echo Starting development server...
echo This will open your website at http://localhost:3000
echo.
echo Press Ctrl+C to stop the server when done.
echo.

npm start

echo.
echo Development server stopped.
pause