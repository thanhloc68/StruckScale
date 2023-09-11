using webapi.Data;

namespace webapi.Models
{
    public class TankStruck
    {
        public int id { get; set; }
        public int? requestedVolume { get; set; }
        public int? pumpVolume { get; set; }
        public DateTime? startTimePump { get; set; }
        public DateTime? endTimePump { get; set; }
        public DateTime? createDate{ get; set; }
    }
}
