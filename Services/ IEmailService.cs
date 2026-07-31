using Connexr_dev.Models;

namespace Connexr_dev.Services;

public interface IEmailService
{
    Task SendHrNotificationAsync(CareerApplicationModel model, string resumePath);

    Task SendCandidateConfirmationAsync(CareerApplicationModel model);
}