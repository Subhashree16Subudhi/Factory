// Data/AppDbContext.cs
using Microsoft.EntityFrameworkCore;
using FactoryBackend.Models;

namespace FactoryBackend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Equipment> Equipment { get; set; }
        public DbSet<Metric> Metrics { get; set; } 
        public DbSet<MaintenanceLog> MaintenanceLogs { get; set; }
    }
}
