using Microsoft.EntityFrameworkCore;
using CrapCart.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace CrapCart.Data;

public class StoreContext(DbContextOptions options) : IdentityDbContext<User>(options)
{
    public DbSet<Product> Products { get; set; }
    public required DbSet<Basket> Baskets { get; set; }
protected override void OnModelCreating(ModelBuilder builder)
{
    base.OnModelCreating(builder);

    builder.Entity<IdentityRole>().HasData(
        new IdentityRole
        {
            Id = "8a0d5f5a-7d8b-4f2e-9b5e-123456789001",
            Name = "member",
            NormalizedName = "MEMBER",
            ConcurrencyStamp = "8a0d5f5a-7d8b-4f2e-9b5e-123456789001"
        },
        new IdentityRole
        {
            Id = "8a0d5f5a-7d8b-4f2e-9b5e-123456789002",
            Name = "admin",
            NormalizedName = "ADMIN",
            ConcurrencyStamp = "8a0d5f5a-7d8b-4f2e-9b5e-123456789002"
        }
    );
}
}