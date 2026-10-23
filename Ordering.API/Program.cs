using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Ordering.API.Data;
using Ordering.API.Services;

var builder = WebApplication.CreateBuilder(args);

// Register controllers and OpenAPI.
builder.Services.AddControllers();
builder.Services.AddOpenApi();

// Register the Ordering database.
builder.Services.AddDbContext<OrderContext>(options =>
{
    options.UseSqlite(
        builder.Configuration.GetConnectionString("OrderingConnection"));
    options.ConfigureWarnings(w =>
        w.Ignore(RelationalEventId.PendingModelChangesWarning));
});

// Register an HTTP client for Basket.API.
builder.Services.AddHttpClient("Basket", client =>
{
    client.BaseAddress = new Uri(
        builder.Configuration["Services:Basket"]!);
})
.ConfigurePrimaryHttpMessageHandler(() => new HttpClientHandler
{
    ServerCertificateCustomValidationCallback =
        HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
});

// Register application services.
builder.Services.AddScoped<BasketService>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<OrderContext>();
    await db.Database.MigrateAsync();

    string[] alterStatements =
    [
        "ALTER TABLE Orders ADD COLUMN Discount TEXT NOT NULL DEFAULT '0';",
        "ALTER TABLE Orders ADD COLUMN PaymentIntentId TEXT NULL;",
        "ALTER TABLE Orders ADD COLUMN PaymentSummary_Last4 TEXT NOT NULL DEFAULT '';",
        "ALTER TABLE Orders ADD COLUMN PaymentSummary_Brand TEXT NOT NULL DEFAULT '';",
        "ALTER TABLE Orders ADD COLUMN PaymentSummary_ExpMonth INTEGER NOT NULL DEFAULT 0;",
        "ALTER TABLE Orders ADD COLUMN PaymentSummary_ExpYear INTEGER NOT NULL DEFAULT 0;",
        "ALTER TABLE Orders ADD COLUMN ReturnReason TEXT NULL;",
        "ALTER TABLE Orders ADD COLUMN ReturnComments TEXT NULL;",
        "ALTER TABLE Orders ADD COLUMN ReturnedAt TEXT NULL;"
    ];

    foreach (var sql in alterStatements)
    {
        try
        {
            await db.Database.ExecuteSqlRawAsync(sql);
        }
        catch
        {
            // Column already exists
        }
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseHttpsRedirection();
}

app.MapControllers();

app.Run();
