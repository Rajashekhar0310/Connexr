using Microsoft.Extensions.DependencyInjection;
using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;
using Umbraco.Cms.Core.Notifications;
using Umbraco.Extensions;
using Connexr_dev.Migrations;
using Connexr_dev.Services;

namespace Connexr_dev.Composers;

public class NewsletterComposer : IComposer
{
    public void Compose(IUmbracoBuilder builder)
    {
        builder.Services.AddScoped<INewsletterService, NewsletterService>();

        // Note: AddNotificationAsyncHandler, not AddNotificationHandler —
        // RunNewsletterMigrations implements INotificationAsyncHandler.
        builder.AddNotificationAsyncHandler<
            UmbracoApplicationStartingNotification,
            RunNewsletterMigrations>();
        builder.AddNotificationAsyncHandler<
    Umbraco.Cms.Core.Notifications.UmbracoApplicationStartingNotification,
    RunCareerMigrations>();
    }
}