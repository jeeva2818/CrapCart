using CrapCart.Data;
using Microsoft.EntityFrameworkCore;
using CrapCart.Middleware;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddTransient<ExceptionMiddleware>();

builder.Services.AddCors();

builder.Services.AddDbContext<StoreContext>(options =>
{
    options.UseSqlite(
        builder.Configuration.GetConnectionString("DefaultConnection"));
});

var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();

app.UseCors(opt =>
{
    opt.AllowAnyHeader();
    opt.AllowAnyMethod();
    opt.WithOrigins("https://localhost:3000");
});

// Configure the HTTP request pipeline.

app.MapControllers();

DbInitializer.InitDb(app);

app.Run();