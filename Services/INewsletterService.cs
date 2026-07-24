namespace Connexr_dev.Services;

public enum SubscribeResult
{
    Added,
    Duplicate,
    Failed
}

public interface INewsletterService
{
    Task<SubscribeResult> SubscribeAsync(string email, Guid? sourcePage, CancellationToken ct = default);
}