using CrapCart.Entities;
using Microsoft.EntityFrameworkCore;

namespace CrapCart.Data;

public class DbInitializer
{
    public static void InitDb(WebApplication app)
    {
        using var scope = app.Services.CreateScope();

        var context = scope.ServiceProvider.GetRequiredService<StoreContext>()
            ?? throw new InvalidOperationException("Failed to retrieve store context");

        SeedData(context);
    }

    private static void SeedData(StoreContext context)
    {
        context.Database.Migrate();

        if (context.Products.Any())
        {
            return;
        }

        var products = new List<Product>
        {
            new Product
            {
                Name = "Angular Speedster Board 2000",
                Description = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa.",
                Price = 20000,
                ImageUrl = "/images/products/sb-ang1.png",
                Brand = "Angular",
                Type = "Boards",
                QuantityInStock = 100
            },

            new Product
            {
                Name = "Green Angular Board 3000",
                Description = "Nunc viverra imperdiet enim. Fusce est. Vivamus a tellus.",
                Price = 15000,
                ImageUrl = "/images/products/sb-ang2.png",
                Brand = "Angular",
                Type = "Boards",
                QuantityInStock = 100
            },

            new Product
            {
                Name = "Core Board Speed Rush 3",
                Description = "Suspendisse dui purus, scelerisque at, vulputate vitae, pretium mattis, nunc.",
                Price = 18000,
                ImageUrl = "/images/products/sb-core1.png",
                Brand = "NetCore",
                Type = "Boards",
                QuantityInStock = 100
            },

            new Product
            {
                Name = "Net Core Super Board",
                Description = "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
                Price = 30000,
                ImageUrl = "/images/products/sb-core2.png",
                Brand = "NetCore",
                Type = "Boards",
                QuantityInStock = 100
            },

            new Product
            {
                Name = "React Board Super Whizzy Fast",
                Description = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
                Price = 25000,
                ImageUrl = "/images/products/sb-react1.png",
                Brand = "React",
                Type = "Boards",
                QuantityInStock = 100
            },

            new Product
            {
                Name = "Typescript Entry Board",
                Description = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
                Price = 12000,
                ImageUrl = "/images/products/sb-ts1.png",
                Brand = "TypeScript",
                Type = "Boards",
                QuantityInStock = 100
            },

            new Product
            {
                Name = "Core Blue Hat",
                Description = "Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero.",
                Price = 1000,
                ImageUrl = "/images/products/hat-core1.png",
                Brand = "NetCore",
                Type = "Hats",
                QuantityInStock = 100
            },

            new Product
            {
                Name = "Green React Woolen Hat",
                Description = "Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero.",
                Price = 8000,
                ImageUrl = "/images/products/hat-react1.png",
                Brand = "React",
                Type = "Hats",
                QuantityInStock = 100
            },

            new Product
            {
                Name = "Purple React Woolen Hat",
                Description = "Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero.",
                Price = 1500,
                ImageUrl = "/images/products/hat-react2.png",
                Brand = "React",
                Type = "Hats",
                QuantityInStock = 100
            },

            new Product
            {
                Name = "Blue Code Gloves",
                Description = "Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero.",
                Price = 1800,
                ImageUrl = "/images/products/glove-code1.png",
                Brand = "VS Code",
                Type = "Gloves",
                QuantityInStock = 100
            },

            new Product
            {
                Name = "Green Code Gloves",
                Description = "Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero.",
                Price = 1500,
                ImageUrl = "/images/products/glove-code2.png",
                Brand = "VS Code",
                Type = "Gloves",
                QuantityInStock = 100
            },

            new Product
            {
                Name = "Purple React Gloves",
                Description = "Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero.",
                Price = 1600,
                ImageUrl = "/images/products/glove-react1.png",
                Brand = "React",
                Type = "Gloves",
                QuantityInStock = 100
            },

            new Product
            {
                Name = "Green React Gloves",
                Description = "Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero.",
                Price = 1400,
                ImageUrl = "/images/products/glove-react2.png",
                Brand = "React",
                Type = "Gloves",
                QuantityInStock = 100
            },

            new Product
            {
                Name = "Redis Red Boots",
                Description = "Suspendisse dui purus, scelerisque at, vulputate vitae, pretium mattis, nunc.",
                Price = 25000,
                ImageUrl = "/images/products/boot-redis1.png",
                Brand = "Redis",
                Type = "Boots",
                QuantityInStock = 100
            },

            new Product
            {
                Name = "Core Red Boots",
                Description = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
                Price = 18999,
                ImageUrl = "/images/products/boot-core2.png",
                Brand = "NetCore",
                Type = "Boots",
                QuantityInStock = 100
            },

            new Product
            {
                Name = "Core Purple Boots",
                Description = "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
                Price = 19999,
                ImageUrl = "/images/products/boot-core1.png",
                Brand = "NetCore",
                Type = "Boots",
                QuantityInStock = 100
            },

            new Product
            {
                Name = "Angular Purple Boots",
                Description = "Aenean nec lorem. In porttitor. Donec laoreet nonummy augue.",
                Price = 15000,
                ImageUrl = "/images/products/boot-ang2.png",
                Brand = "Angular",
                Type = "Boots",
                QuantityInStock = 100
            },

            new Product
            {
                Name = "Angular Blue Boots",
                Description = "Suspendisse dui purus, scelerisque at, vulputate vitae, pretium mattis, nunc.",
                Price = 18000,
                ImageUrl = "/images/products/boot-ang1.png",
                Brand = "Angular",
                Type = "Boots",
                QuantityInStock = 100
            }
        };

        context.Products.AddRange(products);
        context.SaveChanges();
    }
}