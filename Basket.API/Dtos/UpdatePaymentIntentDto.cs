namespace Basket.API.Dtos;

public class UpdatePaymentIntentDto
{
    public string? PaymentIntentId { get; set; }
    public string? ClientSecret { get; set; }
}
