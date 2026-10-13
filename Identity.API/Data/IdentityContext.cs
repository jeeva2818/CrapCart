
using Identity.API.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Identity.API.Data;

public class IdentityContext(DbContextOptions<IdentityContext> options)
    : IdentityDbContext<User>(options)
{
    public DbSet<Address> Addresses => Set<Address>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<User>()
            .HasOne(user => user.Address)
            .WithMany()
            .HasForeignKey(user => user.AddressId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}