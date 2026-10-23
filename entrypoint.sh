#!/bin/sh
set -e

export ASPNETCORE_ENVIRONMENT=Production
export DOTNET_gcServer=0

echo "Starting microservices in background..."

cd /app/catalog
dotnet Catalog.API.dll --urls "http://127.0.0.1:5001" &

cd /app/basket
dotnet Basket.API.dll --urls "http://127.0.0.1:5003" &

cd /app/identity
dotnet Identity.API.dll --urls "http://127.0.0.1:5051" &

cd /app/ordering
dotnet Ordering.API.dll --urls "http://127.0.0.1:5268" &

cd /app/payments
dotnet Payments.API.dll --urls "http://127.0.0.1:5025" &

echo "Waiting for microservices to initialize..."
sleep 3

PORT="${PORT:-8080}"
echo "Starting Gateway.API on port $PORT..."
cd /app/gateway
exec dotnet Gateway.API.dll --urls "http://0.0.0.0:${PORT}"
