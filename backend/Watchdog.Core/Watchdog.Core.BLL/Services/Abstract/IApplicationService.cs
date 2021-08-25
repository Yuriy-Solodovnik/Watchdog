﻿using System.Collections.Generic;
using System.Threading.Tasks;
using Watchdog.Core.Common.DTO.Application;
using Watchdog.Core.Common.DTO.ApplicationTeam;

namespace Watchdog.Core.BLL.Services.Abstract
{
    public interface IApplicationService
    {
        Task<ApplicationDto> CreateAppAsync(NewApplicationDto dto);
        Task<ICollection<ApplicationDto>> GetAppsByOrganizationIdAsync(int organizationId);
        Task<ICollection<ApplicationTeamDto>> GetAppsByTeamIdAsync(int teamId);
        Task<ICollection<ApplicationDto>> SearchAppsNotInTeamAsync(int teamId, string teamName);
        Task<ApplicationTeamDto> AddAppTeamAsync(NewApplicationTeamDto appTeam);
        Task<bool> UpdateFavoriteStateAsync(int appTeamId, bool state);
        Task RemoveAppTeam(int appTeamId);
        Task<ApplicationDto> GetApplicationByIdAsync(int appId);
        Task<ApplicationDto> UpdateApplicationAsync(int appId, UpdateApplicationDto updateAppDto);
        Task DeleteApplicationAsync(int appId);
        Task<bool> IsProjectNameValid(string projectName, int organizationId);
    }
}
