using Basket.API.Entities;

namespace Basket.API.Dtos;

public class BasketDto
{
    public required string BasketId { get; set; }
    public List<BasketItemDto> Items { get; set; } = [];
    public AppCoupon? Coupon { get; set; }
    public string? ClientSecret { get; set; }
    public string? PaymentIntentId { get; set; }
}
