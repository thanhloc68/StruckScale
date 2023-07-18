using Microsoft.EntityFrameworkCore;
using webapi.Models;

namespace webapi.Data
{
    public class scaleInfo : DbContext
    {
        public scaleInfo(DbContextOptions<scaleInfo> options):base(options) { }

        public DbSet<struckScaleInfo> info { get; set; }
    }
}
