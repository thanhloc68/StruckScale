using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Security.Cryptography;
using webapi.Data;
using webapi.Helpers;
using webapi.Models;

namespace webapi.Controllers
{
    [Route("/api/[controller]")]
    [ApiController]
    public class LoginController : Controller
    {
        private readonly ScaleInfo _dbContext;
        private readonly JwtService _jwtService;

        public LoginController(ScaleInfo dbContext, JwtService jwtService)
        {
            _dbContext = dbContext;
            _jwtService = jwtService;
        }
        [HttpGet]
        public async Task<ActionResult> Login(string? username, string? password)
        {
            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password)) return BadRequest("Tên đăng nhập và mật khẩu không được để trống.");
            var results = await _dbContext.Account.FirstOrDefaultAsync(x => x.userName == username && x.status == true);
            if (results == null) return BadRequest("Chưa có tài khoản");
            var passWordVerify = BCrypt.Net.BCrypt.Verify(password, results?.password);
            if (passWordVerify && results != null)
            {
                var jwt = _jwtService.generate(results);
                var refreshToken = GenerateRefreshToken();
                SetRefreshToken(refreshToken, results.Id);
                var option = new TokenModel
                {
                    AccessToken = jwt,
                    RefreshToken = refreshToken.Token
                };
                return Ok(option);
            }
            else
            {
                return BadRequest("Sai mật khẩu");
            }
        }
        [HttpPost("refresh-token")]
        public async Task<ActionResult<string>> RefreshToken(TokenModel model)
        {
            string? refreshToken = model.RefreshToken;
            if (string.IsNullOrEmpty(refreshToken))
            {
                return Unauthorized("Refresh token not provided");
            }
            var user = await _dbContext.Account.FirstOrDefaultAsync(x => x.RefreshToken == refreshToken);
            if (user == null || user.RefreshToken != refreshToken )
            {
                return Unauthorized("Invalid Refresh Token");
            }
            else if (user.TokenExpired < DateTime.Now)
            {
                return Unauthorized("Token Expired");
            }
            string token = _jwtService.generate(user);
            var newRefreshToken = GenerateRefreshToken();
            SetRefreshToken(newRefreshToken, user.Id);
            var option = new TokenModel
            {
                AccessToken = token,
                RefreshToken = newRefreshToken.Token
            };
            return Ok(option);
        }
        [HttpPost,Authorize]
        [Route("revoke")]
        public IActionResult Revoke(string? username)
        {
            //username = User.Identity?.Name;
            var user = _dbContext.Account.SingleOrDefault(u => u.userName == username);
            if (user == null) return BadRequest();
            user.RefreshToken = null;
            _dbContext.SaveChanges();
            return NoContent();
        }
        private RefreshToken GenerateRefreshToken()
        {
            var refreshToken = new RefreshToken
            {
                Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
                Expired = DateTime.Now.AddDays(7),
                Created = DateTime.Now
            };
            return refreshToken;
        }
        private void SetRefreshToken(RefreshToken newRefreshToken, int userId)
        {
            var user = _dbContext.Account.FirstOrDefault(u => u.Id == userId);
            if (user != null)
            {
                user.RefreshToken = newRefreshToken.Token;
                user.TokenCreated = newRefreshToken.Created;
                user.TokenExpired = newRefreshToken.Expired;
                var option = new TokenModel
                {
                    RefreshToken = user.RefreshToken,
                };
                _dbContext.Account.Entry(user).State = EntityState.Modified;
                _dbContext.SaveChanges();
            }
        }
    }
}
