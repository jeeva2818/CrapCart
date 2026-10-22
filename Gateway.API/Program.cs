var builder = WebApplication.CreateBuilder(args);

// Add YARP Reverse Proxy
builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

// Add CORS Policy for React Frontend (Localhost & Vercel)
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy.WithOrigins(
                "https://localhost:3000",
                "http://localhost:3000",
                "https://crapcart.vercel.app"
            )
            .SetIsOriginAllowed(origin => origin.EndsWith(".vercel.app") || origin.Contains("localhost"))
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
            .WithExposedHeaders("Pagination");
    });
});

var app = builder.Build();

app.UseCors("CorsPolicy");

app.MapReverseProxy();

app.Run();
