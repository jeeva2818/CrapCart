
using Basket.API.Dtos;
using Basket.API.Entities;

namespace Basket.API.Extensions;

public static class BasketExtensions
{
    public static BasketDto ToDto(this Basket.API.Entities.Basket basket)
    {
        return new BasketDto
        {
            BasketId = basket.BasketId,
            Coupon = basket.Coupon,
            ClientSecret = basket.ClientSecret,
            PaymentIntentId = basket.PaymentIntentId,
            Items = basket.Items.Select(x => new BasketItemDto
            {
                ProductId = x.ProductId,
                Name = x.Name,
                Price = x.Price,
                Brand = x.Brand,
                ImageUrl = x.ImageUrl,
                Quantity = x.Quantity,
                Type = x.Type
            }).ToList()
        };
    }
}