using System.ComponentModel.DataAnnotations;

namespace webapi.Models
{
    public class Roles
    {
        public int? Id { get; set; }
        [Required(ErrorMessage = "Không được để rỗng")]
        public string? RolesName { get; set; }
    }
}
