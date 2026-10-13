using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace CrapCart.Middleware;

public class ExceptionMiddleware : IMiddleware
{
    private readonly IHostEnvironment env;
    private readonly ILogger<ExceptionMiddleware> logger;

    public ExceptionMiddleware(IHostEnvironment env, ILogger<ExceptionMiddleware> logger)
    {
        this.env = env;
        this.logger = logger;
    }

    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception ex)
    {
        logger.LogError(ex, ex.Message);

        context.Response.ContentType = "application/json";

        context.Response.StatusCode = (int)System.Net.HttpStatusCode.InternalServerError;

        var response = new ProblemDetails
        {
            Title = ex.Message,
            Status = 500,
            Detail = env.IsDevelopment() ? ex.StackTrace?.ToString() : null
        };

        var options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        var json = JsonSerializer.Serialize(response, options);

        await context.Response.WriteAsync(json);
    }
}