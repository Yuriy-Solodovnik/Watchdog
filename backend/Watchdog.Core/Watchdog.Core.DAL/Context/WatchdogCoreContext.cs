using Microsoft.EntityFrameworkCore;
using Watchdog.Core.DAL.Entities;

namespace Watchdog.Core.DAL.Context
{
    public class WatchdogCoreContext : DbContext
    {
        public DbSet<Application> Applications { get; private set; }

        public DbSet<ApplicationTeam> ApplicationTeams { get; private set; }

        public DbSet<Dashboard> Dashboards { get; private set; }

        public DbSet<Environment> Environments { get; private set; }

        public DbSet<Member> Members { get; private set; }

        public DbSet<Organization> Organizations { get; private set; }

        public DbSet<Platform> Platforms { get; private set; }

        public DbSet<Role> Roles { get; private set; }
        
        public DbSet<Issue> Issues { get; set; }

        public DbSet<EventMessage> EventMessages { get; set; }

        public DbSet<Team> Teams { get; private set; }

        public DbSet<TeamMember> TeamMembers { get; private set; }

        public DbSet<Tile> Tiles { get; private set; }

        public DbSet<User> Users { get; private set; }

        public DbSet<AssigneeMember> AssigneeMembers { get; private set; }

        public DbSet<AssigneeTeam> AssigneeTeams { get; private set; }

        public DbSet<LoaderTest> LoaderTests { get; private set; }

        public DbSet<LoaderRequest> LoaderRequests { get; private set; }

        public WatchdogCoreContext(DbContextOptions<WatchdogCoreContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Configure();
            modelBuilder.Seed();
        }
    }
}
