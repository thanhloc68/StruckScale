using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using webapi.Data;
using webapi.Models;

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : Controller
    {
        private readonly scaleInfo dbContext;
        public CustomerController(scaleInfo dbContext)
        {
            this.dbContext = dbContext;
        }
        [HttpGet("get")]
        public async Task<IActionResult> GetCustomer()
        {
            var list = await dbContext.customer.ToListAsync();
            return Ok(list);
        }
        [HttpPost("add-customer")]
        public async Task<IActionResult> CreateCustomer(Customer customers)
        {
            var resultsCustomer = new Customer()
            {
                shortcutName = customers.shortcutName,
                Name = customers.Name,
            };
            await dbContext.customer.AddAsync(resultsCustomer);
            await dbContext.SaveChangesAsync();
            return Ok(resultsCustomer);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCustomer(int id, [FromBody] Customer customer)
        {
            try
            {
                var check = await dbContext.customer.FindAsync(id);
                if (check != null)
                {
                    check.shortcutName = customer.shortcutName;
                    check.Name = customer.Name;
                    await dbContext.SaveChangesAsync();
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
                var check = dbContext.customer.Where(x => x.id == id).FirstOrDefault();
                if (check != null)
                {
                    Customer customers = await dbContext.customer.FindAsync(id);
                    dbContext?.customer.Remove(customers);
                    dbContext?.SaveChanges();
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
