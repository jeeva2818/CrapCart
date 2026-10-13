using System.ComponentModel.DataAnnotations.Schema;

namespace Basket.API.Entities;

[Table("BasketItems")]
public class BasketItem
{
    public int Id { get; set; }
    public int Quantity { get; set; }
    public int ProductId { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public int BasketId { get; set; }
    public Basket Basket { get; set; } = null!;
}
