using Watchdog.Models.Shared.Analytics.LoaderTestAnalytics;

namespace Watchdog.Core.Common.DTO.LoaderTest.Analytics
{
    public class LoaderTestAnalyticsDto
    {
        public int TestId { get; set; }
        public int RequestId { get; set; }
        public ResponseTimesDto ResponseTimes { get; set; }
        public ResponseCounts ResponseCounts { get; set; }
        public Bandwidth Bandwidth { get; set; }
        public string RequestUrl { get; set; }
    }
}
