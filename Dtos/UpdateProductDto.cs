
using System.ComponentModel.DataAnnotations;

namespace CrapCart.Dtos;

public class UpdateProductDto
{
    public int Id { get; set; }

    [Required]
    public string Name { get; set; } = string.Empty;

    [Required]
    public string Description { get; set; } = string.Empty;

    [Required]
    [Range(100, double.PositiveInfinity)]
    public decimal Price { get; set; }

    public IFormFile? File { get; set; }

    [Required]
    public string Type { get; set; } = string.Empty;

    [Required]
    public string Brand { get; set; } = string.Empty;

    [Required]
    [Range(0, 200)]
    public int Quantity { get; set; }
}

