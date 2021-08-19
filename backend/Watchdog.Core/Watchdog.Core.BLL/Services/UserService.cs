﻿using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Watchdog.Core.BLL.Services.Abstract;
using Watchdog.Core.Common.DTO.Registration;
using Watchdog.Core.Common.DTO.User;
using Watchdog.Core.DAL.Context;
using Watchdog.Core.DAL.Entities;

namespace Watchdog.Core.BLL.Services
{
    public class UserService : BaseService, IUserService
    {
        public UserService(WatchdogCoreContext context, IMapper mapper) : base(context, mapper)
        {
        }

        public async Task<IEnumerable<UserDto>> SearchMembersNotInOrganizationAsync(int orgId, string memberEmail)
        {
            var members = await _context.Users
                .Include(u => u.Members)
                .Where(u => u.Email.Contains(memberEmail) && !u.Members.Any(m => m.OrganizationId == orgId))
                .ToListAsync();
            return _mapper.Map<IEnumerable<UserDto>>(members);
        }
        public async Task<UserDto> UpdateUserAsync(int userId, UpdateUserDto updateUserDto)
        {

            if (await _context.Users.AnyAsync(u => u.Email == updateUserDto.Email))
                throw new InvalidOperationException("Such email alreaby exists");
            var existedUser = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);

            var mergedUser = _mapper.Map(updateUserDto, existedUser);

            var updatedUser = _context.Update(mergedUser);
            await _context.SaveChangesAsync();

            return await GetUserByIdAsync(updatedUser.Entity.Id);
        }

        public async Task<UserDto> GetUserByIdAsync(int id)
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Id == id);
            return _mapper.Map<UserDto>(user);
        }

        public async Task<UserDto> GetUserByUidAsync(string uid)
        {
            var user = await _context.Users
                .SingleOrDefaultAsync(u => u.Uid == uid);
            return _mapper.Map<UserDto>(user);
        }

        public async Task<UserDto> CreateUserAsync(NewUserDto userDto)
        {
            if (await _context.Users.AnyAsync(u => u.Email == userDto.Email))
                throw new InvalidOperationException("Such email alreaby exists");
            var user = _mapper.Map<User>(userDto);

            var createdUser = _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return _mapper.Map<UserDto>(createdUser.Entity);
        }

        public async Task<ICollection<string>> GetUserUIdsByApplicationIdAsync(int applicationId)
        {
            var teams = _context.Teams
               .Include(t => t.ApplicationTeams)
               .Include(t => t.TeamMembers).ThenInclude(tm => tm.Member)
               .ThenInclude(m => m.User);

            var members = teams.Where(t => t.ApplicationTeams.Any(at => at.ApplicationId == applicationId))
                .SelectMany(t => t.TeamMembers)
                .Select(tm => tm.Member);

            var usersIds = await members.Select(m => m.User).Select(u => u.Uid).Distinct().ToListAsync();
            return usersIds;
        }
    }
}