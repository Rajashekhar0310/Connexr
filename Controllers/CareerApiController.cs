using Connexr_dev.Services;
using Microsoft.AspNetCore.Mvc;

namespace Connexr_dev.Controllers;

[ApiController]
[Route("api/career")]
public class CareerApiController : ControllerBase
{
    private readonly ICareerService _careerService;

    public CareerApiController(ICareerService careerService)
    {
        _careerService = careerService;
    }

    [HttpGet("applications")]
    public async Task<IActionResult> GetApplications()
    {
        var applications = await _careerService.GetApplicationsAsync();
        return Ok(applications);
    }
    [HttpGet("test")]
    public IActionResult Test()
    {
        return Ok("Career API is working");
    }
    [HttpPost("status")]
    public async Task<IActionResult> UpdateStatus(int id, string status)
    {
        await _careerService.UpdateStatusAsync(id, status);

        return Ok(new
        {
            success = true
        });
    }
}