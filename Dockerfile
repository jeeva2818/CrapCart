# Stage 1: Build & Publish all Microservices and Gateway
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /source

# Copy project files for caching restores
COPY Catalog.API/*.csproj Catalog.API/
COPY Basket.API/*.csproj Basket.API/
COPY Identity.API/*.csproj Identity.API/
COPY Ordering.API/*.csproj Ordering.API/
COPY Payments.API/*.csproj Payments.API/
COPY Gateway.API/*.csproj Gateway.API/

RUN dotnet restore Catalog.API/Catalog.API.csproj
RUN dotnet restore Basket.API/Basket.API.csproj
RUN dotnet restore Identity.API/Identity.API.csproj
RUN dotnet restore Ordering.API/Ordering.API.csproj
RUN dotnet restore Payments.API/Payments.API.csproj
RUN dotnet restore Gateway.API/Gateway.API.csproj

# Copy all source code
COPY . .

# Publish each service
RUN dotnet publish Catalog.API/Catalog.API.csproj -c Release -o /app/catalog --no-restore
RUN dotnet publish Basket.API/Basket.API.csproj -c Release -o /app/basket --no-restore
RUN dotnet publish Identity.API/Identity.API.csproj -c Release -o /app/identity --no-restore
RUN dotnet publish Ordering.API/Ordering.API.csproj -c Release -o /app/ordering --no-restore
RUN dotnet publish Payments.API/Payments.API.csproj -c Release -o /app/payments --no-restore
RUN dotnet publish Gateway.API/Gateway.API.csproj -c Release -o /app/gateway --no-restore

# Stage 2: Runtime image containing all services
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

COPY --from=build /app/catalog /app/catalog
COPY --from=build /app/basket /app/basket
COPY --from=build /app/identity /app/identity
COPY --from=build /app/ordering /app/ordering
COPY --from=build /app/payments /app/payments
COPY --from=build /app/gateway /app/gateway

COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["/app/entrypoint.sh"]
