using CrapCart.Data;
using CrapCart.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CrapCart.Dtos;
using CrapCart.Extensions;
using CrapCart.Services;

namespace CrapCart.Controllers;

public class BasketController(
    StoreContext context,
    DiscountService discountService) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<BasketDto>> GetBasket()
    {
        var basket = await context.Baskets
            .Include(x => x.Items)
            .ThenInclude(x => x.Product)
            .FirstOrDefaultAsync(
                x => x.BasketId == Request.Cookies["basketId"]);

        if (basket == null)
            return NoContent();

        return basket.ToDto();
    }

    private async Task<Basket?> RetrieveBasket()
    {
        return await context.Baskets
            .Include(x => x.Items)
            .ThenInclude(x => x.Product)
            .FirstOrDefaultAsync(
                x => x.BasketId == Request.Cookies["basketId"]);
    }

    [HttpPost]
    public async Task<ActionResult> AddItemToBasket(
        int productId,
        int quantity)
    {
        var basket = await RetrieveBasket();

        basket ??= await CreateBasket();

        var product = await context.Products.FindAsync(productId);

        if (product == null)
            return BadRequest("Problem adding item to basket");

        basket.AddItem(product, quantity);

        var result = await context.SaveChangesAsync();

        if (result > 0)
            return CreatedAtAction(
                nameof(GetBasket),
                new { id = basket.Id },
                basket.ToDto());

        return BadRequest("Problem updating basket");
    }

    [HttpPost("{code}")]
    public async Task<ActionResult<BasketDto>> AddCouponCode(
        string code)
    {
        var basket = await RetrieveBasket();

        if (basket == null)
            return BadRequest("Unable to retrieve basket");

        var coupon =
            await discountService.GetCouponFromPromoCode(code);

        if (coupon == null)
            return BadRequest("Invalid coupon");

        basket.Coupon = coupon;

        var result = await context.SaveChangesAsync();

        if (result > 0)
            return basket.ToDto();

        return BadRequest("Problem adding coupon");
    }

    [HttpDelete("remove-coupon")]
    public async Task<ActionResult> RemoveCouponFromBasket()
    {
        var basket = await RetrieveBasket();

        if (basket == null)
            return BadRequest("Unable to retrieve basket");

        if (basket.Coupon == null)
            return BadRequest("No coupon to remove");

        basket.Coupon = null;

        var result = await context.SaveChangesAsync();

        if (result > 0)
            return Ok();

        return BadRequest("Problem removing coupon");
    }

    [HttpDelete]
    public async Task<ActionResult> RemoveBasketItem(
        int productId,
        int quantity)
    {
        var basket = await RetrieveBasket();

        if (basket == null)
            return BadRequest("Unable to retrieve basket");

        basket.RemoveItem(productId, quantity);

        var result = await context.SaveChangesAsync();

        if (result > 0)
            return Ok();

        return BadRequest("Problem updating basket");
    }

    private async Task<Basket> CreateBasket()
    {
        var basketId = Guid.NewGuid().ToString();

        var cookieOptions = new CookieOptions
        {
            IsEssential = true,
            Expires = DateTime.UtcNow.AddDays(30)
        };

        Response.Cookies.Append(
            "basketId",
            basketId,
            cookieOptions);

        var basket = new Basket
        {
            BasketId = basketId
        };

        context.Baskets.Add(basket);

        return basket;
    }
}