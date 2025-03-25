# Check API connectivity
Write-Host "Testing API connectivity..." -ForegroundColor Cyan
$apiUrl = "http://localhost:8080/documents"
try {
    $response = Invoke-WebRequest -Uri $apiUrl -Method HEAD -TimeoutSec 5 -ErrorAction Stop
    Write-Host "API connection successful! Status code: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "API connection failed: $_" -ForegroundColor Red
    Write-Host "Possible issues:" -ForegroundColor Yellow
    Write-Host "1. API server is not running" -ForegroundColor Yellow
    Write-Host "2. API server is running on a different port" -ForegroundColor Yellow
    Write-Host "3. Firewall blocking connection" -ForegroundColor Yellow
}

# Check CORS proxy settings
Write-Host "`nChecking CORS proxy settings..." -ForegroundColor Cyan
$envFile = Get-Content -Path "src/environments/environment.development.ts" -Raw
if ($envFile -match "apiUrlWithProxy") {
    Write-Host "CORS proxy URL found in environment file" -ForegroundColor Green
} else {
    Write-Host "CORS proxy URL not configured in environment file" -ForegroundColor Red
}

# Check Authentication
Write-Host "`nChecking authentication token..." -ForegroundColor Cyan
if (Test-Path -Path "localStorage.debugDump.json") {
    $localStorage = Get-Content -Path "localStorage.debugDump.json" -Raw | ConvertFrom-Json
    if ($localStorage.auth_token) {
        Write-Host "Authentication token found" -ForegroundColor Green
    } else {
        Write-Host "Authentication token not found" -ForegroundColor Red
    }
} else {
    Write-Host "Cannot check authentication token (localStorage dump not available)" -ForegroundColor Yellow
    Write-Host "To check token, run this in browser console:" -ForegroundColor Yellow
    Write-Host "console.log('Token:', localStorage.getItem('auth_token'))" -ForegroundColor Yellow
}

# Start diagnostic proxy 
Write-Host "`nWould you like to start a diagnostic CORS proxy? (y/n)" -ForegroundColor Cyan
$response = Read-Host
if ($response -eq "y") {
    Write-Host "Starting CORS proxy on port 8010..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-Command npx cors-proxy-server --port 8010 --proxy http://localhost:8080"
    Write-Host "CORS proxy started. Update your code to use http://localhost:8010/proxy instead of http://localhost:8080" -ForegroundColor Green
} 