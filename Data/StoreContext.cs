using Microsoft.EntityFrameworkCore;
using CrapCart.Entities;

namespace CrapCart.Data;

public class StoreContext(DbContextOptions options) : DbContext(options)
{
    public DbSet<Product> Products { get; set; }
    public required DbSet<Basket> Baskets { get; set; }
}