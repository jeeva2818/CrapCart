using Catalog.API.Data;
using Catalog.API.Helpers;
using Catalog.API.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddScoped<ImageService>();

builder.Services.Configure<CloudinarySettings>(
    builder.Configuration.GetSection("Cloudinary"));

builder.Services.AddAutoMapper(cfg =>
{
    cfg.AddProfile<MappingProfiles>();
});

builder.Services.AddDbContext<CatalogContext>(options =>
{
    options.UseSqlite(
        builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy.AllowAnyHeader()
            .AllowAnyMethod()
            .WithOrigins("https://localhost:3000", "https://localhost:7000")
            .AllowCredentials();
    });
});

var app = builder.Build();

app.UseCors("CorsPolicy");

app.MapControllers();

await DbInitializer.InitDb(app);

app.Run();
