using Microsoft.Extensions.Logging;
using Umbraco.Cms.Infrastructure.Scoping;
using Umbraco.Extensions;
using Connexr_dev.Persistence;

namespace Connexr_dev.Services;

public class NewsletterService : INewsletterService
{
    private readonly IScopeProvider _scopeProvider;
    private readonly ILogger<NewsletterService> _logger;

    public NewsletterService(IScopeProvider scopeProvider, ILogger<NewsletterService> logger)
    {
        _scopeProvider = scopeProvider;
        _logger = logger;
    }

    public Task<SubscribeResult> SubscribeAsync(
        string email, Guid? sourcePage, CancellationToken ct = default)
    {
        var normalised = email.Trim().ToLowerInvariant();

        try
        {
            using var scope = _scopeProvider.CreateScope();

            var query = scope.SqlContext.Sql()
                .SelectAll()
                .From<NewsletterSubscriberDto>()
                .Where<NewsletterSubscriberDto>(x => x.Email == normalised);

            var existing = scope.Database.FirstOrDefault<NewsletterSubscriberDto>(query);

            if (existing is not null)
            {
                if (existing.IsActive)
                {
                    scope.Complete();
                    return Task.FromResult(SubscribeResult.Duplicate);
                }

                // Re-subscribing after opting out reactivates the row.
                existing.IsActive = true;
                existing.UnsubscribedUtc = null;
                existing.SubscribedUtc = DateTime.UtcNow;
                scope.Database.Update(existing);
                scope.Complete();
                return Task.FromResult(SubscribeResult.Added);
            }

            scope.Database.Insert(new NewsletterSubscriberDto
            {
                Email = normalised,
                SourcePageKey = sourcePage,
                SubscribedUtc = DateTime.UtcNow,
                IsActive = true
            });

            scope.Complete();
            return Task.FromResult(SubscribeResult.Added);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Newsletter subscription failed.");
            return Task.FromResult(SubscribeResult.Failed);
        }
    }
}