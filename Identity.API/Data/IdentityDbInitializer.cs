
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

        // 1. Admin: @admin / admin@CrapCart
        var admin = await userManager.FindByNameAsync("@admin");
        if (admin == null)
        {
            admin = new User
            {
                UserName = "Admin",
                Email = "@admin"
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

        // 2. Seller: @seller / seller@CrapCart
        var seller = await userManager.FindByNameAsync("@seller");
        if (seller == null)
        {
            seller = new User
            {
                UserName = "Seller",
                Email = "@seller"
            };
            var result = await userManager.CreateAsync(seller, "seller@CrapCart");
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

        // 3. Buyer: @buyer / buyer@CrapCart
        var buyer = await userManager.FindByNameAsync("@buyer");
        if (buyer == null)
        {
            buyer = new User
            {
                UserName = "Buyer",
                Email = "@buyer"
            };
            var result = await userManager.CreateAsync(buyer, "buyer@CrapCart");
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