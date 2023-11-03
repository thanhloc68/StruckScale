using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;
using webapi.Data;
using webapi.Models;

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleController : Controller
    {
        private readonly ScaleInfo _dbContext;
        public RoleController(ScaleInfo dbContext)
        {
            _dbContext = dbContext;
        }
        [HttpGet]
        public async Task<IActionResult> List()
        {
            var list = await _dbContext.Roles.ToListAsync();
            return Ok(list);
        }
        [HttpPost]
        public async Task<ActionResult> CreateRoles([FromBody] Roles roles)
        {
            if (string.IsNullOrEmpty(roles.RolesName)) return BadRequest("Không được để trống");
            var existsRole = await _dbContext.Roles.FirstOrDefaultAsync(x => x.RolesName.ToLower() == roles.RolesName.ToLower());
            if (existsRole != null) return BadRequest("Quyền đã được tạo");
            var create = new Roles
            {
                RolesName = roles.RolesName
            };
            await _dbContext.AddAsync(create);
            await _dbContext.SaveChangesAsync();
            return Ok(create);
        }
        [HttpPut]
        public async Task<ActionResult> UpdateRoles(int? id, [FromBody] Roles roles)
        {
            try
            {
                if (id == null) return BadRequest("Không tìm thấy ID");
                var check = await _dbContext.Roles.FindAsync(id);
                if (check == null) return BadRequest();
                check.RolesName = roles.RolesName;
                _dbContext.Entry(check).State = EntityState.Modified;
                await _dbContext.SaveChangesAsync();
                return Ok(check);
            }
            catch (Exception)
            {
                throw;
            }
        }
        [HttpDelete]
        public async Task<ActionResult> DeleteRoles(int? id)
        {
            try
            {
                var check = await _dbContext.Roles.FirstOrDefaultAsync(x => x.Id == id);
                if (check == null) return BadRequest("Không hợp lệ");
                Roles? roles = await _dbContext.Roles.FindAsync(id);
                if (roles == null) return BadRequest("Không tìm thấy ID");
                _dbContext.Entry(roles).State = EntityState.Deleted;
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