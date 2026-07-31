using Connexr_dev.Models;
using Connexr_dev.Services;
using Microsoft.AspNetCore.Mvc;

namespace Connexr_dev.Controllers;

[ApiController]
[Route("career")]
public class CareerController : ControllerBase
{
    private readonly ICareerService _careerService;

    public CareerController(ICareerService careerService)
    {
        _careerService = careerService;
    }

    [HttpGet("applications")]
    public async Task<IActionResult> GetApplications()
    {
        var applications = await _careerService.GetApplicationsAsync();
        return Ok(applications);
    }

    [HttpPost("apply")]
    public async Task<IActionResult> Apply()
    {
        var form = await Request.ReadFormAsync();

        var model = new CareerApplicationModel
        {
            JobTitle = form["JobTitle"],
            FullName = form["FullName"],
            Email = form["Email"],
            Phone = form["Phone"],
            CurrentLocation = form["CurrentLocation"],
            Experience = form["Experience"],
            CurrentCompany = form["CurrentCompany"],
            LinkedIn = form["LinkedIn"],
            CoverLetter = form["CoverLetter"],
            Resume = form.Files["Resume"]
        };

        var result = await _careerService.SubmitApplicationAsync(model);

        return Ok(new
        {
            success = result.Success,
            message = result.Message
        });
    }
}