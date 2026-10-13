
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ordering.API.Data;
using Ordering.API.DTOs;
using Ordering.API.Entities;
using Ordering.API.Services;

namespace Ordering.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController(
    OrderContext context,
    BasketService basketService) : ControllerBase
{
    // GET: http://localhost:5268/api/orders
    // Retrieves all orders, newest first.
    [HttpGet]
    public async Task<IActionResult> GetOrders(
        CancellationToken cancellationToken)
    {
        var orders = await context.Orders
            .Include(order => order.OrderItems)
            .OrderByDescending(order => order.OrderDate)
            .ToListAsync(cancellationToken);

        return Ok(orders);
    }

    // GET: http://localhost:5268/api/orders/6
    // Retrieves one order by ID.
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetOrder(
        int id,
        CancellationToken cancellationToken)
    {
        var order = await context.Orders
            .Include(order => order.OrderItems)
            .FirstOrDefaultAsync(
                order => order.Id == id,
                cancellationToken);

        if (order == null)
        {
            return NotFound($"Order with ID {id} was not found.");
        }

        return Ok(order);
    }

    // PUT: http://localhost:5268/api/orders/6/status
    // Updates an order's status.
    [HttpPut("{id:int}/status")]
    public async Task<IActionResult> UpdateOrderStatus(
        int id,
        [FromBody] string status,
        CancellationToken cancellationToken)
    {
        var order = await context.Orders
            .Include(order => order.OrderItems)
            .FirstOrDefaultAsync(
                order => order.Id == id,
                cancellationToken);

        if (order == null)
        {
            return NotFound($"Order with ID {id} was not found.");
        }

        var allowedStatuses = new[]
        {
            "Pending",
            "PaymentReceived",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled"
        };

        if (string.IsNullOrWhiteSpace(status) ||
            !allowedStatuses.Contains(status))
        {
            return BadRequest(
                "Invalid status. Allowed statuses: " +
                string.Join(", ", allowedStatuses));
        }

        order.OrderStatus = status;

        await context.SaveChangesAsync(cancellationToken);

        return Ok(order);
    }

    // PUT: http://localhost:5268/api/orders/payment-intent/{paymentIntentId}/status
    [HttpPut("payment-intent/{paymentIntentId}/status")]
    public async Task<IActionResult> UpdateOrderStatusByPaymentIntent(
        string paymentIntentId,
        [FromBody] string status,
        CancellationToken cancellationToken)
    {
        var order = await context.Orders
            .Include(order => order.OrderItems)
            .FirstOrDefaultAsync(
                order => order.PaymentIntentId == paymentIntentId,
                cancellationToken);

        if (order == null)
        {
            return NotFound($"Order with PaymentIntentId {paymentIntentId} was not found.");
        }

        order.OrderStatus = status;

        await context.SaveChangesAsync(cancellationToken);

        return Ok(order);
    }

    // POST: http://localhost:5268/api/orders
    // Creates an order from the customer's basket.
    [HttpPost]
    public async Task<IActionResult> CreateOrder(
        CreateOrderDto request,
        CancellationToken cancellationToken)
    {
        Console.WriteLine("DEBUG: CreateOrder endpoint started.");

        try
        {
            var basketId = !string.IsNullOrWhiteSpace(request.BasketId)
                ? request.BasketId
                : Request.Cookies["basketId"];

            // 1. Validate the basket ID.
            if (string.IsNullOrWhiteSpace(basketId))
            {
                return BadRequest("BasketId is required.");
            }

            // 2. Retrieve the basket from Basket.API.
            Console.WriteLine("DEBUG: Fetching basket...");

            BasketDto? basket;

            try
            {
                basket = await basketService.GetBasketAsync(
                    basketId,
                    cancellationToken);
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine(
                    $"ERROR: Basket API request failed: {ex}");

                return StatusCode(
                    StatusCodes.Status503ServiceUnavailable,
                    "Basket service is unavailable.");
            }

            // 3. Check whether the basket contains products.
            if (basket == null || basket.Items.Count == 0)
            {
                return BadRequest(
                    "Cannot create an order from an empty basket.");
            }

            // 4. Validate basket item values.
            if (basket.Items.Any(item =>
                    item.ProductId <= 0 ||
                    item.Quantity <= 0 ||
                    item.Price < 0))
            {
                return BadRequest(
                    "The basket contains invalid items.");
            }

            // 5. Convert basket items into order items.
            var orderItems = basket.Items.Select(item => new OrderItem
            {
                ProductId = item.ProductId,
                ProductName = item.Name,
                PictureUrl = item.ImageUrl,
                Price = item.Price,
                Quantity = item.Quantity
            }).ToList();

            // 6. Calculate the order subtotal, delivery fee, and discount.
            var subtotal = orderItems.Sum(
                item => item.Price * item.Quantity);

            var deliveryFee = subtotal > 10000 ? 0m : 500m;

            var discount = 0m;
            if (basket.Coupon != null)
            {
                if (basket.Coupon.AmountOff.HasValue)
                {
                    discount = basket.Coupon.AmountOff.Value;
                }
                else if (basket.Coupon.PercentOff.HasValue)
                {
                    discount = Math.Round(
                        subtotal * (basket.Coupon.PercentOff.Value / 100m),
                        MidpointRounding.AwayFromZero);
                }
            }

            Console.WriteLine(
                $"DEBUG: Basket retrieved. Subtotal: {subtotal}, DeliveryFee: {deliveryFee}, Discount: {discount}");

            var shippingAddress = new Address
            {
                Name = request.ShippingAddress.Name,
                Line1 = request.ShippingAddress.Line1,
                Line2 = request.ShippingAddress.Line2,
                City = request.ShippingAddress.City,
                State = request.ShippingAddress.State,
                PostalCode = request.ShippingAddress.PostalCode,
                Country = request.ShippingAddress.Country
            };

            var paymentSummary = request.PaymentSummary ?? new PaymentSummary();

            Order? order = null;
            if (!string.IsNullOrWhiteSpace(basket.PaymentIntentId))
            {
                order = await context.Orders
                    .Include(x => x.OrderItems)
                    .FirstOrDefaultAsync(
                        x => x.PaymentIntentId == basket.PaymentIntentId,
                        cancellationToken);
            }

            if (order == null)
            {
                // 7. Create the order entity.
                order = new Order
                {
                    BuyerEmail = User.Identity?.Name ?? "bob@test.com",
                    ShippingAddress = shippingAddress,
                    Subtotal = subtotal,
                    DeliveryFee = deliveryFee,
                    Discount = discount,
                    PaymentIntentId = basket.PaymentIntentId,
                    PaymentSummary = paymentSummary,
                    OrderStatus = "Pending",
                    OrderItems = orderItems
                };

                context.Orders.Add(order);
            }
            else
            {
                order.ShippingAddress = shippingAddress;
                order.PaymentSummary = paymentSummary;
                order.Subtotal = subtotal;
                order.DeliveryFee = deliveryFee;
                order.Discount = discount;
                order.OrderItems = orderItems;
            }

            // 8. Save the order to the database.
            Console.WriteLine(
                "DEBUG: About to save order to database.");

            await context.SaveChangesAsync(cancellationToken);

            Console.WriteLine(
                $"DEBUG: Order saved successfully. ID: {order.Id}");

            // 9. Return the created order.
            return Created($"/api/orders/{order.Id}", order);
        }
        catch (Exception ex)
        {
            // Log the complete exception in the API terminal.
            Console.WriteLine(
                "ERROR: An exception occurred while creating the order.");

            Console.WriteLine(ex.ToString());

            return Problem(
                title: "Order creation failed",
                detail: "An unexpected error occurred while creating the order.",
                statusCode: StatusCodes.Status500InternalServerError);
        }
    }
}