using Microsoft.EntityFrameworkCore;
using Catalog.API.Entities;

namespace Catalog.API.Data;

public class CatalogContext(DbContextOptions<CatalogContext> options) : DbContext(options)
{
    public DbSet<Product> Products { get; set; }
    public DbSet<ProductReview> Reviews { get; set; }
}
