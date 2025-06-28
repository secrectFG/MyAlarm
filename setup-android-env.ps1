# Android Development Environment Setup Script
# This script will automatically download and configure Android Studio, JDK and related tools

param(
    [switch]$SkipJDK = $false,
    [switch]$SkipAndroidStudio = $false,
    [switch]$Verbose = $false
)

# Set error handling
$ErrorActionPreference = "Stop"

# Color output functions
function Write-ColorOutput {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $Color
}

function Write-Step {
    param([string]$Message)
    Write-ColorOutput "🔧 $Message" "Cyan"
}

function Write-Success {
    param([string]$Message)
    Write-ColorOutput "✅ $Message" "Green"
}

function Write-Warning {
    param([string]$Message)
    Write-ColorOutput "⚠️  $Message" "Yellow"
}

function Write-Error {
    param([string]$Message)
    Write-ColorOutput "❌ $Message" "Red"
}

# Check administrator privileges
function Test-Administrator {
    $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

# Download file function
function Download-File {
    param(
        [string]$Url,
        [string]$OutputPath,
        [string]$Description
    )
    
    Write-Step "Downloading $Description..."
    try {
        # Use Invoke-WebRequest to download file
        $progressPreference = 'SilentlyContinue'
        Invoke-WebRequest -Uri $Url -OutFile $OutputPath -UseBasicParsing
        Write-Success "$Description download completed"
        return $true
    }
    catch {
        Write-Error "Failed to download $Description : $($_.Exception.Message)"
        return $false
    }
}

# Install Chocolatey (if not installed)
function Install-Chocolatey {
    if (Get-Command choco -ErrorAction SilentlyContinue) {
        Write-Success "Chocolatey is already installed"
        return $true
    }
    
    Write-Step "Installing Chocolatey package manager..."
    try {
        Set-ExecutionPolicy Bypass -Scope Process -Force
        [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
        Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
        Write-Success "Chocolatey installation completed"
        return $true
    }
    catch {
        Write-Error "Chocolatey installation failed: $($_.Exception.Message)"
        return $false
    }
}

# Install JDK 17
function Install-JDK {
    if ($SkipJDK) {
        Write-Warning "Skipping JDK installation"
        return $true
    }
    
    Write-Step "Checking JDK version..."
    
    # Check if appropriate JDK version is installed
    try {
        $javaVersion = & java -version 2>&1 | Select-String "version" | ForEach-Object { $_.ToString() }
        if ($javaVersion -match '"1[7-9]\.' -or $javaVersion -match '"2[0-9]\.') {
            Write-Success "Appropriate JDK version is installed: $javaVersion"
            return $true
        }
    }
    catch {
        Write-Warning "JDK not found or incompatible version"
    }
    
    Write-Step "Installing JDK 17 using Chocolatey..."
    try {
        & choco install openjdk17 -y
        Write-Success "JDK 17 installation completed"
        
        # Refresh environment variables
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
        
        return $true
    }
    catch {
        Write-Error "JDK 17 installation failed: $($_.Exception.Message)"
        return $false
    }
}

# Download and install Android Studio
function Install-AndroidStudio {
    if ($SkipAndroidStudio) {
        Write-Warning "Skipping Android Studio installation"
        return $true
    }
    
    Write-Step "Checking if Android Studio is installed..."
    
    $androidStudioPath = "${env:ProgramFiles}\Android\Android Studio\bin\studio64.exe"
    if (Test-Path $androidStudioPath) {
        Write-Success "Android Studio is installed at: $androidStudioPath"
        return $true
    }
    
    # Try installing using Chocolatey
    Write-Step "Installing Android Studio using Chocolatey..."
    try {
        & choco install androidstudio -y
        Write-Success "Android Studio installation completed"
        return $true
    }
    catch {
        Write-Warning "Chocolatey installation failed, trying manual download..."
    }
    
    # Manual download and install
    $downloadUrl = "https://redirector.gvt1.com/edgedl/android/studio/install/2023.1.1.28/android-studio-2023.1.1.28-windows.exe"
    $installerPath = "$env:TEMP\android-studio-installer.exe"
    
    if (Download-File -Url $downloadUrl -OutputPath $installerPath -Description "Android Studio") {
        Write-Step "Running Android Studio installer..."
        Write-Warning "Please follow the installation wizard to complete the installation, make sure to select Android SDK and Android Virtual Device components"
        
        try {
            Start-Process -FilePath $installerPath -Wait
            Write-Success "Android Studio installation completed"
            return $true
        }
        catch {
            Write-Error "Android Studio installation failed: $($_.Exception.Message)"
            return $false
        }
    }
    
    return $false
}

# Configure environment variables
function Set-AndroidEnvironment {
    Write-Step "Configuring Android environment variables..."
    
    $androidHome = "$env:LOCALAPPDATA\Android\Sdk"
    $androidHome2 = "$env:USERPROFILE\AppData\Local\Android\Sdk"
    
    # Check Android SDK path
    if (Test-Path $androidHome) {
        $sdkPath = $androidHome
    }
    elseif (Test-Path $androidHome2) {
        $sdkPath = $androidHome2
    }
    else {
        Write-Warning "Android SDK path not found, please start Android Studio and install SDK first"
        $sdkPath = $androidHome
    }
    
    Write-Step "Setting ANDROID_HOME environment variable..."
    [Environment]::SetEnvironmentVariable("ANDROID_HOME", $sdkPath, "User")
    $env:ANDROID_HOME = $sdkPath
    
    # Update PATH
    $pathsToAdd = @(
        "$sdkPath\platform-tools",
        "$sdkPath\tools",
        "$sdkPath\tools\bin"
    )
    
    $currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
    $newPath = $currentPath
    
    foreach ($pathToAdd in $pathsToAdd) {
        if ($newPath -notlike "*$pathToAdd*") {
            $newPath += ";$pathToAdd"
        }
    }
    
    [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
    
    Write-Success "Environment variables configuration completed"
}

# Create project gradle.properties file
function Create-GradleProperties {
    Write-Step "Creating gradle.properties file..."
    
    $gradlePropertiesPath = "android\gradle.properties"
    $gradlePropertiesContent = @"
# Project-wide Gradle settings.
android.useAndroidX=true
android.enableJetifier=true
android.enableR8=true
org.gradle.jvmargs=-Xmx2048m -XX:MaxMetaspaceSize=512m
org.gradle.daemon=true
org.gradle.parallel=true
org.gradle.configureondemand=true
"@
    
    if (!(Test-Path "android")) {
        New-Item -ItemType Directory -Path "android" -Force | Out-Null
    }
    
    Set-Content -Path $gradlePropertiesPath -Value $gradlePropertiesContent -Encoding UTF8
    Write-Success "gradle.properties file created successfully"
}

# Verify installation
function Test-Installation {
    Write-Step "Verifying installation..."
    
    # Check Java
    try {
        $javaVersion = & java -version 2>&1 | Select-String "version" | ForEach-Object { $_.ToString() }
        Write-Success "Java: $javaVersion"
    }
    catch {
        Write-Error "Java is not properly installed"
        return $false
    }
    
    # Check ADB
    try {
        $adbVersion = & adb version 2>&1 | Select-String "version" | ForEach-Object { $_.ToString() }
        Write-Success "ADB: $adbVersion"
    }
    catch {
        Write-Warning "ADB not found, may need to restart terminal or install Android SDK"
    }
    
    # Run React Native doctor
    Write-Step "Running React Native diagnostics..."
    try {
        & npx react-native doctor
    }
    catch {
        Write-Warning "React Native doctor failed to run, may need manual check"
    }
    
    return $true
}

# Main function
function Main {
    Write-ColorOutput "🚀 Android Development Environment Setup Script" "Magenta"
    Write-ColorOutput ("=" * 50) "Magenta"
    
    # Check administrator privileges
    if (!(Test-Administrator)) {
        Write-Warning "It is recommended to run this script as administrator to avoid permission issues"
        $continue = Read-Host "Do you want to continue? (y/N)"
        if ($continue -ne "y" -and $continue -ne "Y") {
            Write-Error "Script cancelled"
            return
        }
    }
    
    # Step 1: Install Chocolatey
    if (!(Install-Chocolatey)) {
        Write-Error "Chocolatey installation failed, script terminated"
        return
    }
    
    # Step 2: Install JDK
    if (!(Install-JDK)) {
        Write-Error "JDK installation failed, script terminated"
        return
    }
    
    # Step 3: Install Android Studio
    if (!(Install-AndroidStudio)) {
        Write-Error "Android Studio installation failed, script terminated"
        return
    }
    
    # Step 4: Configure environment variables
    Set-AndroidEnvironment
    
    # Step 5: Create configuration files
    Create-GradleProperties
    
    # Step 6: Verify installation
    Test-Installation
    
    Write-ColorOutput ("=" * 50) "Magenta"
    Write-Success "🎉 Android development environment configuration completed!"
    Write-ColorOutput "Please restart the terminal or run the following command to refresh environment variables:" "Yellow"
    Write-ColorOutput "refreshenv" "Cyan"
    Write-ColorOutput ""
    Write-ColorOutput "Next steps:" "Yellow"
    Write-ColorOutput "1. Start Android Studio" "White"
    Write-ColorOutput "2. Complete initial setup and install SDK" "White"
    Write-ColorOutput "3. Create Android Virtual Device (AVD)" "White"
    Write-ColorOutput "4. Run 'yarn android' to test the app" "White"
}

# Run main function
Main 