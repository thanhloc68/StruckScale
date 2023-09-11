using webapi.Data;

namespace webapi.Models
{
    public class StruckInfo
    {
        public int id { get; set; }
        public int? ordinalNumber { get; set; }
        public string? carNumber { get; set; }
        public string? product { get; set; }
        public string? customer { get; set; }
        public string? documents { get; set; }
        public bool? isDel { get; set; }
        public string? notes { get; set; }
        public DateTime? createDate { get; set; }
    }
}
