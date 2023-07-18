using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using webapi.Data;
using webapi.Models;
using webapi.Wrapper;

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        private readonly scaleInfo dbContext;
        public HomeController(scaleInfo dbContext)
        {
            this.dbContext = dbContext;
        }
        [HttpGet("get")]
        public async Task<IActionResult> GetList(int pg = 1, int pageSize = 10)
        {
            var list = await dbContext.info.OrderByDescending(x=>x.firstScaleDate).ToListAsync();
            var totalCount = list.Count;
            var totalPages = (int)Math.Ceiling((decimal)totalCount / pageSize);
            var listPerPage = list.Skip((pg - 1) * pageSize).Take(pageSize).ToList();
            return Ok(new PagedResponse<List<struckScaleInfo>>(listPerPage, totalCount, pg, pageSize));
        }
        [HttpGet("detail/{id}")]
        public async Task<IActionResult> Detail(int id)
        {
            var list = await dbContext.info.FindAsync(id);
            return Ok(list);
        }
        [HttpGet("GetDataByDate/{dateTimes}")]
        public async Task<IActionResult> GetDataByDate(string? dateTimes)
        {
            if (dateTimes != null)
            {
                string[] date = dateTimes.Split(" - ");
                DateTime startDate = DateTime.ParseExact(date[0],"dd-MM-yyyy", null);
                DateTime endDate = DateTime.ParseExact(date[1], "dd-MM-yyyy", null);
                var getDate = await dbContext.info.Where(x => x.firstScaleDate >= startDate && x.secondScaleDate <= endDate).ToListAsync();
                return Ok(getDate);
            }
            return null;
        }
        [HttpGet("search/{search}")]
        public IActionResult Search(string search)
        {
            var StruckInfo = dbContext.info.Where(p => p.customer.Contains(search));
            var results = StruckInfo.Select(p => new struckScaleInfo
            {
                carNumber = p.carNumber,
                customer = p.customer,
                firstScale = p.firstScale,
                secondScale = p.secondScale,
                result = p.result,
                firstScaleDate = p.firstScaleDate,
                secondScaleDate = p.secondScaleDate
            });
            return Ok(results.ToList());
        }
        [HttpPost("post")]
        public async Task<IActionResult> Post(struckScaleInfo struckScaleInfos)
        {
            var resultInfo = new struckScaleInfo()
            {
                carNumber = struckScaleInfos.carNumber,
                customer = struckScaleInfos.customer,
                firstScale = struckScaleInfos.firstScale,
                secondScale = struckScaleInfos.secondScale,
                result = struckScaleInfos.secondScale - struckScaleInfos.firstScale,
                firstScaleDate = DateTime.Now,
                secondScaleDate = DateTime.Now,
            };
            await dbContext.info.AddAsync(resultInfo);
            await dbContext.SaveChangesAsync();
            return Ok(resultInfo);
        }
    }
}
