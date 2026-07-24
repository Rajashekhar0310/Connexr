using Microsoft.Extensions.Logging;
using NPoco;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Events;
using Umbraco.Cms.Core.Migrations;
using Umbraco.Cms.Core.Notifications;
using Umbraco.Cms.Core.Scoping;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Infrastructure.Migrations;
using Umbraco.Cms.Infrastructure.Migrations.Upgrade;
using Umbraco.Cms.Infrastructure.Persistence.DatabaseAnnotations;

namespace Connexr_dev.Migrations;

// ---------------------------------------------------------------------------
// 1. Startup handler — runs the plan, then does nothing on every boot after.
// ---------------------------------------------------------------------------

public class RunNewsletterMigrations : INotificationAsyncHandler<UmbracoApplicationStartingNotification>
{
    private readonly ICoreScopeProvider _coreScopeProvider;
    private readonly IMigrationPlanExecutor _migrationPlanExecutor;
    private readonly IKeyValueService _keyValueService;
    private readonly IRuntimeState _runtimeState;

    public RunNewsletterMigrations(
        ICoreScopeProvider coreScopeProvider,
        IMigrationPlanExecutor migrationPlanExecutor,
        IKeyValueService keyValueService,
        IRuntimeState runtimeState)
    {
        _coreScopeProvider = coreScopeProvider;
        _migrationPlanExecutor = migrationPlanExecutor;
        _keyValueService = keyValueService;
        _runtimeState = runtimeState;
    }

    public async Task HandleAsync(
        UmbracoApplicationStartingNotification notification,
        CancellationToken cancellationToken)
    {
        // Don't touch the schema while Umbraco is installing or upgrading itself.
        if (_runtimeState.Level < RuntimeLevel.Run)
        {
            return;
        }

        var upgrader = new Upgrader(new NewsletterMigrationPlan());

        await upgrader.ExecuteAsync(
            _migrationPlanExecutor,
            _coreScopeProvider,
            _keyValueService);
    }
}

// ---------------------------------------------------------------------------
// 2. The plan — an ordered chain of steps, tracked in umbracoKeyValue.
// ---------------------------------------------------------------------------

public class NewsletterMigrationPlan : MigrationPlan
{
    public NewsletterMigrationPlan() : base("Newsletter")
    {
        // Future schema changes append another .To<T>("next-state-name").
        // Never edit or remove a state that has already shipped — Umbraco records
        // the last executed state and replays only from there.
        From(string.Empty)
            .To<AddNewsletterSubscriberTable>("newsletter-db-1.0.0");
    }
}

// ---------------------------------------------------------------------------
// 3. The migration itself, plus its frozen schema snapshot.
// ---------------------------------------------------------------------------

public class AddNewsletterSubscriberTable : AsyncMigrationBase
{
    private const string NewsletterTable = "newsletterSubscriber";

    public AddNewsletterSubscriberTable(IMigrationContext context) : base(context)
    {
    }

    protected override Task MigrateAsync()
    {
        Logger.LogDebug("Running migration {MigrationStep}", nameof(AddNewsletterSubscriberTable));

        if (TableExists(NewsletterTable) == false)
        {
            Create.Table<NewsletterSubscriberSchema>().Do();
        }
        else
        {
            Logger.LogDebug("The database table {DbTable} already exists, skipping.", NewsletterTable);
        }

        return Task.CompletedTask;
    }

    /// <summary>
    /// Immutable snapshot of the schema at THIS migration step. Umbraco's docs are
    /// explicit: don't reuse the runtime DTO here, and never edit this once deployed.
    /// </summary>
    [TableName(NewsletterTable)]
    [PrimaryKey("id", AutoIncrement = true)]
    [ExplicitColumns]
    public class NewsletterSubscriberSchema
    {
        [PrimaryKeyColumn(AutoIncrement = true, IdentitySeed = 1)]
        [Column("id")]
        public int Id { get; set; }

        [Column("email")]
        [Length(320)]
        [Index(IndexTypes.UniqueNonClustered, Name = "IX_newsletterSubscriber_email")]
        public string Email { get; set; } = string.Empty;

        [Column("sourcePageKey")]
        [NullSetting(NullSetting = NullSettings.Null)]
        public Guid? SourcePageKey { get; set; }

        [Column("subscribedUtc")]
        public DateTime SubscribedUtc { get; set; }

        [Column("isActive")]
        [Constraint(Default = "1")]
        public bool IsActive { get; set; }

        [Column("unsubscribedUtc")]
        [NullSetting(NullSetting = NullSettings.Null)]
        public DateTime? UnsubscribedUtc { get; set; }
    }
}