namespace Payments.API.DTOs;

public class BasketDto
{
    public string BasketId { get; set; } = string.Empty;
    public List<BasketItemDto> Items { get; set; } = [];
    public AppCouponDto? Coupon { get; set; }
    public string? ClientSecret { get; set; }
    public string? PaymentIntentId { get; set; }
}

public class BasketItemDto
{
    public int ProductId { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public int Quantity { get; set; }
}

public class AppCouponDto
{
    public string Name { get; set; } = string.Empty;
    public long? AmountOff { get; set; }
    public decimal? PercentOff { get; set; }
    public string PromotionCode { get; set; } = string.Empty;
    public string CouponId { get; set; } = string.Empty;
}

public class UpdatePaymentIntentDto
{
    public string? PaymentIntentId { get; set; }
    public string? ClientSecret { get; set; }
}
