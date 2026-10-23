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

        string[] roles = ["member", "admin", "seller", "buyer"];

        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                var result = await roleManager.CreateAsync(new IdentityRole(role));
                if (!result.Succeeded)
                {
                    throw new InvalidOperationException(
                        $"Failed to create role '{role}': " +
                        string.Join(", ", result.Errors.Select(x => x.Description)));
                }
            }
        }

        async Task EnsureUserAsync(string username, string email, string password, string[] userRoles)
        {
            var user = await userManager.FindByNameAsync(username)
                       ?? await userManager.FindByEmailAsync(email);

            if (user == null)
            {
                user = new User
                {
                    UserName = username,
                    Email = email
                };
                var result = await userManager.CreateAsync(user, password);
                if (!result.Succeeded)
                {
                    Console.WriteLine($"Failed to create user '{username}': {string.Join(", ", result.Errors.Select(e => e.Description))}");
                    return;
                }
            }

            foreach (var r in userRoles)
            {
                if (!await userManager.IsInRoleAsync(user, r))
                {
                    await userManager.AddToRoleAsync(user, r);
                }
            }
        }

        // Support both @admin and admin / admin@crapcart.com
        await EnsureUserAsync("@admin", "@admin", "admin@CrapCart", ["admin", "seller", "buyer", "member"]);
        await EnsureUserAsync("admin", "admin@crapcart.com", "admin@CrapCart", ["admin", "seller", "buyer", "member"]);

        // Support both @seller and seller / seller@crapcart.com
        await EnsureUserAsync("@seller", "@seller", "seller@CrapCart", ["seller", "member"]);
        await EnsureUserAsync("seller", "seller@crapcart.com", "seller@CrapCart", ["seller", "member"]);

        // Support both @buyer and buyer / buyer@crapcart.com
        await EnsureUserAsync("@buyer", "@buyer", "buyer@CrapCart", ["buyer", "member"]);
        await EnsureUserAsync("buyer", "buyer@crapcart.com", "buyer@CrapCart", ["buyer", "member"]);
    }
}
