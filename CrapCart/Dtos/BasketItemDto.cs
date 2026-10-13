namespace CrapCart.Dtos;

public class BasketItemDto
{
    public int ProductId { get; set; }

    public required string Name { get; set; }

    public decimal Price { get; set; }

    public required string ImageUrl { get; set; }

    public required string Brand { get; set; }

    public required string Type { get; set; }

    public int Quantity { get; set; }
}