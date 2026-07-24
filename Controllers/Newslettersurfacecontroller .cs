using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Core.Cache;
using Umbraco.Cms.Core.Logging;
using Umbraco.Cms.Core.Routing;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Core.Web;
using Umbraco.Cms.Infrastructure.Persistence;
using Umbraco.Cms.Web.Website.Controllers;
using Connexr_dev.Models;
using Connexr_dev.Services;

namespace Connexr_dev.Controllers;

public class NewsletterSurfaceController : SurfaceController
{
    private readonly INewsletterService _newsletter;

    public NewsletterSurfaceController(
        IUmbracoContextAccessor umbracoContextAccessor,
        IUmbracoDatabaseFactory databaseFactory,
        ServiceContext services,
        AppCaches appCaches,
        IProfilingLogger profilingLogger,
        IPublishedUrlProvider publishedUrlProvider,
        INewsletterService newsletter)
        : base(umbracoContextAccessor, databaseFactory, services,
               appCaches, profilingLogger, publishedUrlProvider)
    {
        _newsletter = newsletter;
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Subscribe(NewsletterFormModel model)
    {
        // Bots fill the hidden field. Accept silently so they don't retry.
        if (!string.IsNullOrWhiteSpace(model.Company))
        {
            TempData["NewsletterMessage"] = "Thanks — you're on the list.";
            return RedirectToCurrentUmbracoPage();
        }

        if (!ModelState.IsValid)
        {
            TempData["NewsletterMessage"] =
                ModelState.Values.SelectMany(v => v.Errors)
                          .Select(e => e.ErrorMessage)
                          .FirstOrDefault() ?? "Check the form and try again.";
            return RedirectToCurrentUmbracoPage();
        }

        var result = await _newsletter.SubscribeAsync(model.Email, model.SourcePage);

        TempData["NewsletterMessage"] = result switch
        {
            SubscribeResult.Added => "Thanks — you're on the list.",
            SubscribeResult.Duplicate => "You're already subscribed.",
            _ => "Something went wrong. Try again in a moment."
        };

        return RedirectToCurrentUmbracoPage();
    }
}