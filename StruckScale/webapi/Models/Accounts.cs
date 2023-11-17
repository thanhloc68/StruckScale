using System.ComponentModel.DataAnnotations;

namespace webapi.Models
{
    public class Accounts
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Không được để rỗng")]
        public string? userName { get; set; }
        [Required(ErrorMessage = "Không được để rỗng")]
        public string? password { get; set; }
        public bool? status { get; set; }
        public int? rolesID { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? TokenCreated { get; set; }
        public DateTime? TokenExpired { get; set; }
    }
}
