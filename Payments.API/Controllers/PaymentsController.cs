using Microsoft.AspNetCore.Mvc;
using Payments.API.DTOs;
using Payments.API.Services;
using Stripe;

namespace Payments.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentsController(
    PaymentService paymentService,
    BasketClient basketClient,
    OrderingClient orderingClient,
    IConfiguration config,
    ILogger<PaymentsController> logger) : ControllerBase
{
    [HttpPost]
    [HttpPost("{basketId}")]
    public async Task<ActionResult<BasketDto>> CreateOrUpdatePaymentIntent(
        string? basketId = null,
        CancellationToken cancellationToken = default)
    {
        var resolvedBasketId = !string.IsNullOrWhiteSpace(basketId)
            ? basketId
            : Request.Cookies["basketId"];

        if (string.IsNullOrWhiteSpace(resolvedBasketId))
        {
            return BadRequest("Problem with the basket: basketId is missing.");
        }

        BasketDto? basket;

        try
        {
            basket = await basketClient.GetBasketAsync(
                resolvedBasketId,
                cancellationToken);
        }
        catch (HttpRequestException ex)
        {
            logger.LogError(ex, "Failed to reach Basket.API");
            return StatusCode(
                StatusCodes.Status503ServiceUnavailable,
                "Basket service is unavailable.");
        }

        if (basket == null || basket.Items.Count == 0)
        {
            return BadRequest("Problem with the basket: basket is empty.");
        }

        var intent = await paymentService.CreateOrUpdatePaymentIntent(basket);

        if (intent == null)
        {
            return BadRequest("Problem creating payment intent with Stripe.");
        }

        var updatedBasket = await basketClient.UpdatePaymentIntentAsync(
            resolvedBasketId,
            intent.Id,
            intent.ClientSecret,
            cancellationToken);

        return Ok(updatedBasket ?? new BasketDto
        {
            BasketId = basket.BasketId,
            Items = basket.Items,
            Coupon = basket.Coupon,
            PaymentIntentId = intent.Id,
            ClientSecret = intent.ClientSecret
        });
    }

    [HttpPost("webhook")]
    public async Task<IActionResult> StripeWebhook(
        CancellationToken cancellationToken)
    {
        var json = await new StreamReader(Request.Body)
            .ReadToEndAsync(cancellationToken);

        try
        {
            var whSecret = config["StripeSettings:WhSecret"];
            Event stripeEvent;

            if (!string.IsNullOrWhiteSpace(whSecret) &&
                Request.Headers.TryGetValue("Stripe-Signature", out var signature))
            {
                stripeEvent = EventUtility.ConstructEvent(
                    json,
                    signature,
                    whSecret,
                    throwOnApiVersionMismatch: false);
            }
            else
            {
                stripeEvent = EventUtility.ParseEvent(
                    json,
                    throwOnApiVersionMismatch: false);
            }

            if (stripeEvent.Data.Object is PaymentIntent intent)
            {
                if (intent.Status == "succeeded")
                {
                    await orderingClient.UpdateOrderStatusByPaymentIntentAsync(
                        intent.Id,
                        "PaymentReceived",
                        cancellationToken);
                }
                else if (stripeEvent.Type == EventTypes.PaymentIntentPaymentFailed)
                {
                    await orderingClient.UpdateOrderStatusByPaymentIntentAsync(
                        intent.Id,
                        "Cancelled",
                        cancellationToken);
                }
            }

            return Ok();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Stripe webhook error");
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                "Webhook error");
        }
    }
}
