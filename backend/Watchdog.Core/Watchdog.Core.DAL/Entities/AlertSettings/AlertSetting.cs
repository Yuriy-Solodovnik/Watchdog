namespace Watchdog.Core.DAL.Entities.AlertSettings
{
    public class AlertSetting
    {
        public AlertCategory AlertCategory { get; set; }
        /// <summary>
        /// Will be not null only if AlertCategory is Special
        /// </summary>
        public SpecialAlertSetting SpecialAlertSetting { get; set; }
    }

}
