using System.Net;
using System.Net.Http.Json;
using Payments.API.DTOs;

namespace Payments.API.Services;

public class BasketClient(IHttpClientFactory httpClientFactory)
{
    private readonly HttpClient _httpClient =
        httpClientFactory.CreateClient("Basket");

    public async Task<BasketDto?> GetBasketAsync(
        string basketId,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(basketId))
        {
            return null;
        }

        using var response = await _httpClient.GetAsync(
            $"api/basket/{Uri.EscapeDataString(basketId)}",
            cancellationToken);

        if (response.StatusCode == HttpStatusCode.NotFound)
        {
            return null;
        }

        response.EnsureSuccessStatusCode();

        return await response.Content.ReadFromJsonAsync<BasketDto>(
            cancellationToken: cancellationToken);
    }

    public async Task<BasketDto?> UpdatePaymentIntentAsync(
        string basketId,
        string paymentIntentId,
        string clientSecret,
        CancellationToken cancellationToken = default)
    {
        using var response = await _httpClient.PutAsJsonAsync(
            $"api/basket/{Uri.EscapeDataString(basketId)}/payment-intent",
            new UpdatePaymentIntentDto
            {
                PaymentIntentId = paymentIntentId,
                ClientSecret = clientSecret
            },
            cancellationToken);

        if (response.StatusCode == HttpStatusCode.NotFound)
        {
            return null;
        }

        response.EnsureSuccessStatusCode();

        return await response.Content.ReadFromJsonAsync<BasketDto>(
            cancellationToken: cancellationToken);
    }
}
