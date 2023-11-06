using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using webapi.Data;
using webapi.Models;

namespace webapi.Controllers
{
    [Route("/api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AccountController : Controller
    {
        private readonly ScaleInfo _dbContext;
        public AccountController(ScaleInfo dbContext)
        {
            _dbContext = dbContext;
        }
        [HttpGet]
        public async Task<IActionResult> AccountList()
        {
            var list = await _dbContext.Account.ToListAsync();
            return Ok(list);
        }
        [HttpPost("Register")]
        public async Task<IActionResult> Register(Accounts accounts)
        {
            if (string.IsNullOrEmpty(accounts.userName) || string.IsNullOrEmpty(accounts.password)) return BadRequest("Dữ liệu đăng ký không hợp lệ.");
            var existAccount = await _dbContext.Account.FirstOrDefaultAsync(x => x.userName == accounts.userName);
            if (existAccount != null) return BadRequest("Tài khoản đã tồn tại");
            var resultAccount = new Accounts()
            {
                userName = accounts.userName,
                password = BCrypt.Net.BCrypt.HashPassword(accounts.password),
                status = accounts.status,
                rolesID = accounts.rolesID,
            };
            await _dbContext.Account.AddAsync(resultAccount);
            await _dbContext.SaveChangesAsync();
            return Ok(resultAccount);
        }
        [HttpPut("UpdateAccount/{id}")]
        public async Task<ActionResult> UpdateAccount(int? id, [FromBody] Accounts accounts)
        {
            try
            {
                if (id == null) return BadRequest("Lỗi");
                var check = await _dbContext.Account.FindAsync(id);
                if (check == null) return NotFound();
                check.password = BCrypt.Net.BCrypt.HashPassword(accounts.password);
                check.status = accounts.status;
                check.rolesID = accounts.rolesID;
                _dbContext.Entry(check).State = EntityState.Modified;
                await _dbContext.SaveChangesAsync();
                return Ok(check);
            }
            catch (Exception)
            {
                throw;
            }
        }
        [HttpDelete("DeleteAccount/{id}")]
        public async Task<ActionResult> DeleteAccount(int? id)
        {
            try
            {
                var userName = User.FindFirstValue(ClaimTypes.Name);
                var check = await _dbContext.Account.Where(x => x.Id == id).FirstOrDefaultAsync();
                var checkUserIdentity = await _dbContext.Account.Where(x => x.userName == userName).FirstOrDefaultAsync();
                if (check == null) return BadRequest("ID Không hợp lệ");
                if (checkUserIdentity == check) return BadRequest("Tài khoản đang sử dụng");
                Accounts? accounts = await _dbContext.Account.FindAsync(id);
                if (accounts == null) return NotFound();
                _dbContext.Entry(accounts).State = EntityState.Deleted;
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception)
            {
                throw;
            }
            return Ok();
        }
    }
}
