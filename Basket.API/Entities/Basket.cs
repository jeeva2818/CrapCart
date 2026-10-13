using Basket.API.Dtos;

namespace Basket.API.Entities;

public class Basket
{
    public int Id { get; set; }
    public required string BasketId { get; set; }
    public List<BasketItem> Items { get; set; } = [];
    public AppCoupon? Coupon { get; set; }
    public string? ClientSecret { get; set; }
    public string? PaymentIntentId { get; set; }

    public void AddItem(ProductDto product, int quantity)
    {
        ArgumentNullException.ThrowIfNull(product);

        if (quantity <= 0)
            throw new ArgumentException(
                "Quantity should be greater than zero.",
                nameof(quantity));

        var existingItem = FindItem(product.Id);

        if (existingItem == null)
        {
            Items.Add(new BasketItem
            {
                ProductId = product.Id,
                Name = product.Name,
                Price = product.Price,
                ImageUrl = product.ImageUrl,
                Brand = product.Brand,
                Type = product.Type,
                Quantity = quantity
            });
        }
        else
        {
            existingItem.Quantity += quantity;
        }
    }

    public void RemoveItem(int productId, int quantity)
    {
        if (quantity <= 0)
            throw new ArgumentException(
                "Quantity should be greater than zero.",
                nameof(quantity));

        var item = FindItem(productId);
        if (item == null) return;

        item.Quantity -= quantity;

        if (item.Quantity <= 0)
            Items.Remove(item);
    }

    private BasketItem? FindItem(int productId)
    {
        return Items.FirstOrDefault(
            item => item.ProductId == productId);
    }
}
