using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using webapi.Data;
using webapi.Models;

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : Controller
    {
        private readonly ScaleInfo dbContext;
        public ProductController (ScaleInfo dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet("get")]
        public async Task<IActionResult> GetProduct()
        {
            var list = await dbContext.Product.AsNoTracking().ToListAsync();
            return Ok(list);
        }
        [HttpPost("add-product")]
        public async Task<IActionResult> CreateProduct(Product products)
        {
            var resultsProduct = new Product()
            {
                shortcutName = products.shortcutName,
                name = products.name,
            };
            await dbContext.Product.AddAsync(resultsProduct);
            await dbContext.SaveChangesAsync();
            return Ok(resultsProduct);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] Product products)
        {
            try
            {
                var check = await dbContext.Product.FindAsync(id);
                if (check != null)
                {
                    check.shortcutName = products.shortcutName;
                    check.name = products.name;
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
        public async Task<IActionResult> DeleteProduct(int? id)
        {
            try
            {
                var check = dbContext.Product.Where(x => x.id == id).FirstOrDefault();
                if (check != null)
                {
                    Product product = await dbContext.Product.FindAsync(id);
                    dbContext?.Product.Remove(product);
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
