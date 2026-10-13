using System.ComponentModel.DataAnnotations.Schema;

namespace CrapCart.Entities;

[Table("BasketItems")]
public class BasketItem
{
    public int Id { get; set; }

    public int Quantity { get; set; }

    public int ProductId { get; set; }

    public int BasketId { get; set; }

    public Basket Basket { get; set; } = null!;

    public required Product Product { get; set; }
}