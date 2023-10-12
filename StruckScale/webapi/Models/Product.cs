using System.ComponentModel.DataAnnotations;

namespace webapi.Models
{
    public class Product
    {
        public int? id { get; set; }
        [Required]
        public string? shortcutName { get; set; }
        [Required]
        public string? name { get; set; }
        public bool? status { get; set; }
    }
}
