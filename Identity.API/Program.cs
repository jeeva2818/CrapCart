using Identity.API.Data;
using Identity.API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddDbContext<IdentityContext>(options =>
{
    options.UseSqlite(
        builder.Configuration.GetConnectionString("IdentityConnection"));
    options.ConfigureWarnings(w =>
        w.Ignore(RelationalEventId.PendingModelChangesWarning));
});

builder.Services
    .AddIdentityApiEndpoints<User>(options =>
    {
        options.User.RequireUniqueEmail = false;

        options.Password.RequiredLength = 4;
        options.Password.RequireDigit = false;
        options.Password.RequireUppercase = false;
        options.Password.RequireLowercase = false;
        options.Password.RequireNonAlphanumeric = false;
    })
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<IdentityContext>();

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.SameSite = SameSiteMode.None;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapGroup("/api").MapIdentityApi<User>();
app.MapControllers();
await IdentityDbInitializer.InitializeAsync(app.Services);
app.Run();