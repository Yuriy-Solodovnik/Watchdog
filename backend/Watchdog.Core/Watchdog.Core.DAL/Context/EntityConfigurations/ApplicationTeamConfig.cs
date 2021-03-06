using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Watchdog.Core.DAL.Entities;

namespace Watchdog.Core.DAL.Context.EntityConfigurations
{
    public class ApplicationTeamConfig : IEntityTypeConfiguration<ApplicationTeam>
    {
        public void Configure(EntityTypeBuilder<ApplicationTeam> builder)
        {
            builder.HasOne(at => at.Application)
                   .WithMany(a => a.ApplicationTeams)
                   .HasForeignKey(at => at.ApplicationId)
                   .OnDelete(DeleteBehavior.ClientCascade);

            builder.Property(at => at.IsFavorite)
                .HasDefaultValue(false);
        }
    }
}
