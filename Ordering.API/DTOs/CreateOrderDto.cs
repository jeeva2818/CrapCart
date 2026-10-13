using System.ComponentModel.DataAnnotations;
using Ordering.API.Entities;

namespace Ordering.API.DTOs;

public class CreateOrderDto
{
    public string? BasketId { get; set; }

    [Required]
    public required AddressDto ShippingAddress { get; set; }

    public PaymentSummary? PaymentSummary { get; set; }
}

public class AddressDto
{
    [Required]
    public required string Name { get; set; }

    [Required]
    public required string Line1 { get; set; }

    public string? Line2 { get; set; }

    [Required]
    public required string City { get; set; }

    [Required]
    public required string State { get; set; }

    [Required]
    public required string PostalCode { get; set; }

    [Required]
    public required string Country { get; set; }
}
