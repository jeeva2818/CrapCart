
using Microsoft.AspNetCore.Identity;

namespace Identity.API.Entities;

public class User : IdentityUser
{
    public int? AddressId { get; set; }

    public Address? Address { get; set; }
}