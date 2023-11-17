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
    public class ProductController : Controller
    {
        private readonly ScaleInfo _dbContext;
        public ProductController(ScaleInfo dbContext)
        {
            _dbContext = dbContext;
        }
        [HttpGet("get")]
        public async Task<IActionResult> GetProduct()
        {
            var list = await _dbContext.Product.AsNoTracking().ToListAsync();
            return Ok(list);
        }
        [HttpPost("add-product")]
        public async Task<IActionResult> CreateProduct(Product products)
        {
            var resultsProduct = new Product()
            {
                shortcutName = products.shortcutName,
                name = products.name,
                status = products.status
            };
            await _dbContext.Product.AddAsync(resultsProduct);
            await _dbContext.SaveChangesAsync();
            return Ok(resultsProduct);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] Product products)
        {
            try
            {
                var check = await _dbContext.Product.FindAsync(id);
                if (check != null)
                {
                    check.shortcutName = products.shortcutName;
                    check.name = products.name;
                    check.status = products.status;
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
        public async Task<IActionResult> DeleteProduct(int? id)
        {
            try
            {
                var check = _dbContext.Product.Where(x => x.id == id).FirstOrDefault();
                if (check == null) return NotFound();
                Product? _product = await _dbContext.Product.FindAsync(id);
                if (_product == null) return NotFound(); ;
                _dbContext?.Product.Remove(_product);
                _dbContext?.SaveChanges();
            }
            catch (Exception)
            {
                throw;
            }
            return Ok();
        }
    }
}
