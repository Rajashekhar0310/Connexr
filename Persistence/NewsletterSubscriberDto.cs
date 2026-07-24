using NPoco;
using Umbraco.Cms.Infrastructure.Persistence.DatabaseAnnotations;

namespace Connexr_dev.Persistence;

/// <summary>
/// Runtime DTO used for reading/writing rows. Deliberately separate from the
/// schema snapshot inside AddNewsletterSubscriberTable — this one is free to
/// evolve, that one must stay frozen.
/// </summary>
[TableName("newsletterSubscriber")]
[PrimaryKey("id", AutoIncrement = true)]
[ExplicitColumns]
public class NewsletterSubscriberDto
{
    [PrimaryKeyColumn(AutoIncrement = true, IdentitySeed = 1)]
    [Column("id")]
    public int Id { get; set; }

    [Column("email")]
    public string Email { get; set; } = string.Empty;

    [Column("sourcePageKey")]
    public Guid? SourcePageKey { get; set; }

    [Column("subscribedUtc")]
    public DateTime SubscribedUtc { get; set; }

    [Column("isActive")]
    public bool IsActive { get; set; }

    [Column("unsubscribedUtc")]
    public DateTime? UnsubscribedUtc { get; set; }
}