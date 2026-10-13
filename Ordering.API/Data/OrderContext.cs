
using Microsoft.EntityFrameworkCore;
using Ordering.API.Entities;

namespace Ordering.API.Data;

public class OrderContext(DbContextOptions<OrderContext> options)
    : DbContext(options)
{
    public DbSet<Order> Orders => Set<Order>();

    public DbSet<OrderItem> OrderItems => Set<OrderItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Order>()
            .OwnsOne(order => order.ShippingAddress);

        modelBuilder.Entity<Order>()
            .OwnsOne(order => order.PaymentSummary);
    }
}