# Etapa de construcción del backend
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS backend-build
WORKDIR /app
COPY ["CyberMercadillo.csproj", "./"]
RUN dotnet restore "CyberMercadillo.csproj"
COPY . .
RUN dotnet build -c Release -o /app/build

# Etapa de publicación del backend
FROM backend-build AS backend-publish
RUN dotnet publish -c Release -o /app/publish

# Etapa de ejecución del backend
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS backend-runtime
WORKDIR /app
COPY --from=backend-publish /app/publish .
EXPOSE 5169
CMD ["dotnet", "CyberMercadillo.dll"]
