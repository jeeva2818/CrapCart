using Basket.API.Data;
using Basket.API.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddDbContext<BasketContext>(options =>
{
    var connectionString =
        builder.Configuration.GetConnectionString("DefaultConnection");

    options.UseSqlite(connectionString);
    options.ConfigureWarnings(w =>
        w.Ignore(RelationalEventId.PendingModelChangesWarning));
});

var catalogServiceUrl =
    builder.Configuration["CatalogServiceUrl"]
    ?? throw new InvalidOperationException(
        "CatalogServiceUrl is missing from configuration.");

builder.Services.AddHttpClient<CatalogService>(client =>
{
    client.BaseAddress = new Uri(
        $"{catalogServiceUrl.TrimEnd('/')}/");
})
.ConfigurePrimaryHttpMessageHandler(() => new HttpClientHandler
{
    ServerCertificateCustomValidationCallback =
        HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
});

builder.Services.AddScoped<DiscountService>();

builder.Services.AddOpenApi();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<BasketContext>();
    await db.Database.MigrateAsync();

    try
    {
        await db.Database.ExecuteSqlRawAsync(
            "ALTER TABLE Baskets ADD COLUMN ClientSecret TEXT NULL;");
    }
    catch
    {
        // Column already exists
    }

    try
    {
        await db.Database.ExecuteSqlRawAsync(
            "ALTER TABLE Baskets ADD COLUMN PaymentIntentId TEXT NULL;");
    }
    catch
    {
        // Column already exists
    }
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseHttpsRedirection();
}

app.UseAuthorization();
app.MapControllers();

app.Run();
