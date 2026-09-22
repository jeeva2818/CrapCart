using CrapCart.Data;
using CrapCart.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CrapCart.Dtos;
using CrapCart.Extensions;


namespace CrapCart.Controllers;

public class BasketController(StoreContext context) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<BasketDto>> GetBasket()
    {
        var basket = await context.Baskets
            .Include(x => x.Items)
            .ThenInclude(x => x.Product)
            .FirstOrDefaultAsync(x => x.BasketId == Request.Cookies["basketId"]);

        if (basket == null)
            return NoContent(); 

        return basket.ToDto();
    }

    private async Task<Basket?> RetrieveBasket()
{
    return await context.Baskets
        .Include(x => x.Items)
        .ThenInclude(x => x.Product)
        .FirstOrDefaultAsync(x => x.BasketId == Request.Cookies["basketId"]);
}


    [HttpPost]
    public async Task<ActionResult> AddItemToBasket(int productId, int quantity)
        {
            var basket = await RetrieveBasket();
            basket ??= await CreateBasket();
            var product = await context.Products.FindAsync(productId);
        if (product == null)
        return BadRequest("Problem adding item to basket");
            basket.AddItem(product, quantity);
            var result = await context.SaveChangesAsync();
        if (result > 0)
        return CreatedAtAction(nameof(GetBasket), new { id = basket.Id }, basket.ToDto());
        return BadRequest("Problem updating basket");
        }
        private async Task<Basket> CreateBasket(){
        var basketId = Guid.NewGuid().ToString();
        var cookieOptions = new CookieOptions
            {
                IsEssential = true,
                Expires = DateTime.UtcNow.AddDays(30)
            };
        Response.Cookies.Append("basketId", basketId, cookieOptions);
        var basket = new Basket { BasketId = basketId };
        context.Baskets.Add(basket);
        return basket;
    }
    [HttpDelete]
public async Task<ActionResult> RemoveBasketItem(int productId, int quantity)
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
}