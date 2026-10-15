namespace Catalog.API.Entities;

public class ProductReview
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public required string BuyerEmail { get; set; }
    public int Rating { get; set; }
    public required string Comment { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
