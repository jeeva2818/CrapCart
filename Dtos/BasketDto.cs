using CrapCart.Entities;

namespace CrapCart.Dtos;

public class BasketDto
{
    public required string BasketId { get; set; }

    public List<BasketItemDto> Items { get; set; } = [];

    public AppCoupon? Coupon { get; set; }
}