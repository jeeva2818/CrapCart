using Payments.API.DTOs;
using Stripe;

namespace Payments.API.Services;

public class PaymentService(IConfiguration config)
{
    public async Task<PaymentIntent> CreateOrUpdatePaymentIntent(
        BasketDto basket)
    {
        StripeConfiguration.ApiKey =
            config["StripeSettings:SecretKey"];

        var service = new PaymentIntentService();

        var subtotal = (long)basket.Items.Sum(
            x => x.Quantity * x.Price);

        var deliveryFee = subtotal > 10000 ? 0L : 500L;

        long discount = 0;

        if (basket.Coupon != null)
        {
            if (basket.Coupon.AmountOff.HasValue)
            {
                discount = basket.Coupon.AmountOff.Value;
            }
            else if (basket.Coupon.PercentOff.HasValue)
            {
                discount = (long)Math.Round(
                    subtotal * (basket.Coupon.PercentOff.Value / 100m),
                    MidpointRounding.AwayFromZero);
            }
        }

        var totalAmount = subtotal - discount + deliveryFee;

        PaymentIntent intent;

        if (string.IsNullOrEmpty(basket.PaymentIntentId))
        {
            var options = new PaymentIntentCreateOptions
            {
                Amount = totalAmount,
                Currency = "usd",
                PaymentMethodTypes = ["card"]
            };

            intent = await service.CreateAsync(options);
        }
        else
        {
            var options = new PaymentIntentUpdateOptions
            {
                Amount = totalAmount
            };

            intent = await service.UpdateAsync(
                basket.PaymentIntentId,
                options);
        }

        return intent;
    }
}
