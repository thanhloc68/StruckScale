using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using webapi.Data;
using webapi.Models;

namespace webapi.Helpers
{
    public class JwtService
    {
        private readonly IConfiguration _config;
        private readonly ScaleInfo _dbContext;
        public JwtService(IConfiguration configuration, ScaleInfo dbcontext)
        {
            _config = configuration;
            _dbContext = dbcontext;
        }
        public string generate(Accounts accounts)
        {
            var rolesInfo = _dbContext.Roles.FirstOrDefault(x => x.Id == accounts.rolesID);
            var role = _dbContext.Account.Where(x => x.Id == accounts.Id).Select(x => new
            {
                x.userName,
                x.password,
                rolesName = rolesInfo != null ? rolesInfo.RolesName : null
            }).FirstOrDefault();
            if (role != null)
            {
                var secureKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["AppSettings:Key"]));
                List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name,accounts.userName),
                new Claim(ClaimTypes.Role,role.rolesName),
            };
                var credentials = new SigningCredentials(secureKey, SecurityAlgorithms.HmacSha256Signature);
                var expires = DateTime.UtcNow.AddSeconds(10); // Token will expire in 8 hour, adjust as needed
                var securityToken = new JwtSecurityToken(
                   issuer: _config["AppSettings:ValidIssuer"],
                   audience: _config["AppSettings:ValidAudience"],
                   claims: claims,
                   notBefore: DateTime.UtcNow,
                   expires: expires,
                   signingCredentials: credentials
               );
                return new JwtSecurityTokenHandler().WriteToken(securityToken);
            }
            else
            {
                return null;
            }
        }
    }
}
