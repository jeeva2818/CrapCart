
using System.Net;
using System.Net.Http.Json;
using Basket.API.Dtos;

namespace Basket.API.Services;

public class CatalogService(HttpClient httpClient)
{
    public async Task<ProductDto?> GetProductAsync(
        int id,
        CancellationToken cancellationToken = default)
    {
        using var response = await httpClient.GetAsync(
            $"api/products/{id}",
            cancellationToken);

        if (response.StatusCode == HttpStatusCode.NotFound)
        {
            return null;
        }

        response.EnsureSuccessStatusCode();

        return await response.Content.ReadFromJsonAsync<ProductDto>(
            cancellationToken: cancellationToken);
    }
}