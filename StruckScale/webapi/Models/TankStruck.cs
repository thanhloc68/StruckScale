using webapi.Data;

namespace webapi.Models
{
    public class TankStrucks
    {
        public int id { get; set; }
        public string? sourceOfGoods { get; set; }
        public int? requestedVolume { get; set; }
        public int? pumpVolume { get; set; }
        public DateTime? startTimePump { get; set; }
        public DateTime? endTimePump { get; set; }
        public DateTime? createDate{ get; set; }
        public int struckID { get; set; }
    }
}
