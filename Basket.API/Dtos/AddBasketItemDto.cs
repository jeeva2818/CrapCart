
namespace Basket.API.Dtos;

public class AddBasketItemDto
{
    public required string BasketId { get; set; }
    public int ProductId { get; set; }
    public int Quantity { get; set; }
}