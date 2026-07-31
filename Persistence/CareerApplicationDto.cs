using NPoco;
using Umbraco.Cms.Infrastructure.Persistence.DatabaseAnnotations;

namespace Connexr_dev.Models;

[TableName("careerApplication")]
[PrimaryKey("id", AutoIncrement = true)]
[ExplicitColumns]
public class CareerApplicationDto
{
    [PrimaryKeyColumn(AutoIncrement = true, IdentitySeed = 1)]
    [Column("id")]
    public int Id { get; set; }

    [Column("jobTitle")]
    public string JobTitle { get; set; } = string.Empty;

    [Column("fullName")]
    public string FullName { get; set; } = string.Empty;

    [Column("email")]
    public string Email { get; set; } = string.Empty;

    [Column("phone")]
    public string Phone { get; set; } = string.Empty;

    [Column("currentLocation")]
    [NullSetting(NullSetting = NullSettings.Null)]
    public string? CurrentLocation { get; set; }

    [Column("experience")]
    [NullSetting(NullSetting = NullSettings.Null)]
    public string? Experience { get; set; }

    [Column("currentCompany")]
    [NullSetting(NullSetting = NullSettings.Null)]
    public string? CurrentCompany { get; set; }

    [Column("linkedIn")]
    [NullSetting(NullSetting = NullSettings.Null)]
    public string? LinkedIn { get; set; }

    [Column("coverLetter")]
    [SpecialDbType(SpecialDbTypes.NTEXT)]
    [NullSetting(NullSetting = NullSettings.Null)]
    public string? CoverLetter { get; set; }

    [Column("resumePath")]
    public string ResumePath { get; set; } = string.Empty;

    [Column("appliedUtc")]
    public DateTime AppliedUtc { get; set; }

    [Column("status")]
    public string Status { get; set; } = "New";
    public string? Notes { get; set; }
}