using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Newtonsoft.Json;
using System;
using Watchdog.Core.DAL.Entities;
using Watchdog.Core.DAL.Entities.AlertSettings;

namespace Watchdog.Core.DAL.Context.EntityConfigurations
{
    public class ApplicationConfig : IEntityTypeConfiguration<Application>
    {
        public void Configure(EntityTypeBuilder<Application> builder)
        {
            builder.Property(a => a.Name)
                   .HasMaxLength(128)
                   .IsRequired();


            builder.Property(a => a.AlertSettings)
                   .HasConversion(
                        v => JsonConvert.SerializeObject(v, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore }),
                        v => JsonConvert.DeserializeObject<AlertSetting>(v, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore })
                        );

            builder.HasMany(a => a.Environments)
                   .WithOne(e => e.Application)
                   .HasForeignKey(e => e.ApplicationId);

            builder.HasMany(a => a.LoaderTests)
                   .WithOne(t => t.Application)
                   .HasForeignKey(t => t.ApplicationId)
                   .OnDelete(DeleteBehavior.SetNull);

            builder.Property(a => a.CreatedAt)
                .HasConversion(
                     v => v,
                     v => DateTime.SpecifyKind(v, DateTimeKind.Utc)
                     );

            builder.HasMany(a => a.Recipients)
                   .WithMany(u => u.AlertSubscriptions);
        }
    }
}
