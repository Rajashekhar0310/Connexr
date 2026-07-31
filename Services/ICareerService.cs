using Connexr_dev.Models;

namespace Connexr_dev.Services;

public interface ICareerService
{
    Task<CareerResponse> SubmitApplicationAsync(CareerApplicationModel model);

    Task<List<CareerApplicationDto>> GetApplicationsAsync(int page = 1, int pageSize = 10);
    Task<int> GetTotalApplicationsAsync();
}