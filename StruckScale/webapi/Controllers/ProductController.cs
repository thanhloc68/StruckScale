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
        private readonly scaleInfo dbContext;
        public ProductController (scaleInfo dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet("get")]
        public async Task<IActionResult> GetProduct()
        {
            var list = await dbContext.product.ToListAsync();
            return Ok(list);
        }
        [HttpPost("add-product")]
        public async Task<IActionResult> CreateProduct(Product products)
        {
            var resultsProduct = new Product()
            {
                shortcutName = products.shortcutName,
                Name = products.Name,
            };
            await dbContext.product.AddAsync(resultsProduct);
            await dbContext.SaveChangesAsync();
            return Ok(resultsProduct);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] Product products)
        {
            try
            {
                var check = await dbContext.product.FindAsync(id);
                if (check != null)
                {
                    check.shortcutName = products.shortcutName;
                    check.Name = products.Name;
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
                var check = dbContext.product.Where(x => x.id == id).FirstOrDefault();
                if (check != null)
                {
                    Product product = await dbContext.product.FindAsync(id);
                    dbContext?.product.Remove(product);
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
