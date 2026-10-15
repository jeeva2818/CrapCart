
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

        // 1. Admin: 1234@admin / admin@CrapCart
        var admin = await userManager.FindByNameAsync("1234@admin");
        if (admin == null)
        {
            admin = new User
            {
                UserName = "1234@admin",
                Email = "1234@admin"
            };
            var result = await userManager.CreateAsync(admin, "admin@CrapCart");
            if (!result.Succeeded)
            {
                Console.WriteLine($"Failed to create admin: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }
        }
        foreach (var r in new[] { "admin", "seller", "buyer", "member" })
        {
            if (!await userManager.IsInRoleAsync(admin, r))
                await userManager.AddToRoleAsync(admin, r);
        }

        // 2. Seller: abcd@tech / adcd@pvtltd
        var seller = await userManager.FindByNameAsync("abcd@tech");
        if (seller == null)
        {
            seller = new User
            {
                UserName = "abcd@tech",
                Email = "abcd@tech"
            };
            var result = await userManager.CreateAsync(seller, "adcd@pvtltd");
            if (!result.Succeeded)
            {
                Console.WriteLine($"Failed to create seller: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }
        }
        foreach (var r in new[] { "seller", "member" })
        {
            if (!await userManager.IsInRoleAsync(seller, r))
                await userManager.AddToRoleAsync(seller, r);
        }

        // 3. Buyer: romanreigns2818@gmail.com / roman@roman2818
        var buyer = await userManager.FindByNameAsync("romanreigns2818@gmail.com");
        if (buyer == null)
        {
            buyer = new User
            {
                UserName = "romanreigns2818@gmail.com",
                Email = "romanreigns2818@gmail.com"
            };
            var result = await userManager.CreateAsync(buyer, "roman@roman2818");
            if (!result.Succeeded)
            {
                Console.WriteLine($"Failed to create buyer: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }
        }
        foreach (var r in new[] { "buyer", "member" })
        {
            if (!await userManager.IsInRoleAsync(buyer, r))
                await userManager.AddToRoleAsync(buyer, r);
        }
    }
}