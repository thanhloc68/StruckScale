using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System.Linq;
using System.Net.WebSockets;
using System.Reflection.Metadata.Ecma335;
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
        [HttpGet("getAll")]
        public async Task<IActionResult> GetAllList(int pg = 1, int pageSize = 12)
        {
            var list = await dbContext.info.OrderByDescending(x => x.id).ToListAsync();
            var totalCount = list.Count;
            var totalPages = (int)Math.Ceiling((decimal)totalCount / pageSize);
            var listPerPage = list.Skip((pg - 1) * pageSize).Take(pageSize).ToList();
            return Ok(new PagedResponse<List<struckScaleInfo>>(listPerPage, totalCount, pg, pageSize));
        }
        [HttpGet("get")]
        public async Task<IActionResult> GetList(int pg = 1, int pageSize = 12)
        {
            //var list = await dbContext.info.Where(x=> x.secondScaleDate != null).OrderByDescending(x => x.id).ToListAsync();
            DateTime dateTime = DateTime.Now;
            var DayNow = dateTime.AddDays(-1).ToShortDateString();
            var list = await dbContext.info.Where(x => x.create_date >= Convert.ToDateTime(DayNow) || x.secondScale == 0).OrderByDescending(x => x.id).ToListAsync();
            //var list = await dbContext.info.OrderByDescending(x => x.id).ToListAsync();
            var totalCount = list.Count;
            var totalPages = (int)Math.Ceiling((decimal)totalCount / pageSize);
            var listPerPage = list.Skip((pg - 1) * pageSize).Take(pageSize).ToList();
            return Ok(new PagedResponse<List<struckScaleInfo>>(listPerPage, totalCount, pg, pageSize));
        }
        [HttpGet("GetDataByDate/{dateTimes}")]
        public async Task<IActionResult?> GetDataByDate(string? dateTimes)
        {
            string[] date = dateTimes.Split(" - ");
            var s = date[0].Replace("%2F", "-");
            var e = date[1].Replace("%2F", "-");
          
            if (s != null || e != null)
            {
                DateTime startDateValue = DateTime.ParseExact(s, "dd-MM-yyyy", CultureInfo.InvariantCulture);
                DateTime endDateValue = DateTime.ParseExact(e, "dd-MM-yyyy", CultureInfo.InvariantCulture);
                var getDate = await dbContext.info.Where(x => x.firstScaleDate >= startDateValue && x.secondScaleDate <= endDateValue).ToListAsync();
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
                results = p.results,
                firstScaleDate = p.firstScaleDate,
                secondScaleDate = p.secondScaleDate
            });
            return Ok(results.ToList());
        }
        [HttpPost("post")]
        public async Task<IActionResult> AddPost(struckScaleInfo struckScaleInfos)
        {
            if (struckScaleInfos.carNumber == "" || struckScaleInfos.customer == "" || struckScaleInfos.documents == "" || struckScaleInfos.product == "") return BadRequest();
            int? index = 1;
            DateTime dateTime = DateTime.Now;
            var DayNow = dateTime.AddDays(-1);
            var getNum = dbContext.info.Where(x => x.ordinalNumber > 0).Where(x => x.create_date >= DayNow).ToList();
            foreach (var item in getNum)
            {
                index += 1;
                if(item.ordinalNumber == index)
                {
                    index += 1;
                    continue;
                }
            }
            var resultInfo = new struckScaleInfo()
            {
                ordinalNumber = index,
                carNumber = struckScaleInfos.carNumber,
                customer = struckScaleInfos.customer,
                documents = struckScaleInfos.documents,
                product = struckScaleInfos.product,
                firstScale = 0,
                secondScale = 0,
                results = 0,
                firstScaleDate = null,
                secondScaleDate = null,
                notes = struckScaleInfos.notes,
                isDel = true,
                styleScale = "",
                create_date = DateTime.Now,
                isDone = false,
            };
            await dbContext.info.AddAsync(resultInfo);
            await dbContext.SaveChangesAsync();
            return Ok(resultInfo);
        }
        [HttpGet("detail/{id}")]
        public async Task<IActionResult> GetStruckScale(int id)
        {
            var list = await dbContext.info.FindAsync(id);
            return Ok(list);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> EditScale(int id, [FromBody] struckScaleInfo struckScaleInfo)
        {
            var checkScale = await dbContext.info.FindAsync(id);
            if (checkScale == null) return BadRequest();
            if (checkScale.id != null && checkScale.firstScale == 0)
            {
                checkScale.firstScale = struckScaleInfo.firstScale;
                checkScale.firstScaleDate = DateTime.Now;
                checkScale.notes = struckScaleInfo.notes;
                checkScale.isDel = false;
                await dbContext.SaveChangesAsync();
                return Ok(checkScale);
            }
            if (checkScale.id != null && checkScale.secondScale == 0)
            {
                checkScale.secondScale = struckScaleInfo.secondScale;
                checkScale.results = struckScaleInfo.firstScale - struckScaleInfo.secondScale;
                if (checkScale.results > 0)
                {
                    checkScale.styleScale = "Nhập hàng";
                }
                else
                {
                    checkScale.styleScale = "Xuất hàng";
                    checkScale.results = Math.Abs((double)checkScale.results);
                }
                checkScale.secondScaleDate = DateTime.Now;
                checkScale.notes = struckScaleInfo.notes;
                await dbContext.SaveChangesAsync();
                return Ok(checkScale);
            }
            return NotFound();
        }
        [HttpDelete]
        public async Task<IActionResult> Delete(int? id)
        {
            try
            {
                var checkScale = dbContext.info.Where(p => p.id == id).FirstOrDefault();
                if (checkScale.isDel == true && checkScale.id != null)
                {
                    struckScaleInfo struckScaleInfo = await dbContext.info.FindAsync(id);
                    dbContext?.Remove(struckScaleInfo);
                    dbContext?.SaveChanges();
                }
                else
                {
                    throw new Exception("Lỗi không được xóa");
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
