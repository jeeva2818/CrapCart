
using CrapCart.Data;
using Microsoft.EntityFrameworkCore;
using CrapCart.Middleware;
using CrapCart.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using CrapCart.Helpers;
using CrapCart.RequestHelpers;
using CrapCart.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddIdentityApiEndpoints<User>(options =>
    {
        options.User.RequireUniqueEmail = true;
    })
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<StoreContext>();

builder.Services.AddControllers();

builder.Services.AddScoped<ImageService>();

builder.Services.AddScoped<DiscountService>();

builder.Services.Configure<CloudinarySettings>(
    builder.Configuration.GetSection("Cloudinary"));

builder.Services.AddAutoMapper(cfg =>
{
    cfg.AddProfile<MappingProfiles>();
});

builder.Services.AddTransient<ExceptionMiddleware>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy
            .AllowAnyHeader()
            .AllowAnyMethod()
            .WithOrigins("https://localhost:3000")
            .AllowCredentials();
    });
});

builder.Services.AddDbContext<StoreContext>(options =>
{
    options.UseSqlite(
        builder.Configuration.GetConnectionString("DefaultConnection"));
});

var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();

app.UseCors("CorsPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapGroup("/api").MapIdentityApi<User>();
app.MapControllers();

await DbInitializer.InitDb(app);

app.Run();

