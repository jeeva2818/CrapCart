using CrapCart.Dtos;
using CrapCart.Entities;

namespace CrapCart.Extensions;

public static class BasketExtensions
{
    public static BasketDto ToDto(this Basket basket)
    {
        return new BasketDto
        {
            BasketId = basket.BasketId,
            Items = basket.Items.Select(x => new BasketItemDto
            {
                ProductId = x.ProductId,
                Name = x.Product.Name,
                Price = x.Product.Price,
                Brand = x.Product.Brand,
                ImageUrl = x.Product.ImageUrl,
                Quantity = x.Quantity,
                Type = x.Product.Type
            }).ToList()
        };
    }
}