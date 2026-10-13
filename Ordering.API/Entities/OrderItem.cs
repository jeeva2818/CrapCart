
using System.Text.Json.Serialization;

namespace Ordering.API.Entities;

public class OrderItem
{
    public int Id { get; set; }

    public int ProductId { get; set; }

    public required string ProductName { get; set; }

    public string Name => ProductName;

    public required string PictureUrl { get; set; }

    public decimal Price { get; set; }

    public int Quantity { get; set; }

    public int OrderId { get; set; }

    [JsonIgnore]
    public Order? Order { get; set; }
}