using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Watchdog.Core.BLL.Services.Abstract;
using Watchdog.Core.Common.DTO.Team;

namespace Watchdog.Core.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class TeamsController : ControllerBase
    {
        private readonly ITeamService _teamService;

        public TeamsController(ITeamService teamService)
        {
            _teamService = teamService;
        }

        [HttpGet("organization/{organizationId:int}")]
        public async Task<ActionResult<ICollection<TeamDto>>> GetAllAsync(int organizationId)
        {
            var teams = await _teamService.GetAllTeamsAsync(organizationId);
            return Ok(teams);
        }

        [HttpGet("organization/{organizationId:int}/options")]
        public async Task<ActionResult<ICollection<TeamOptionDto>>> GetTeamOptionsAsync(int organizationId)
        {
            var teams = await _teamService.GetTeamsOptionsByOrganizationIdAsync(organizationId);
            return Ok(teams);
        }
        [HttpGet("{teamId:int}")]
        public async Task<ActionResult<TeamDto>> Get(int teamId)
        {
            var team = await _teamService.GetTeamAsync(teamId);
            return Ok(team);
        }

        [HttpGet("organization/{organizationId:int}/member/{memberId:int}")]
        public async Task<ActionResult<TeamDto>> GetByMemberAsync(int organizationId, int memberId)
        {
            var team = await _teamService.GetMemberTeamsAsync(organizationId, memberId, true);
            return Ok(team);
        }

        [HttpGet("organization/{organizationId:int}/notMember/{memberId:int}")]
        public async Task<ActionResult<TeamDto>> GetNotByMemberAsync(int organizationId, int memberId)
        {
            var team = await _teamService.GetMemberTeamsAsync(organizationId, memberId, false);
            return Ok(team);
        }

        [HttpPost]
        public async Task<ActionResult<TeamDto>> CreateAsync(NewTeamDto newTeam)
        {
            var createdTeam = await _teamService.CreateTeamAsync(newTeam);
            return Ok(createdTeam);
        }

        [HttpPost("joinTeam")]
        public async Task<ActionResult<TeamDto>> AddMemberAsync(TeamMemberDto teamMember)
        {
            var updatedTeam = await _teamService.AddMemberToTeamAsync(teamMember);
            return Ok(updatedTeam);
        }

        [HttpPut("{teamId:int}")]
        public async Task<ActionResult<TeamDto>> UpdateAsync(int teamId, UpdateTeamDto updateDto)
        {
            var updateTeam = await _teamService.UpdateTeamAsync(teamId, updateDto);
            return Ok(updateTeam);
        }

        [HttpDelete("leaveTeam/{teamId:int}/member/{memberId:int}")]
        public async Task<ActionResult> LeaveFromTeamAsync(int teamId, int memberId)
        {
            var updatedTeam = await _teamService.LeaveTeamAsync(teamId, memberId);
            return Ok(updatedTeam);
        }
        
        [AllowAnonymous]
        [HttpGet("orgId/{orgId:int}/teamName/{teamName}")]
        public async Task<ActionResult<bool>> CheckTeamName(int orgId, string teamName)
        {
            var isUnique = await _teamService.IsTeamNameUniqueAsync(orgId, teamName);
            return Ok(isUnique);
        }

        [HttpDelete("{teamId:int}")]
        public async Task<ActionResult> DeleteAsync(int teamId)
        {
            await _teamService.DeleteTeamAsync(teamId);

            return NoContent();
        }

        [HttpGet("organization/{orgId:int}/assignee/")]
        public async Task<ActionResult<ICollection<TeamDto>>> GetAssigneeTeamsByOrganization(int orgId)
        {
            return Ok(await _teamService.GetTeamsForAssigneeByOrganizationIdAsync(orgId));
        }
    }
}
