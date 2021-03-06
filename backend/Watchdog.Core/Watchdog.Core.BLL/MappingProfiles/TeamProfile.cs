using AutoMapper;
using System.Linq;
using Watchdog.Core.Common.DTO.Team;
using Watchdog.Core.DAL.Entities;

namespace Watchdog.Core.BLL.MappingProfiles
{
    public class TeamProfile : Profile
    {
        public TeamProfile()
        {
            CreateMap<Team, TeamDto>()
                .ForMember(t => t.Members,
                    opt => opt.MapFrom(t => t.TeamMembers.Select(tm => tm.Member)));
            CreateMap<TeamDto, Team>();

            CreateMap<Team, TeamOptionDto>();

            CreateMap<NewTeamDto, Team>();
            CreateMap<UpdateTeamDto, Team>();

            CreateMap<TeamMember, TeamMemberDto>();
            CreateMap<TeamMemberDto, TeamMember>();
        }
    }
}
