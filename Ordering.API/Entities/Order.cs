
namespace Ordering.API.Entities;

public class Order
{
    public int Id { get; set; }

    public required string BuyerEmail { get; set; }

    public DateTime OrderDate { get; set; } = DateTime.UtcNow;

    public required Address ShippingAddress { get; set; }

    public decimal Subtotal { get; set; }

    public decimal DeliveryFee { get; set; }

    public decimal Discount { get; set; }

    public string? PaymentIntentId { get; set; }

    public required string OrderStatus { get; set; } = "Pending";

    public PaymentSummary PaymentSummary { get; set; } = new();

    public List<OrderItem> OrderItems { get; set; } = [];

    public decimal Total => Subtotal + DeliveryFee - Discount;
}