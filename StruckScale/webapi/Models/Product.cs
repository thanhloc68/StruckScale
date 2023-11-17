using System.ComponentModel.DataAnnotations;

namespace webapi.Models
{
    public class Product
    {
        public int? id { get; set; }
        [Required(ErrorMessage = "Không được để rỗng")]
        public string? shortcutName { get; set; }
        [Required(ErrorMessage = "Không được để rỗng")]
        public string? name { get; set; }
        public bool? status { get; set; }
    }
}
