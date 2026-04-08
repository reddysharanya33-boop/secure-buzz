@echo off
REM SecureBuzz Quick Start Script for Windows

echo.
echo =====================================
echo   SecureBuzz - MongoDB Setup
echo =====================================
echo.

REM Check if npm is installed
where npm >nul 2>nul
if errorlevel 1 (
    echo ERROR: npm is not installed. Please install Node.js first.
    echo Visit: https://nodejs.org/
    pause
    exit /b 1
)

echo [1/3] Checking MongoDB connection...
REM Try to connect to MongoDB
mongosh --eval "db.version()" >nul 2>nul
if errorlevel 1 (
    echo WARNING: MongoDB might not be running.
    echo Please ensure MongoDB is installed and running.
    echo.
    echo Start MongoDB manually or check Services.
    pause
)

echo [2/3] Installing npm dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [3/3] Starting SecureBuzz server...
echo.
echo Server will start on: http://localhost:5000
echo.
call npm start

pause
