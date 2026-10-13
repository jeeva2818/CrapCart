using System.Net.Http.Json;

namespace Payments.API.Services;

public class OrderingClient(IHttpClientFactory httpClientFactory)
{
    private readonly HttpClient _httpClient =
        httpClientFactory.CreateClient("Ordering");

    public async Task<bool> UpdateOrderStatusByPaymentIntentAsync(
        string paymentIntentId,
        string status,
        CancellationToken cancellationToken = default)
    {
        using var response = await _httpClient.PutAsJsonAsync(
            $"api/orders/payment-intent/{Uri.EscapeDataString(paymentIntentId)}/status",
            status,
            cancellationToken);

        return response.IsSuccessStatusCode;
    }
}
