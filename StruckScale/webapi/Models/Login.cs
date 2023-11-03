using System.ComponentModel.DataAnnotations;

namespace webapi.Models
{
    public class Login
    {
        [Required]
        public string? userName { get; set; }
        [Required]
        public string? password { get; set; }
        public string RefreshToken { get; set; } = string.Empty;
        public DateTime TokenCreated { get; set; } = DateTime.Now;
        public DateTime TokenExpired { get; set; }
    }
}
