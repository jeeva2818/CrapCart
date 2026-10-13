using System.ComponentModel.DataAnnotations;

namespace CrapCart.DTOs;

public class RegisterDto
{
    [Required]
    public string Email { get; set; } = string.Empty;

    public string Password { get; set; } = string.Empty;
}