using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace Connexr_dev.Models
{
    public class CareerApplicationModel
    {
        public int Id { get; set; }

        public string JobTitle { get; set; } = string.Empty;

        [Required(ErrorMessage = "Full Name is required")]
        [StringLength(100)]
        public string FullName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Phone Number is required")]
        [Phone]
        public string Phone { get; set; } = string.Empty;

        public string? CurrentLocation { get; set; }

        public string? Experience { get; set; }

        public string? CurrentCompany { get; set; }

        [Url]
        public string? LinkedIn { get; set; }

        public string? CoverLetter { get; set; }

        [Required(ErrorMessage = "Resume is required")]
        public IFormFile? Resume { get; set; }

        public string? ResumePath { get; set; }

        public DateTime AppliedDate { get; set; } = DateTime.Now;

        public string Status { get; set; } = "New";
    }
}