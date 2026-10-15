
using System.ComponentModel.DataAnnotations;

namespace Identity.API.DTOs;

public class RegisterDto
{
    [Required]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(4)]
    public string Password { get; set; } = string.Empty;

    public string Role { get; set; } = "Buyer";
}
