using System.ComponentModel.DataAnnotations;

namespace webapi.Models
{
    public class Login
    {
        [Required(ErrorMessage = "Không được để rỗng")]
        public string? userName { get; set; }
        [Required(ErrorMessage = "Không được để rỗng")]
        public string? password { get; set; }
        public string RefreshToken { get; set; } = string.Empty;
        public DateTime TokenCreated { get; set; } = DateTime.Now;
        public DateTime TokenExpired { get; set; }
    }
}
