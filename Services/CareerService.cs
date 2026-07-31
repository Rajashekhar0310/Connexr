using Connexr_dev.Models;
using NPoco;
using Umbraco.Cms.Infrastructure.Persistence;

namespace Connexr_dev.Services;

public class CareerService : ICareerService
{
    private readonly IWebHostEnvironment _environment;
    private readonly IUmbracoDatabaseFactory _databaseFactory;
    private readonly IEmailService _emailService;

    public CareerService(
        IWebHostEnvironment environment,
        IUmbracoDatabaseFactory databaseFactory,
        IEmailService emailService)
    {
        _environment = environment;
        _databaseFactory = databaseFactory;
        _emailService = emailService;
    }

    public async Task<CareerResponse> SubmitApplicationAsync(CareerApplicationModel model)
    {
        try
        {
            if (model.Resume == null || model.Resume.Length == 0)
            {
                return new CareerResponse
                {
                    Success = false,
                    Message = "Please upload your resume."
                };
            }

            var extension = Path.GetExtension(model.Resume.FileName).ToLower();

            var allowed = new[] { ".pdf", ".doc", ".docx" };

            if (!allowed.Contains(extension))
            {
                return new CareerResponse
                {
                    Success = false,
                    Message = "Only PDF, DOC and DOCX files are allowed."
                };
            }

            var folder = Path.Combine(
                _environment.WebRootPath,
                "uploads",
                "resumes");

            if (!Directory.Exists(folder))
                Directory.CreateDirectory(folder);

            var fileName = Guid.NewGuid() + extension;

            var physicalPath = Path.Combine(folder, fileName);

            using (var stream = new FileStream(physicalPath, FileMode.Create))
            {
                await model.Resume.CopyToAsync(stream);
            }

            var resumePath = "/uploads/resumes/" + fileName;

            var dto = new CareerApplicationDto
            {
                JobTitle = model.JobTitle,
                FullName = model.FullName,
                Email = model.Email,
                Phone = model.Phone,
                CurrentLocation = model.CurrentLocation,
                Experience = model.Experience,
                CurrentCompany = model.CurrentCompany,
                LinkedIn = model.LinkedIn,
                CoverLetter = model.CoverLetter,
                ResumePath = resumePath,
                AppliedUtc = DateTime.UtcNow,
                Status = "New"
            };

            using var database = _databaseFactory.CreateDatabase();

            database.Insert(dto);

            await _emailService.SendHrNotificationAsync(model, resumePath);

            await _emailService.SendCandidateConfirmationAsync(model);

            return new CareerResponse
            {
                Success = true,
                Message = "Application submitted successfully."
            };
        }
        catch (Exception ex)
        {
            return new CareerResponse
            {
                Success = false,
                Message = ex.Message
            };
        }
    }

    public async Task<List<CareerApplicationDto>> GetApplicationsAsync(int page = 1, int pageSize = 10)
    {
        using var database = _databaseFactory.CreateDatabase();

        var sql = @"
        SELECT *
        FROM careerApplication
        ORDER BY appliedUtc DESC
        OFFSET @0 ROWS
        FETCH NEXT @1 ROWS ONLY";

        return await database.FetchAsync<CareerApplicationDto>(
            sql,
            (page - 1) * pageSize,
            pageSize);
    }
    public async Task<int> GetTotalApplicationsAsync()
    {
        using var database = _databaseFactory.CreateDatabase();

        return await database.ExecuteScalarAsync<int>(
            "SELECT COUNT(*) FROM careerApplication");
    }
    public async Task UpdateStatusAsync(int id, string status)
    {
        using var database = _databaseFactory.CreateDatabase();

        await database.ExecuteAsync(
            "UPDATE careerApplication SET status=@0 WHERE id=@1",
            status,
            id);
    }
}