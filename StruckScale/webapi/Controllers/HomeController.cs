using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using System.Collections;
using System.Globalization;
using System.Linq;
using System.Net.WebSockets;
using webapi.Data;
using webapi.Models;
using webapi.Wrapper;

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        private readonly ScaleInfo dbContext;
        public HomeController(ScaleInfo dbContext)
        {
            this.dbContext = dbContext;
        }
        [HttpGet("getAll")]
        public async Task<ActionResult<StruckScaleInfomation>> GetAllList()
        {
            try
            {
                var list = await dbContext.StruckInfo.GroupJoin(
                   dbContext.StruckScale,
                   struckInfos => struckInfos.id,
                   struckScales => struckScales.struckID,
                   (struckInfos, struckScalesGroup) => new { struckInfos, struckScalesGroup }
               )
               .SelectMany(
                   x => x.struckScalesGroup.DefaultIfEmpty(),
                   (struckInfos, struckScales) => new StruckScaleInfomation()
                   {
                       struckId = struckInfos.struckInfos.id,
                       ordinalNumber = struckInfos.struckInfos.ordinalNumber,
                       carNumber = struckInfos.struckInfos.carNumber,
                       product = struckInfos.struckInfos.product,
                       customer = struckInfos.struckInfos.customer,
                       documents = struckInfos.struckInfos.documents,
                       notes = struckInfos.struckInfos.notes,
                       isDel = struckInfos.struckInfos.isDel,
                       firstScale = struckScales != null ? struckScales.firstScale : 0,
                       firstScaleDate = struckScales != null ? struckScales.firstScaleDate : null,
                       secondScale = struckScales != null ? struckScales.secondScale : 0,
                       secondScaleDate = struckScales != null ? struckScales.secondScaleDate : null,
                       results = struckScales != null ? struckScales.results : 0,
                       styleScale = struckScales != null ? struckScales.styleScale : null,
                       createDate = struckScales != null ? struckScales.createDate : null,
                       isDone = struckScales != null ? struckScales.isDone : false
                   }).OrderByDescending(x => x.struckId).ToListAsync();
                return Ok(list);
            }
            catch (Exception)
            {
                throw;
            }
        }
        [HttpGet("get")]
        public async Task<ActionResult<StruckScaleInfomation>> GetList(int pg = 1, int pageSize = 12)
        {
            DateTime dateTime = DateTime.Now;
            var DayNow = dateTime.AddDays(-1).ToShortDateString();
            //var list = await dbContext.struckInfo.Where(x => x.createDate >= Convert.ToDateTime(DayNow) || x.secondScale == 0).OrderByDescending(x => x.id).ToListAsync();
            var list = await dbContext.StruckInfo.GroupJoin(
              dbContext.StruckScale,
              struckInfos => struckInfos.id,
              struckScales => struckScales.struckID,
              (struckInfos, struckScalesGroup) => new { struckInfos, struckScalesGroup }).SelectMany(
              x => x.struckScalesGroup.DefaultIfEmpty(),
              (struckInfos, struckScales) => new StruckScaleInfomation()
              {
                  struckId = struckInfos.struckInfos.id,
                  ordinalNumber = struckInfos.struckInfos.ordinalNumber,
                  carNumber = struckInfos.struckInfos.carNumber,
                  product = struckInfos.struckInfos.product,
                  customer = struckInfos.struckInfos.customer,
                  documents = struckInfos.struckInfos.documents,
                  notes = struckInfos.struckInfos.notes,
                  isDel = struckInfos.struckInfos.isDel,
                  firstScale = struckScales != null ? struckScales.firstScale : 0,
                  firstScaleDate = struckScales != null ? struckScales.firstScaleDate : null,
                  secondScale = struckScales != null ? struckScales.secondScale : 0,
                  secondScaleDate = struckScales != null ? struckScales.secondScaleDate : null,
                  results = struckScales != null ? struckScales.results : 0,
                  styleScale = struckScales != null ? struckScales.styleScale : null,
                  createDate = struckScales != null ? struckScales.createDate : null,
                  isDone = struckScales != null ? struckScales.isDone : false
              })
              .Where(x => x.createDate >= Convert.ToDateTime(DayNow) || x.secondScale == 0)
              .OrderByDescending(x => x.struckId)
              .ToListAsync();
            var totalCount = list.Count;
            var totalPages = (int)Math.Ceiling((decimal)totalCount / pageSize);
            var listPerPage = list.Skip((pg - 1) * pageSize).Take(pageSize).ToList();
            return Ok(new PagedResponse<List<StruckScaleInfomation>>(listPerPage, totalCount, pg, pageSize));
        }
        [HttpGet("GetDataByDate/{dateTimes}")]
        public async Task<IActionResult?> GetDataByDate(string? dateTimes)
        {
            if (dateTimes == null) { return Ok(); }
            string[] date = dateTimes.Split(" - ");
            var start = date[0].Replace("%2F", "-");
            var end = date[1].Replace("%2F", "-");
            if (start != null)
            {
                DateTime startDateValue = DateTime.ParseExact(start, "dd-MM-yyyy", CultureInfo.InvariantCulture);
                DateTime endDateValue = DateTime.ParseExact(end, "dd-MM-yyyy", CultureInfo.InvariantCulture);
                //var getDate = await dbContext.StruckScale.Where(x => x.firstScaleDate >= startDateValue && x.secondScaleDate <= endDateValue).ToListAsync();
                var getDate = await dbContext.StruckInfo.GroupJoin(
                   dbContext.StruckScale,
                   struckInfos => struckInfos.id,
                   struckScales => struckScales.struckID,
                   (struckInfos, struckScalesGroup) => new { struckInfos, struckScalesGroup }
               )
               .SelectMany(
                   x => x.struckScalesGroup.DefaultIfEmpty(),
                   (struckInfos, struckScales) => new StruckScaleInfomation()
                   {
                       carNumber = struckInfos.struckInfos.carNumber,
                       documents = struckInfos.struckInfos.documents,
                       product = struckInfos.struckInfos.product,
                       customer = struckInfos.struckInfos.customer,
                       firstScale = struckScales != null ? struckScales.firstScale : 0,
                       secondScale = struckScales != null ? struckScales.secondScale : 0,
                       results = struckScales != null ? struckScales.results : 0,
                       firstScaleDate = struckScales != null ? struckScales.firstScaleDate : null,
                       secondScaleDate = struckScales != null ? struckScales.secondScaleDate : null,
                       createDate = struckScales != null ? struckScales.createDate : null,
                       styleScale = struckScales != null ? struckScales.styleScale : null,
                       notes = struckInfos.struckInfos.notes
                   }).Where(x => x.firstScaleDate >= startDateValue && (DateTime?)x.secondScaleDate <= endDateValue).ToListAsync();
                return Ok(getDate);
            }
            return null;
        }
        [HttpGet("search/{search}")]
        public IActionResult Search(string search)
        {
            var StruckInfo = dbContext.StruckInfo.Where(p => p.customer != null && p.customer.Contains(search));
            var results = StruckInfo.Select(p => new StruckInfo
            {
                carNumber = p.carNumber,
                customer = p.customer
            });
            return Ok(results.ToList());
        }
        [HttpPost("post")]
        public async Task<IActionResult> AddPost(StruckInfo struckScaleInfos)
        {
            if (struckScaleInfos.carNumber == "" || struckScaleInfos.customer == "" || struckScaleInfos.documents == "" || struckScaleInfos.product == "") return BadRequest();
            int? index = 1;
            DateTime dateTime = DateTime.Now;
            var DayNow = dateTime.AddDays(-1);
            var getNum = dbContext.StruckInfo.Where(x => x.ordinalNumber > 0).Where(x => x.createDate >= DayNow).ToList();
            foreach (var item in getNum)
            {
                index += 1;
                if (item.ordinalNumber == index)
                {
                    index += 1;
                    continue;
                }
            }
            var resultInfo = new StruckInfo()
            {
                ordinalNumber = index,
                carNumber = struckScaleInfos.carNumber,
                customer = struckScaleInfos.customer,
                documents = struckScaleInfos.documents,
                product = struckScaleInfos.product,
                notes = struckScaleInfos.notes,
                isDel = true,
                createDate = dateTime
            };
            await dbContext.StruckInfo.AddAsync(resultInfo);
            await dbContext.SaveChangesAsync();
            var resultScale = new StruckScales()
            {
                struckID = resultInfo.id,
                firstScale = 0,
                secondScale = 0,
                results = 0,
                firstScaleDate = null,
                secondScaleDate = null,
                styleScale = "",
                createDate = dateTime,
                isDone = false
            };
            await dbContext.StruckScale.AddAsync(resultScale);
            await dbContext.SaveChangesAsync();
            return Ok(resultInfo);
        }
        [HttpGet("detail/{id}")]
        public async Task<IActionResult> GetStruckScale(int id)
        {
            var list = await dbContext.StruckInfo.FindAsync(id);
            return Ok(list);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> EditScale(int id, [FromBody] StruckScales struckScaleInfo)
        {
            var checkScaleInfo = await dbContext.StruckInfo.FindAsync(id);
            var checkScale = await dbContext.StruckScale.Where(x => x.struckID != null && x.struckID == id).FirstOrDefaultAsync();
            if (checkScale == null) return BadRequest();
            if (checkScaleInfo != null && checkScale?.id != null && checkScale.firstScale == 0)
            {
                checkScale.struckID = id;
                checkScale.firstScale = struckScaleInfo.firstScale;
                checkScale.firstScaleDate = DateTime.Now;
                checkScaleInfo.isDel = false;
                await dbContext.SaveChangesAsync();
                return Ok(checkScale);
            }
            if (checkScaleInfo != null && checkScale?.id != null && checkScale.secondScale == 0)
            {
                checkScale.struckID = id;
                checkScale.secondScale = struckScaleInfo.secondScale;
                checkScale.results = struckScaleInfo.firstScale - struckScaleInfo.secondScale;
                if (checkScale.results != null && checkScale.results > 0)
                {
                    checkScale.styleScale = "Nhập hàng";
                }
                else
                {
                    checkScale.styleScale = "Xuất hàng";
                    checkScale.results = Math.Abs((double)checkScale.results);
                }
                checkScale.secondScaleDate = DateTime.Now;
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
                var checkinfo = dbContext.StruckInfo.Where(p => p.id == id).FirstOrDefault();
                var checkScale = await dbContext.StruckScale.Where(p => p.struckID != null && p.struckID == id).FirstOrDefaultAsync();
                if (checkinfo?.isDel == true && checkScale != null)
                {
                    dbContext.Remove(checkScale);
                    dbContext.SaveChanges();
                    dbContext.Remove(checkinfo);
                    dbContext.SaveChanges();
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
