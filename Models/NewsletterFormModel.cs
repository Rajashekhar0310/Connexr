using System.ComponentModel.DataAnnotations;

namespace Connexr_dev.Models;

public class NewsletterFormModel
{
    [Required(ErrorMessage = "Enter your email address.")]
    [EmailAddress(ErrorMessage = "That email address doesn't look right.")]
    [StringLength(320)]
    public string Email { get; set; } = string.Empty;

    /// <summary>Honeypot. Hidden from people via CSS, so anything here is a bot.</summary>
    public string? Company { get; set; }

    public Guid? SourcePage { get; set; }
}