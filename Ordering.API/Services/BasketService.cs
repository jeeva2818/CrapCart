using System.Net.Http;
using System.Net.Http.Json;
using Ordering.API.DTOs;

namespace Ordering.API.Services;

public class BasketService(IHttpClientFactory httpClientFactory)
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

    if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
    {
        return null;
    }

    response.EnsureSuccessStatusCode();

    return await response.Content.ReadFromJsonAsync<BasketDto>(
        cancellationToken: cancellationToken);
}


}
