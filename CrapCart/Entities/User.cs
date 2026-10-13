using Microsoft.AspNetCore.Identity;

namespace CrapCart.Entities;

public class User : IdentityUser
{
    public int? AddressId { get; set; }
    public Address? Address { get; set; }
}