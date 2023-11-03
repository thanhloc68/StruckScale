using System.ComponentModel.DataAnnotations;

namespace webapi.Models
{
    public class StruckScaleInfomation
    {
        public int struckId {get;set;}
        public int? ordinalNumber { get; set; }
        public string? carNumber { get; set; }
        public string? documents { get; set; }
        public string? product { get; set; }
        public string? customer { get; set; }
        public double? firstScale { get; set; }
        public double? secondScale { get; set; }
        public double? results { get; set; }
        public DateTime? firstScaleDate { get; set; }
        public DateTime? secondScaleDate { get; set; }
        public DateTime? createDate { get; set; }
        public string? styleScale { get; set; }
        public string? sourceOfGoods { get; set; }
        public int? requestedVolume { get; set; }
        public int? pumpVolume { get; set; }
        public DateTime? startTimePump { get; set; }
        public DateTime? endTimePump { get; set; }
        public int processing { get; set; }
        public string? notes { get; set; }
        public bool? isDone { get; set; }
    }
    public class ScaleInfomation
    {
        public int struckId { get; set; }
        public int? ordinalNumber { get; set; }
        public string? carNumber { get; set; }
        public string? documents { get; set; }
        public string? product { get; set; }
        public string? customer { get; set; }
        public double? firstScale { get; set; }
        public double? secondScale { get; set; }
        public double? results { get; set; }
        public DateTime? firstScaleDate { get; set; }
        public DateTime? secondScaleDate { get; set; }
        public DateTime? createDate { get; set; }
        public string? styleScale { get; set; }
        public string? notes { get; set; }
        public bool? isDone { get; set; }
    }
    public class TankPumpInfomation
    {
        public int struckId { get; set; }
        public int? ordinalNumber { get; set; }
        public string? carNumber { get; set; }
        public string? documents { get; set; }
        public string? product { get; set; }
        public string? customer { get; set; }
        public string? sourceOfGoods { get; set; }
        public int? requestedVolume { get; set; }
        public int? pumpVolume { get; set; }
        public DateTime? startTimePump { get; set; }
        public DateTime? endTimePump { get; set; }
        public int processing { get; set; }
        public string? notes { get; set; }
        public DateTime? createDate { get; set; }
    }
    public class AccountInfomation
    {
        [Required]
        public string? userName { get; set; }
        [Required]
        public string? password { get; set; }
        public int? RolesID { get; set; }
    }
}
