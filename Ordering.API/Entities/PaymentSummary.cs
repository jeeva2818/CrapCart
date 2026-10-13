using System.Text.Json.Serialization;

namespace Ordering.API.Entities;

public class PaymentSummary
{
    public string Last4 { get; set; } = string.Empty;

    public string Brand { get; set; } = string.Empty;

    [JsonPropertyName("exp_month")]
    public int ExpMonth { get; set; }

    [JsonPropertyName("exp_year")]
    public int ExpYear { get; set; }
}
