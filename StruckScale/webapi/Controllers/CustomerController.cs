using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using webapi.Data;
using webapi.Models;

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CustomerController : Controller
    {
        private readonly ScaleInfo _dbContext;
        public CustomerController(ScaleInfo dbContext)
        {
            _dbContext = dbContext;
        }
        [HttpGet("get")]
        public async Task<IActionResult> GetCustomer()
        {
            var list = await _dbContext.Customer.AsNoTracking().ToListAsync();
            return Ok(list);
        }
        [HttpPost("add-customer")]
        public async Task<IActionResult> CreateCustomer(Customer customers)
        {
            var resultsCustomer = new Customer()
            {
                shortcutName = customers.shortcutName,
                name = customers.name,
            };
            await _dbContext.Customer.AddAsync(resultsCustomer);
            await _dbContext.SaveChangesAsync();
            return Ok(resultsCustomer);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCustomer(int id, [FromBody] Customer customer)
        {
            try
            {
                var check = await _dbContext.Customer.FindAsync(id);
                if (check != null)
                {
                    check.shortcutName = customer.shortcutName;
                    check.name = customer.name;
                    _dbContext.Entry(check).State = EntityState.Modified;
                    await _dbContext.SaveChangesAsync();
                    return Ok(check);
                }
                else
                {
                    return NotFound();
                }
            }
            catch (Exception ex)
            {
                ex.Message.ToString();
            }
            return Ok();
        }
        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteCustomer(int? id)
        {
            try
            {
                var check = _dbContext.Customer.Where(x => x.id == id).FirstOrDefault();
                if (check != null)
                {
                    Customer? customers = await _dbContext.Customer.FindAsync(id);
                    if (customers == null) return NotFound();
                    _dbContext?.Customer.Remove(customers);
                    _dbContext?.SaveChanges();
                }
                else
                {
                    return NotFound();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return Ok();
        }
    }
}
