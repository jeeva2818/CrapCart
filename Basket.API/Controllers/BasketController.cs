
using Basket.API.Data;
using Basket.API.Dtos;
using Basket.API.Entities;
using Basket.API.Extensions;
using Basket.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Basket.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BasketController(
    BasketContext context,
    CatalogService catalogService,
    DiscountService discountService) : ControllerBase
{
    [HttpGet("{basketId}")]
    public async Task<ActionResult<BasketDto>> GetBasket(
        string basketId,
        CancellationToken cancellationToken)
    {
        var basket = await context.Baskets
            .Include(x => x.Items)
            .FirstOrDefaultAsync(
                x => x.BasketId == basketId,
                cancellationToken);

        if (basket == null)
        {
            return Ok(new BasketDto
            {
                BasketId = basketId
            });
        }

        return Ok(basket.ToDto());
    }

    [HttpPost("items")]
    public async Task<ActionResult<BasketDto>> AddItem(
        AddBasketItemDto request,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.BasketId))
        {
            return BadRequest("BasketId is required.");
        }

        if (request.ProductId <= 0 || request.Quantity <= 0)
        {
            return BadRequest(
                "ProductId and Quantity must be greater than zero.");
        }

        ProductDto? product;

        try
        {
            product = await catalogService.GetProductAsync(
                request.ProductId,
                cancellationToken);
        }
        catch (HttpRequestException)
        {
            return StatusCode(
                StatusCodes.Status503ServiceUnavailable,
                "Catalog service is unavailable.");
        }

        if (product == null)
        {
            return NotFound("Product not found.");
        }

        if (request.Quantity > product.QuantityInStock)
        {
            return BadRequest("Requested quantity exceeds available stock.");
        }

        var basket = await context.Baskets
            .Include(x => x.Items)
            .FirstOrDefaultAsync(
                x => x.BasketId == request.BasketId,
                cancellationToken);

        if (basket == null)
        {
            basket = new Basket.API.Entities.Basket
            {
                BasketId = request.BasketId
            };

            context.Baskets.Add(basket);
        }

        var existingItem = basket.Items
            .FirstOrDefault(x => x.ProductId == product.Id);

        var currentQuantity = existingItem?.Quantity ?? 0;

        if (request.Quantity > product.QuantityInStock - currentQuantity)
        {
            return BadRequest(
                "Requested quantity exceeds available stock.");
        }

        basket.AddItem(product, request.Quantity);

        await context.SaveChangesAsync(cancellationToken);

        return Ok(basket.ToDto());
    }

    [HttpPost("{code}")]
    public async Task<ActionResult<BasketDto>> AddCouponCode(
        string code,
        [FromQuery] string? basketId = null,
        CancellationToken cancellationToken = default)
    {
        var resolvedBasketId = !string.IsNullOrWhiteSpace(basketId)
            ? basketId
            : Request.Cookies["basketId"];

        if (string.IsNullOrWhiteSpace(resolvedBasketId))
        {
            return BadRequest("Unable to retrieve basket");
        }

        var basket = await context.Baskets
            .Include(x => x.Items)
            .FirstOrDefaultAsync(
                x => x.BasketId == resolvedBasketId,
                cancellationToken);

        if (basket == null)
        {
            return BadRequest("Unable to retrieve basket");
        }

        var coupon = await discountService.GetCouponFromPromoCode(code);

        if (coupon == null)
        {
            return BadRequest("Invalid coupon");
        }

        basket.Coupon = coupon;

        await context.SaveChangesAsync(cancellationToken);

        return Ok(basket.ToDto());
    }

    [HttpDelete("remove-coupon")]
    public async Task<ActionResult> RemoveCouponFromBasket(
        [FromQuery] string? basketId = null,
        CancellationToken cancellationToken = default)
    {
        var resolvedBasketId = !string.IsNullOrWhiteSpace(basketId)
            ? basketId
            : Request.Cookies["basketId"];

        if (string.IsNullOrWhiteSpace(resolvedBasketId))
        {
            return BadRequest("Unable to retrieve basket");
        }

        var basket = await context.Baskets
            .Include(x => x.Items)
            .FirstOrDefaultAsync(
                x => x.BasketId == resolvedBasketId,
                cancellationToken);

        if (basket == null)
        {
            return BadRequest("Unable to retrieve basket");
        }

        if (basket.Coupon == null)
        {
            return BadRequest("No coupon to remove");
        }

        basket.Coupon = null;

        await context.SaveChangesAsync(cancellationToken);

        return Ok();
    }

    [HttpPut("{basketId}/payment-intent")]
    public async Task<ActionResult<BasketDto>> UpdatePaymentIntent(
        string basketId,
        UpdatePaymentIntentDto request,
        CancellationToken cancellationToken)
    {
        var basket = await context.Baskets
            .Include(x => x.Items)
            .FirstOrDefaultAsync(
                x => x.BasketId == basketId,
                cancellationToken);

        if (basket == null)
        {
            return NotFound("Basket not found.");
        }

        basket.PaymentIntentId = request.PaymentIntentId;
        basket.ClientSecret = request.ClientSecret;

        await context.SaveChangesAsync(cancellationToken);

        return Ok(basket.ToDto());
    }

    [HttpDelete("{basketId}/items/{productId:int}")]
    public async Task<ActionResult<BasketDto>> RemoveItem(
        string basketId,
        int productId,
        [FromQuery] int quantity = 1,
        CancellationToken cancellationToken = default)
    {
        if (quantity <= 0)
        {
            return BadRequest("Quantity must be greater than zero.");
        }

        var basket = await context.Baskets
            .Include(x => x.Items)
            .FirstOrDefaultAsync(
                x => x.BasketId == basketId,
                cancellationToken);

        if (basket == null)
        {
            return NotFound("Basket not found.");
        }

        basket.RemoveItem(productId, quantity);

        await context.SaveChangesAsync(cancellationToken);

        return Ok(basket.ToDto());
    }

    [HttpDelete("{basketId}")]
    public async Task<IActionResult> DeleteBasket(
        string basketId,
        CancellationToken cancellationToken)
    {
        var basket = await context.Baskets
            .FirstOrDefaultAsync(
                x => x.BasketId == basketId,
                cancellationToken);

        if (basket == null)
        {
            return NotFound("Basket not found.");
        }

        context.Baskets.Remove(basket);

        await context.SaveChangesAsync(cancellationToken);

        return NoContent();
    }
}