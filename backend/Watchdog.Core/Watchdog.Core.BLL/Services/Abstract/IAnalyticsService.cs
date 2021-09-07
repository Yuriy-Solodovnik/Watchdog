using System.Collections.Generic;
using System.Threading.Tasks;
using Watchdog.Core.Common.DTO.Application;
using Watchdog.Models.Shared.Analytics;

namespace Watchdog.Core.BLL.Services.Abstract
{
    public interface IAnalyticsService
    {
        Task<ICollection<ResponseInfo>> GetResponsesInfo(ApplicationDto[] applications, int count);
    }
}