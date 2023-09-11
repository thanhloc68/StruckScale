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
        private readonly ScaleInfo dbContext;
        public CustomerController(ScaleInfo dbContext)
        {
            this.dbContext = dbContext;
        }
        [HttpGet("get")]
        public async Task<IActionResult> GetCustomer()
        {
            var list = await dbContext.Customer.ToListAsync();
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
            await dbContext.Customer.AddAsync(resultsCustomer);
            await dbContext.SaveChangesAsync();
            return Ok(resultsCustomer);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCustomer(int id, [FromBody] Customer customer)
        {
            try
            {
                var check = await dbContext.Customer.FindAsync(id);
                if (check != null)
                {
                    check.shortcutName = customer.shortcutName;
                    check.name = customer.name;
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
                var check = dbContext.Customer.Where(x => x.id == id).FirstOrDefault();
                if (check != null)
                {
                    Customer customers = await dbContext.Customer.FindAsync(id);
                    dbContext?.Customer.Remove(customers);
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
