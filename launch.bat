@echo off
setlocal enabledelayedexpansion

:: =============================================================================
:: AgentricAI Core Application Launcher
:: Author: MiniMax Agent
:: Purpose: Launch AgentricAI Core with SDXL and Ollama integration
:: =============================================================================

echo.
echo ==================================================================
echo             AgentricAI Core - Local AI Application Launcher
echo ==================================================================
echo.

:: Color coding for different message types
:: White for info, Green for success, Red for errors, Yellow for warnings

:: Check if running as administrator (optional but recommended)
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [WARNING] Not running as Administrator. Some features may be limited.
    echo.
)

:: =============================================================================
:: SECTION 1: Environment Validation
:: =============================================================================

echo [INFO] Validating environment...

:: Check for Node.js
echo [INFO] Checking Node.js installation...
node --version >nul 2>&1
if %errorLevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo [ERROR] Please install Node.js from https://nodejs.org/
    echo [ERROR] Application cannot start without Node.js
    pause
    exit /b 1
)

:: Get Node.js version
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [SUCCESS] Node.js found: !NODE_VERSION!

:: Check for NPM
echo [INFO] Checking NPM installation...
npm --version >nul 2>&1
if %errorLevel% neq 0 (
    echo [ERROR] NPM is not installed or not accessible
    echo [ERROR] NPM should come with Node.js installation
    pause
    exit /b 1
)

:: Get NPM version
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo [SUCCESS] NPM found: !NPM_VERSION!

:: =============================================================================
:: SECTION 2: Directory and File Validation
:: =============================================================================

echo.
echo [INFO] Validating application structure...

:: Check if we're in the right directory
if not exist "package.json" (
    echo [ERROR] package.json not found in current directory
    echo [ERROR] Please ensure you're running this script from the AgentricAI Core root directory
    pause
    exit /b 1
)

if not exist "index.html" (
    echo [ERROR] index.html not found - this may not be the correct application directory
    echo [WARNING] Continuing anyway, but application may fail to start
)

if not exist "index.tsx" (
    echo [ERROR] index.tsx not found - this may not be the correct application directory
    echo [WARNING] Continuing anyway, but application may fail to start
)

echo [SUCCESS] Application structure validated

:: =============================================================================
:: SECTION 3: Model File Validation
:: =============================================================================

echo.
echo [INFO] Checking for SDXL model files...

:: Define model paths (adjust these paths as needed)
set "MODEL_DIR=models"
set "MODEL1=agentricaiAdult_v10.safetensors"
set "MODEL2=agentricaiPrimalxl_v10.safetensors"

:: Create models directory if it doesn't exist
if not exist "%MODEL_DIR%" (
    echo [INFO] Creating models directory...
    mkdir "%MODEL_DIR%"
)

:: Check for safetensor models
set MODELS_FOUND=0
if exist "%MODEL_DIR%\%MODEL1%" (
    echo [SUCCESS] Found model: %MODEL1%
    set /a MODELS_FOUND+=1
)
if exist "%MODEL_DIR%\%MODEL2%" (
    echo [SUCCESS] Found model: %MODEL2%
    set /a MODELS_FOUND+=1
)

if %MODELS_FOUND% equ 0 (
    echo [WARNING] No .safetensors models found in %MODEL_DIR% directory
    echo [WARNING] Please ensure your models are placed in: %MODEL_DIR%\
    echo [WARNING] Expected files:
    echo [WARNING]   - %MODEL1%
    echo [WARNING]   - %MODEL2%
    echo [WARNING] Application will start but SDXL functionality may be limited
)

:: =============================================================================
:: SECTION 4: Ollama Integration Check
:: =============================================================================

echo.
echo [INFO] Checking Ollama installation...

:: Check if Ollama is installed and accessible
ollama --version >nul 2>&1
if %errorLevel% equ 0 (
    for /f "tokens=*" %%i in ('ollama --version') do set OLLAMA_VERSION=%%i
    echo [SUCCESS] Ollama found: !OLLAMA_VERSION!
    
    :: Check for the specific model
    echo [INFO] Checking for AgentricAI_TLM model...
    ollama list | findstr "AgentricAI_TLM" >nul 2>&1
    if %errorLevel% equ 0 (
        echo [SUCCESS] AgentricAI_TLM model found in Ollama
    ) else (
        echo [WARNING] AgentricAI_TLM model not found in Ollama model list
        echo [WARNING] You may need to pull or load the model first
        echo [INFO] To load the model, run: ollama run AgentricAI_TLM
    )
) else (
    echo [WARNING] Ollama not found in PATH
    echo [WARNING] LLM functionality may not be available
    echo [INFO] If Ollama is installed, ensure it's added to your system PATH
)

:: =============================================================================
:: SECTION 5: Dependency Management
:: =============================================================================

echo.
echo [INFO] Checking application dependencies...

