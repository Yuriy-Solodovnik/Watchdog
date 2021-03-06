using System.Collections.Generic;
using Watchdog.Core.DAL.Entities.Common;

namespace Watchdog.Core.DAL.Entities
{
    public class Dashboard : AuditEntity<int>
    {
        public Dashboard()
        {
            Tiles = new List<Tile>();
        }

        public string Name { get; set; }
        public string Icon { get; set; }

        public User User { get; set; }

        public int OrganizationId { get; set; }

        public Organization Organization { get; set; }

        public ICollection<Tile> Tiles { get; set; }
    }
}
