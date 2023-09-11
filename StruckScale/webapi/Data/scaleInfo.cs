using Microsoft.EntityFrameworkCore;
using webapi.Models;

namespace webapi.Data
{
    public class ScaleInfo : DbContext
    {
        public ScaleInfo(DbContextOptions<ScaleInfo> options):base(options) { }

        public DbSet<StruckInfo> StruckInfo { get; set; }
        public DbSet<StruckScales> StruckScale { get; set; }
        public DbSet<TankStruck> TankStrucks { get; set; }
        public DbSet<Customer> Customer { get; set; }
        public DbSet<Product> Product { get; set; }
    }
}
