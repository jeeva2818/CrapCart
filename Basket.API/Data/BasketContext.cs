
using Microsoft.EntityFrameworkCore;
using Basket.API.Entities;

namespace Basket.API.Data;

public class BasketContext(
    DbContextOptions<BasketContext> options)
    : DbContext(options)
{
    public DbSet<Entities.Basket> Baskets => Set<Entities.Basket>();

    public DbSet<BasketItem> BasketItems => Set<BasketItem>();
}