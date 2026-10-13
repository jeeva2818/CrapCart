# Launch all CrapCart Microservices & YARP API Gateway in separate PowerShell windows

$root = "d:\E-Commerse"

$services = @(
    @{ Name = "Catalog.API (:5001)";  Path = "$root\Catalog.API" },
    @{ Name = "Basket.API (:5003)";   Path = "$root\Basket.API" },
    @{ Name = "Identity.API (:5051)"; Path = "$root\Identity.API" },
    @{ Name = "Ordering.API (:5268)"; Path = "$root\Ordering.API" },
    @{ Name = "Payments.API (:5025)"; Path = "$root\Payments.API" },
    @{ Name = "Gateway.API (:7000)";  Path = "$root\Gateway.API" }
)

foreach ($svc in $services) {
    Write-Host "Starting $($svc.Name)..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit", "-Command", " `$Host.UI.RawUI.WindowTitle = '$($svc.Name)'; Set-Location '$($svc.Path)'; dotnet run"
}

Write-Host "`nAll microservices and Gateway.API launched!" -ForegroundColor Green
Write-Host "Gateway URL: https://localhost:7000" -ForegroundColor Yellow
Write-Host "To start the React frontend, run: cd d:\E-Commerse\client; npm run dev" -ForegroundColor Yellow
