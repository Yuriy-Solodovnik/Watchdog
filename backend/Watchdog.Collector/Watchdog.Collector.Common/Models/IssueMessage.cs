using System;

namespace Watchdog.Collector.Common.Models
{
    public class IssueMessage
    {
        public string Id { get; set; }
        public DateTime OccurredOn { get; set; }
        public IssueMessageDetails IssueDetails { get; set; }
    }
}