﻿using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SendGrid;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Watchdog.Core.BLL.Models;
using Watchdog.Core.BLL.Services.Abstract;
using Watchdog.Core.Common.DTO.Members;
using Watchdog.Core.DAL.Context;
using Watchdog.Core.DAL.Entities;

namespace Watchdog.Core.BLL.Services
{
    public class MemberService : BaseService, IMemberService
    {
        private readonly IEmailSendService _emailSendService;

        public MemberService(WatchdogCoreContext context, IMapper mapper, IEmailSendService emailSendService) : base(context, mapper)
        {
            _emailSendService = emailSendService;
        }

        public Task<Response> InviteMember(MemberDto memberDto)
        {
            ExampleTemplateData data = new()
            {
                Name = memberDto.User.FirstName,
                Subject = "Invitation letter"
            };
            return _emailSendService.SendAsync(memberDto.User.Email, data);
        }

        public async Task<MemberDto> AddMemberAsync(NewMemberDto memberDto)
        {
            var user = (await _context.Users.FirstOrDefaultAsync(u => u.Email == memberDto.Email)) ?? throw new KeyNotFoundException("User doesn't exist");
            var organization = (await _context.Organizations.FirstOrDefaultAsync(o => o.Id == memberDto.OrganizationId) ?? throw new KeyNotFoundException("Such organization doesn't exist"));

            if (organization.Members.Any(m=> m.UserId == user.Id))
            {
                throw new ArgumentException("This user already in organization");
            }

            var member = _mapper.Map<Member>(memberDto);

            member.User = user;

            await _context.Members.AddAsync(member);

            await _context.SaveChangesAsync();

            return _mapper.Map<MemberDto>(member);
        }

        public async Task DeleteMemberAsync(int id)
        {
            var result = await _context.Members.FindAsync(id) ?? throw new KeyNotFoundException("Member doesn't exist");
            _context.Members.Remove(result);
            await _context.SaveChangesAsync();
        }

        public async Task<ICollection<MemberDto>> GetMembersByOrganizationIdAsync(int id)
        {
            var members = await _context.Members.Where(m => m.OrganizationId == id)
                .Include(m => m.User)
                .Include(m => m.Team)
                .Include(m => m.Role)
                .ToListAsync();
            return _mapper.Map<ICollection<MemberDto>>(members);

        }

        public async Task<MemberDto> GetMemberByIdAsync(int id)
        {
            var member = await _context.Members.Include(m => m.User).FirstOrDefaultAsync(m => m.Id == id) ?? throw new KeyNotFoundException("Member doesn't exist");
            return _mapper.Map<MemberDto>(member);
        }

        public async Task<ICollection<MemberDto>> SearchMembersNotInTeamAsync(int teamId, string memberEmail)
        {
            var team = await _context.Teams.FirstOrDefaultAsync(t => t.Id == teamId);

            var members = await _context.Members
                .Include(m => m.User)
                .Where(m => m.User.Email.Contains(memberEmail) && !(m.TeamId == teamId) && m.OrganizationId == team.OrganizationId)
                .ToListAsync();
            return _mapper.Map<ICollection<MemberDto>>(members);
        }
        
        public async Task<MemberDto> UpdateMemberAsync(UpdateMemberDto member)        
        {
            var result = await _context.Members.Include(m => m.User).FirstOrDefaultAsync(m => m.Id == member.Id) ?? throw new KeyNotFoundException("Member doesn't exist");
            _context.Entry(result).CurrentValues.SetValues(member);

            await _context.SaveChangesAsync();
            return _mapper.Map<MemberDto>(result);
        }

        public async Task<IEnumerable<MemberDto>> GetInvitedMembers()
        {
            return _mapper.Map<IEnumerable<MemberDto>>(await _context.Members.Where(m => m.IsAccepted == false).ToListAsync());
        }

        public async Task<ICollection<MemberDto>> GetAllMembersAsync()
        {
            var members = await _context.Members
                .Include(m => m.User)
                .Include(m => m.Team)
                .Include(m => m.Role)
                .ToListAsync();
            return _mapper.Map<ICollection<MemberDto>>(members);
        }
    }
}