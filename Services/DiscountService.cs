
using Stripe;
using CrapCart.Entities;

namespace CrapCart.Services;

public class DiscountService
{
    public DiscountService(IConfiguration config)
    {
        StripeConfiguration.ApiKey =
            config["StripeSettings:SecretKey"];
    }

    public async Task<AppCoupon?> GetCouponFromPromoCode(string code)
    {
        var promotionCodeService = new PromotionCodeService();

        var options = new PromotionCodeListOptions
        {
            Active = true,
            Code = code
        };

        options.AddExpand("data.promotion.coupon");

        var promotionCodes =
            await promotionCodeService.ListAsync(options);

        var promotionCode =
            promotionCodes.Data.FirstOrDefault();

        if (promotionCode == null)
        {
            return null;
        }

        if (promotionCode.Promotion?.Coupon == null)
        {
            return null;
        }

        var coupon = promotionCode.Promotion.Coupon;

        return new AppCoupon
        {
            Name = coupon.Name ?? code,
            AmountOff = coupon.AmountOff,
            PercentOff = coupon.PercentOff,
            PromotionCode = promotionCode.Code,
            CouponId = coupon.Id
        };
    }

    public async Task<long> CalculateDiscountFromAmount(
        AppCoupon appCoupon,
        long amount,
        bool removeDiscount = false)
    {
        var service = new CouponService();

        var coupon =
            await service.GetAsync(appCoupon.CouponId);

        if (coupon.AmountOff.HasValue && !removeDiscount)
        {
            return coupon.AmountOff.Value;
        }

        if (coupon.PercentOff.HasValue && !removeDiscount)
        {
            return (long)Math.Round(
                amount * (coupon.PercentOff.Value / 100),
                MidpointRounding.AwayFromZero);
        }

        return 0;
    }
}
