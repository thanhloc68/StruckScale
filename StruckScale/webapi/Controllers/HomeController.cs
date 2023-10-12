using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections;
using System.Globalization;
using System.Linq;
using webapi.Data;
using webapi.Models;
using webapi.Wrapper;

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        private readonly ScaleInfo _dbContext;
        public HomeController(ScaleInfo dbContext)
        {
            _dbContext = dbContext;
        }
        [HttpGet("get")]
        public async Task<ActionResult<StruckScaleInfomation>> GetList(int pg = 1, int pageSize = 12)
        {
            DateTime dateTime = DateTime.Now;
            var DayNow = dateTime.AddDays(-1).ToShortDateString();
            var list = await _dbContext.StruckInfo.GroupJoin(
                    _dbContext.StruckScale,
                    struckscale => struckscale.id,
                    struckInfos => struckInfos.struckID,
                    (struckInfos, scaleGroup) => new { struckInfos, scaleGroup })
                .SelectMany(
                    x => x.scaleGroup.DefaultIfEmpty(),
                    (struckScales, struckinfoTable) => new StruckScaleInfomation()
                    {
                        struckId = struckScales.struckInfos.id,
                        ordinalNumber = struckScales.struckInfos.ordinalNumber,
                        carNumber = struckScales.struckInfos.carNumber,
                        product = struckScales.struckInfos.product,
                        customer = struckScales.struckInfos.customer,
                        documents = struckScales.struckInfos.documents,
                        notes = struckScales.struckInfos.notes,
                        firstScale = struckinfoTable != null ? struckinfoTable.firstScale : null,
                        firstScaleDate = struckinfoTable != null ? struckinfoTable.firstScaleDate : null,
                        secondScale = struckinfoTable != null ? struckinfoTable.secondScale : null,
                        secondScaleDate = struckinfoTable != null ? struckinfoTable.secondScaleDate : null,
                        results = struckinfoTable != null ? struckinfoTable.results : null,
                        styleScale = struckinfoTable != null ? struckinfoTable.styleScale : null,
                        isDone = struckinfoTable != null ? struckinfoTable.isDone : null
                    })
               .GroupJoin(
                        _dbContext.TankStruck,
                        tankStrucks => tankStrucks.struckId,
                        struckInfos => struckInfos.struckID,
                        (struckInfos, tankPumpGroup) => new { struckInfos, tankPumpGroup })
               .SelectMany(
                        x => x.tankPumpGroup.DefaultIfEmpty(),
                        (truckScales, struckInfos) => new StruckScaleInfomation()
                        {
                            struckId = truckScales.struckInfos.struckId,
                            sourceOfGoods = struckInfos != null ? struckInfos.sourceOfGoods : null,
                            pumpVolume = struckInfos != null ? struckInfos.pumpVolume : null,
                            requestedVolume = struckInfos != null ? struckInfos.requestedVolume : null,
                            startTimePump = struckInfos != null ? struckInfos.startTimePump : null,
                            endTimePump = struckInfos != null ? struckInfos.endTimePump : null,
                            createDate = struckInfos != null ? struckInfos.createDate : null,
                            processing = struckInfos != null ? struckInfos.processing : 0,
                            ordinalNumber = truckScales.struckInfos.ordinalNumber,
                            firstScale = truckScales.struckInfos.firstScale,
                            firstScaleDate = truckScales.struckInfos.firstScaleDate,
                            secondScale = truckScales.struckInfos.secondScale,
                            secondScaleDate = truckScales.struckInfos.secondScaleDate,
                            results = truckScales.struckInfos.results,
                            styleScale = truckScales.struckInfos.styleScale,
                            carNumber = truckScales.struckInfos.carNumber,
                            product = truckScales.struckInfos.product,
                            customer = truckScales.struckInfos.customer,
                            documents = truckScales.struckInfos.documents,
                            notes = truckScales.struckInfos.notes
                        }).Where(x => x.createDate >= Convert.ToDateTime(DayNow) || x.secondScale == 0).AsNoTracking().OrderByDescending(x => x.struckId).ToListAsync();
            var totalCount = list.Count;
            var totalPages = (int)Math.Ceiling((decimal)totalCount / pageSize);
            var listPerPage = list.Skip((pg - 1) * pageSize).Take(pageSize).ToList();
            return Ok(new PagedResponse<List<StruckScaleInfomation>>(listPerPage, totalCount, pg, pageSize));
        }
        [HttpPost("post")]
        public async Task<IActionResult> AddPost(StruckInfo struckScaleInfos)
        {
            if (struckScaleInfos.carNumber == "" || struckScaleInfos.customer == "" || struckScaleInfos.documents == "" || struckScaleInfos.product == "") return BadRequest();
            int? index = 1;
            DateTime dateTime = DateTime.Now;
            var DayNow = dateTime.AddDays(-1);
            var getNum = _dbContext.StruckInfo.Where(x => x.ordinalNumber > 0).Where(x => x.createDate >= DayNow).ToList();
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
            await _dbContext.StruckInfo.AddAsync(resultInfo);
            await _dbContext.SaveChangesAsync();
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
            await _dbContext.StruckScale.AddAsync(resultScale);
            //await _dbContext.SaveChangesAsync();
            var resultTankPump = new TankStrucks()
            {
                struckID = resultInfo.id,
                sourceOfGoods = "",
                requestedVolume = 0,
                pumpVolume = 0,
                startTimePump = null,
                endTimePump = null,
                processing = 0,
                createDate = dateTime
            };
            await _dbContext.TankStruck.AddAsync(resultTankPump);
            await _dbContext.SaveChangesAsync();
            return Ok(resultInfo);
        }
        [HttpGet("detail/{id}")]
        public async Task<IActionResult> GetStruckScale(int id)
        {
            var list = await _dbContext.StruckInfo.FindAsync(id);
            return Ok(list);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> EditScale(int id, [FromBody] StruckScales struckScaleInfo)
        {
            var checkScaleInfo = await _dbContext.StruckInfo.FindAsync(id);
            var checkScale = await _dbContext.StruckScale.Where(x => x.struckID != null && x.struckID == id).FirstOrDefaultAsync();
            if (checkScale == null) return BadRequest();
            if (checkScaleInfo != null && checkScale?.id != null && checkScale.firstScale == 0)
            {
                checkScale.struckID = id;
                checkScale.firstScale = struckScaleInfo.firstScale;
                checkScale.firstScaleDate = DateTime.Now;
                checkScaleInfo.isDel = false;
                await _dbContext.SaveChangesAsync();
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
                await _dbContext.SaveChangesAsync();
                return Ok(checkScale);
            }
            return NotFound();
        }
        [HttpDelete]
        public async Task<IActionResult> Delete(int? id)
        {
            try
            {
                if (id == null)
                {
                    throw new Exception("Chưa chọn xe");
                }
                var checkinfo = await _dbContext.StruckInfo.Where(p => p.id == id).FirstOrDefaultAsync(); //xóa cái này cuối cùng
                var checkScale = await _dbContext.StruckScale.Where(p => p.struckID != null && p.struckID == id).FirstOrDefaultAsync();
                var tankPump = await _dbContext.TankStruck.Where(p => p.struckID != null && p.struckID == id).FirstOrDefaultAsync();
                if (checkinfo?.isDel == true && checkScale != null && tankPump != null)
                {
                    _dbContext.Remove(checkScale);
                    _dbContext.Remove(tankPump);
                    _dbContext.SaveChanges();
                    _dbContext.Remove(checkinfo);
                    _dbContext.SaveChanges();
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
