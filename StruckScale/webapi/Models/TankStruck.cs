using System.ComponentModel.DataAnnotations;
using webapi.Data;

namespace webapi.Models
{
    public class TankStrucks
    {
        public int id { get; set; }
        [Required]
        public string? sourceOfGoods { get; set; }
        public int? requestedVolume { get; set; }
        public int? pumpVolume { get; set; }
        public DateTime? startTimePump { get; set; }
        public DateTime? endTimePump { get; set; }
        public DateTime? createDate { get; set; }
        public int processing { get; set; }
        public int struckID { get; set; }
    }
}
