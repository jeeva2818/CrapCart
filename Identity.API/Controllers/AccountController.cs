

using Identity.API.DTOs;
using Identity.API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Identity.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountController(
    UserManager<User> userManager,
    SignInManager<User> signInManager) : ControllerBase
{
    [HttpGet("user-info")]
    public async Task<ActionResult> GetUserInfo()
    {
        if (User.Identity?.IsAuthenticated != true)
        {
            return NoContent();
        }

        var user = await userManager.GetUserAsync(User);

        if (user == null)
        {
            return Unauthorized();
        }

        var roles = await userManager.GetRolesAsync(user);

        return Ok(new
        {
            user.Email,
            user.UserName,
            roles
        });
    }

    [HttpPost("register")]
    public async Task<ActionResult> RegisterUser(RegisterDto registerDto)
    {
        var user = new User
        {
            UserName = registerDto.Email,
            Email = registerDto.Email
        };

        var result = await userManager.CreateAsync(
            user, registerDto.Password);

        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }

            return ValidationProblem();
        }

        var roleResult = await userManager.AddToRoleAsync(user, "member");

        if (!roleResult.Succeeded)
        {
            await userManager.DeleteAsync(user);

            return Problem(
                title: "Registration failed",
                detail: "Could not assign the member role.",
                statusCode: StatusCodes.Status500InternalServerError);
        }

        return Ok();
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<ActionResult> Logout()
    {
        await signInManager.SignOutAsync();
        return NoContent();
    }

    [Authorize]
    [HttpPost("address")]
    public async Task<ActionResult<Address>> CreateOrUpdateAddress(
        Address address)
    {
        var user = await userManager.Users
            .Include(user => user.Address)
            .FirstOrDefaultAsync(user => user.UserName == User.Identity!.Name);

        if (user == null)
        {
            return Unauthorized();
        }

        if (user.Address == null)
        {
            user.Address = address;
        }
        else
        {
            user.Address.Name = address.Name;
            user.Address.Line1 = address.Line1;
            user.Address.Line2 = address.Line2;
            user.Address.City = address.City;
            user.Address.State = address.State;
            user.Address.PostalCode = address.PostalCode;
            user.Address.Country = address.Country;
        }

        var result = await userManager.UpdateAsync(user);

        if (!result.Succeeded)
        {
            return BadRequest("Problem updating user address");
        }

        return Ok(user.Address);
    }

    [Authorize]
    [HttpGet("address")]
    public async Task<ActionResult<Address>> GetSavedAddress()
    {
        var address = await userManager.Users
            .Where(user => user.UserName == User.Identity!.Name)
            .Select(user => user.Address)
            .FirstOrDefaultAsync();

        if (address == null)
        {
            return NoContent();
        }

        return Ok(address);
    }
}