using Payments.API.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddHttpClient("Basket", client =>
{
    var basketUrl = builder.Configuration["Services:Basket"]
        ?? "https://localhost:5003";
    client.BaseAddress = new Uri($"{basketUrl.TrimEnd('/')}/");
})
.ConfigurePrimaryHttpMessageHandler(() => new HttpClientHandler
{
    ServerCertificateCustomValidationCallback =
        HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
});

builder.Services.AddHttpClient("Ordering", client =>
{
    var orderingUrl = builder.Configuration["Services:Ordering"]
        ?? "http://localhost:5268";
    client.BaseAddress = new Uri($"{orderingUrl.TrimEnd('/')}/");
})
.ConfigurePrimaryHttpMessageHandler(() => new HttpClientHandler
{
    ServerCertificateCustomValidationCallback =
        HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
});

builder.Services.AddScoped<BasketClient>();
builder.Services.AddScoped<OrderingClient>();
builder.Services.AddScoped<PaymentService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseHttpsRedirection();
}

app.UseAuthorization();

app.MapControllers();

app.Run();
