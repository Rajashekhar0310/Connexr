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

public class RunCareerMigrations : INotificationAsyncHandler<UmbracoApplicationStartingNotification>
{
    private readonly ICoreScopeProvider _coreScopeProvider;
    private readonly IMigrationPlanExecutor _migrationPlanExecutor;
    private readonly IKeyValueService _keyValueService;
    private readonly IRuntimeState _runtimeState;

    public RunCareerMigrations(
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
        if (_runtimeState.Level < RuntimeLevel.Run)
            return;

        var upgrader = new Upgrader(new CareerMigrationPlan());

        await upgrader.ExecuteAsync(
            _migrationPlanExecutor,
            _coreScopeProvider,
            _keyValueService);
    }
}

public class CareerMigrationPlan : MigrationPlan
{
    public CareerMigrationPlan() : base("Career")
    {
        From(string.Empty)
            .To<AddCareerApplicationTable>("career-db-1.0.0");
    }
}

public class AddCareerApplicationTable : AsyncMigrationBase
{
    private const string CareerTable = "careerApplication";

    public AddCareerApplicationTable(IMigrationContext context)
        : base(context)
    {
    }

    protected override Task MigrateAsync()
    {
        Logger.LogDebug(
            "Running migration {MigrationStep}",
            nameof(AddCareerApplicationTable));

        if (TableExists(CareerTable) == false)
        {
            Create.Table<CareerApplicationSchema>().Do();
        }
        else
        {
            Logger.LogDebug(
                "Table {Table} already exists.",
                CareerTable);
        }

        return Task.CompletedTask;
    }

    [TableName(CareerTable)]
    [PrimaryKey("id", AutoIncrement = true)]
    [ExplicitColumns]
    public class CareerApplicationSchema
    {
        [PrimaryKeyColumn(AutoIncrement = true, IdentitySeed = 1)]
        [Column("id")]
        public int Id { get; set; }

        [Column("jobTitle")]
        [Length(200)]
        public string JobTitle { get; set; } = "";

        [Column("fullName")]
        [Length(200)]
        public string FullName { get; set; } = "";

        [Column("email")]
        [Length(320)]
        public string Email { get; set; } = "";

        [Column("phone")]
        [Length(50)]
        public string Phone { get; set; } = "";

        [Column("currentLocation")]
        [NullSetting(NullSetting = NullSettings.Null)]
        [Length(150)]
        public string? CurrentLocation { get; set; }

        [Column("experience")]
        [NullSetting(NullSetting = NullSettings.Null)]
        [Length(100)]
        public string? Experience { get; set; }

        [Column("currentCompany")]
        [NullSetting(NullSetting = NullSettings.Null)]
        [Length(200)]
        public string? CurrentCompany { get; set; }

        [Column("linkedIn")]
        [NullSetting(NullSetting = NullSettings.Null)]
        [Length(500)]
        public string? LinkedIn { get; set; }

        [Column("coverLetter")]
        [SpecialDbType(SpecialDbTypes.NTEXT)]
        [NullSetting(NullSetting = NullSettings.Null)]
        public string? CoverLetter { get; set; }

        [Column("resumePath")]
        [Length(500)]
        public string ResumePath { get; set; } = "";

        [Column("appliedUtc")]
        public DateTime AppliedUtc { get; set; }

        [Column("status")]
        [Length(50)]
        public string Status { get; set; } = "New";
    }
}