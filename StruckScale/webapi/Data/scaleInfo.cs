using Microsoft.EntityFrameworkCore;
using webapi.Models;

namespace webapi.Data
{
    public class scaleInfo : DbContext
    {
        public scaleInfo(DbContextOptions<scaleInfo> options):base(options) { }

        public DbSet<struckScaleInfo> info { get; set; }
        public DbSet<Customer> customer { get; set; }
        public DbSet<Product> product { get; set; }


    }
}
