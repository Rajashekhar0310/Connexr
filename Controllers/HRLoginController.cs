using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Web.Common.Controllers;
using Umbraco.Cms.Core.Security;
using Umbraco.Cms.Web.Common.Security;

public class HRLoginController : SurfaceController
{
    private readonly IMemberSignInManager _memberSignInManager;

    public HRLoginController(
        IUmbracoContextAccessor umbracoContextAccessor,
        IUmbracoDatabaseFactory databaseFactory,
        ServiceContext services,
        AppCaches appCaches,
        IProfilingLogger profilingLogger,
        IPublishedUrlProvider publishedUrlProvider,
        IMemberSignInManager memberSignInManager)
        : base(
            umbracoContextAccessor,
            databaseFactory,
            services,
            appCaches,
            profilingLogger,
            publishedUrlProvider)
    {
        _memberSignInManager = memberSignInManager;
    }

    [HttpPost]
    public async Task<IActionResult> Login(string username, string password)
    {
        var result = await _memberSignInManager.PasswordSignInAsync(
            username,
            password,
            false,
            false);

        if (result.Succeeded)
        {
            return Redirect("/HRApplications");
        }

        TempData["LoginError"] = "Invalid username or password.";
        return Redirect("/hr-login");
    }
}