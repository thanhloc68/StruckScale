namespace webapi.Models
{
    public class struckScaleInfo
    {
        public int id { get; set; }
        public string? carNumber { get;set; }
        public string? product { get;set; }
        public string? customer { get;set; }
        public string? documents { get; set; }
        public double? firstScale { get;set; }
        public double? secondScale { get;set; }
        public double? result { get;set; }
        public DateTime? firstScaleDate { get;set; }
        public DateTime? secondScaleDate { get;set; }
        public string? notes { get; set; }

    }
}
