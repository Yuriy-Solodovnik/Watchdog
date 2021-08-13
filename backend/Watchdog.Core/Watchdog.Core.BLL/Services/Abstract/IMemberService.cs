﻿using System.Collections.Generic;
using System.Threading.Tasks;
using Watchdog.Core.Common.DTO.Member;

namespace Watchdog.Core.BLL.Services.Abstract
{
    public interface IMemberService
    {
        Task<MemberDto> GetMemberByIdAsync(int id);
        Task<ICollection<MemberDto>> GetMembersByOrganizationIdAsync(int id);
        Task<ICollection<MemberDto>> SearchMembersNotInTeamAsync(int teamId, string memberEmail);
        Task<ICollection<MemberDto>> GetAllMembersAsync();
        Task<MemberDto> CreateMemberAsync(MemberDto memberDto);
        Task<MemberDto> GetMemberByUserIdAndOrganizationIdAsync(int userId, int orgId);
    }
}
