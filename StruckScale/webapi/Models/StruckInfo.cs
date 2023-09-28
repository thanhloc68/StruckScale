using System.ComponentModel.DataAnnotations;
using webapi.Data;

namespace webapi.Models
{
    public class StruckInfo
    {
        public int id { get; set; }
        public int? ordinalNumber { get; set; }
        [Required]
        public string? carNumber { get; set; }
        [Required]
        public string? product { get; set; }
        [Required]
        public string? customer { get; set; }
        [Required]
        public string? documents { get; set; }
        public bool? isDel { get; set; }
        public string? notes { get; set; }
        public DateTime? createDate { get; set; }
    }
}