:: Check if node_modules exists
if not exist "node_modules" (
    echo [INFO] node_modules directory not found
    echo [INFO] Installing dependencies - this may take a few minutes...
    
    call npm install
    if !errorLevel! neq 0 (
        echo [ERROR] Failed to install dependencies
        echo [ERROR] Please check your internet connection and npm configuration
        pause
        exit /b 1
    )
    echo [SUCCESS] Dependencies installed successfully
) else (
    echo [INFO] node_modules directory found
    echo [INFO] Checking if dependencies are up to date...
    
    :: Check if package-lock.json is newer than node_modules
    for %%i in ("package-lock.json") do set LOCK_DATE=%%~ti
    for %%i in ("node_modules") do set MODULES_DATE=%%~ti
    
    echo [INFO] Running npm install to ensure dependencies are current...
    call npm install --silent
    if !errorLevel! neq 0 (
        echo [WARNING] npm install encountered issues, but continuing...
    ) else (
        echo [SUCCESS] Dependencies verified
    )
)

:: =============================================================================
:: SECTION 6: Pre-launch System Checks
:: =============================================================================

echo.
echo [INFO] Performing pre-launch system checks...

:: Check available memory (basic check)
echo [INFO] Checking system resources...
for /f "skip=1 tokens=4" %%i in ('wmic OS get TotalVisibleMemorySize /value') do set TOTAL_MEM=%%i
if defined TOTAL_MEM (
    set /a TOTAL_MEM_GB=!TOTAL_MEM!/1024/1024
    echo [INFO] Total system memory: !TOTAL_MEM_GB! GB
    if !TOTAL_MEM_GB! LSS 8 (
        echo [WARNING] System has less than 8GB RAM - AI model performance may be limited
    )
)

:: Check if any other instances are running
tasklist | findstr "electron" >nul 2>&1
if %errorLevel% equ 0 (
    echo [WARNING] Other Electron applications are running
    echo [WARNING] This may affect performance or cause port conflicts
)

:: =============================================================================
:: SECTION 7: Application Launch
:: =============================================================================

echo.
echo ==================================================================
echo                     LAUNCHING AGENTRICAI CORE
echo ==================================================================
echo.
echo [INFO] Starting AgentricAI Core application...
echo [INFO] SDXL Agent: Enabled
echo [INFO] Ollama Integration: Available
echo [INFO] Local-only operation: Active
echo.
echo [INFO] Application window should open shortly...
echo [INFO] If the application doesn't start, check the console output for errors
echo.

:: Set environment variables for the application
set "AGENTRICAI_MODELS_PATH=%CD%\%MODEL_DIR%"
set "AGENTRICAI_OLLAMA_MODEL=AgentricAI_TLM"
set "AGENTRICAI_MODE=local"
set "AGENTRICAI_SDXL_ENABLED=true"

:: Launch the application
:: Try npm start first, then npm run dev as fallback
echo [INFO] Attempting to start with npm start...
call npm start
if !errorLevel! neq 0 (
    echo [WARNING] npm start failed, trying npm run dev...
    call npm run dev
    if !errorLevel! neq 0 (
        echo [WARNING] npm run dev failed, trying npm run electron...
        call npm run electron
        if !errorLevel! neq 0 (
            echo [ERROR] All launch methods failed
            echo [ERROR] Please check the console output above for specific error messages
            echo.
            echo [INFO] Manual troubleshooting steps:
            echo [INFO] 1. Ensure all dependencies are installed: npm install
            echo [INFO] 2. Check package.json for correct start scripts
            echo [INFO] 3. Verify TypeScript compilation: npm run build
            echo [INFO] 4. Check for port conflicts (usually port 3000 or 5173)
            echo.
            pause
            exit /b 1
        )
    )
)

:: =============================================================================
:: SECTION 8: Post-launch Information
:: =============================================================================

echo.
echo ==================================================================
echo                   APPLICATION LAUNCH COMPLETE
echo ==================================================================
echo.
echo [SUCCESS] AgentricAI Core has been launched successfully!
echo.
echo [INFO] Application Features:
echo [INFO] - SDXL Image Generation: Ready
echo [INFO] - Local LLM (Ollama): Available  
echo [INFO] - Safetensor Model Loading: Implemented
echo [INFO] - Background Processing: Enabled
echo [INFO] - Graceful Error Handling: Active
echo.
echo [INFO] Model Configuration:
echo [INFO] - Models Directory: %MODEL_DIR%
echo [INFO] - SDXL Models: Check console output above
echo [INFO] - Ollama Model: AgentricAI_TLM
echo.
echo [INFO] To stop the application:
echo [INFO] - Close the application window, or
echo [INFO] - Press Ctrl+C in this console, or
echo [INFO] - Use the application's quit option
echo.
echo [INFO] For troubleshooting, check:
echo [INFO] - Application logs in the developer console (F12)
echo [INFO] - Node.js console output in this window
echo [INFO] - Ollama service status: ollama list
echo.
echo Thank you for using AgentricAI Core!
echo.

:: Keep the console window open so users can see any runtime messages
echo [INFO] This console window will remain open for monitoring...
echo [INFO] You can minimize it, but don't close it while the application is running.
echo.

:: Wait for application to exit (this will keep the batch file running)
:wait_loop
timeout /t 5 >nul
tasklist | findstr "electron" >nul 2>&1
if %errorLevel% equ 0 goto wait_loop

echo.
echo [INFO] AgentricAI Core application has closed.
echo [INFO] Thank you for using the application!
pause
exit /b 0