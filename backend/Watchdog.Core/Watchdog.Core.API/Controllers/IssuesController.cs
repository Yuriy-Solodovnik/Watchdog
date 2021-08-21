﻿using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using Watchdog.Core.BLL.Services.Abstract;
using Watchdog.Core.Common.DTO.Issue;
using Watchdog.Core.Common.Models.Issue;

namespace Watchdog.Core.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class IssuesController : ControllerBase
    {
        private readonly IIssueService _issueService;

        public IssuesController(IIssueService issueService)
        {
            _issueService = issueService;
        }

        [HttpGet("info")]
        public async Task<ActionResult<ICollection<IssueInfoDto>>> GetIssuesInfoAsync()
        {
            var issues = await _issueService.GetIssuesInfoAsync();
            return Ok(issues);
        }

        [HttpPut]
        public async Task<ActionResult> UpdateAssignee(UpdateAssigneeDto assigneeDto)
        {
            await _issueService.UpdateAssigneeAsync(assigneeDto);
            return Ok(); 
        }

        [HttpGet("message/{id}")]
        public async Task<ActionResult<IssueMessage>> GetEventMessageByIdAsync(string id)
        {
            var issueMessage = await _issueService.GetEventMessageByIdAsync(id);
            return Ok(issueMessage);
        }        
        
        [HttpGet("messagesByParent/{id}")]
        public async Task<ActionResult<IssueMessage>> GetEventMessagesByIssueIdAsync(int id)
        {
            var issueMessages = await _issueService.GetEventMessagesByIssueIdAsync(id);
            return Ok(issueMessages);
        }
    }
}