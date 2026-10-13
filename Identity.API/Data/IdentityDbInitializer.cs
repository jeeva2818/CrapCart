
using Identity.API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Identity.API.Data;

public static class IdentityDbInitializer
{
    public static async Task InitializeAsync(IServiceProvider services)
    {
        using var scope = services.CreateScope();

        var context = scope.ServiceProvider
            .GetRequiredService<IdentityContext>();

        var roleManager = scope.ServiceProvider
            .GetRequiredService<RoleManager<IdentityRole>>();

        var userManager = scope.ServiceProvider
            .GetRequiredService<UserManager<User>>();

        await context.Database.MigrateAsync();

        string[] roles = ["member", "admin"];

        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                var result = await roleManager.CreateAsync(
                    new IdentityRole(role));

                if (!result.Succeeded)
                {
                    throw new InvalidOperationException(
                        $"Failed to create role '{role}': " +
                        string.Join(", ", result.Errors.Select(x => x.Description)));
                }
            }
        }

        var bob = await userManager.FindByEmailAsync("bob@test.com");
        if (bob == null)
        {
            bob = new User
            {
                UserName = "bob@test.com",
                Email = "bob@test.com"
            };
            await userManager.CreateAsync(bob, "Pa$$W0rd");
        }
        if (!await userManager.IsInRoleAsync(bob, "member"))
        {
            await userManager.AddToRoleAsync(bob, "member");
        }

        var admin = await userManager.FindByEmailAsync("admin@test.com");
        if (admin == null)
        {
            admin = new User
            {
                UserName = "admin@test.com",
                Email = "admin@test.com"
            };
            await userManager.CreateAsync(admin, "Pa$$W0rd");
        }
        if (!await userManager.IsInRoleAsync(admin, "member"))
        {
            await userManager.AddToRoleAsync(admin, "member");
        }
        if (!await userManager.IsInRoleAsync(admin, "admin"))
        {
            await userManager.AddToRoleAsync(admin, "admin");
        }
    }
}