using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using webapi.Data;
using webapi.Models;

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin, Pump")]
    public class TankPumpController : Controller
    {
        private readonly ScaleInfo _dbContext;
        public TankPumpController(ScaleInfo dbContext)
        {
            this._dbContext = dbContext;
        }
        [HttpGet("GetList")]
        public async Task<ActionResult<StruckScaleInfomation>> GetList()
        {
            try
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
                        }).Where(x => x.createDate >= Convert.ToDateTime(DayNow) || x.processing <= 1).OrderByDescending(x => x.struckId).ToListAsync();
                return Ok(list);
            }
            catch (Exception)
            {
                throw new Exception("Lỗi");
            }
        }
        [HttpPut("{id}")]
        public async Task<ActionResult<TankStrucks>> EditTankPump(int id, [FromBody] TankStrucks tankStrucks)
        {
            var checkScaleInfo = await _dbContext.StruckInfo.FindAsync(id);
            var checkTankPump = await _dbContext.TankStruck.Where(x => x.struckID != null && x.struckID == id).FirstOrDefaultAsync();
            if (checkTankPump == null || checkScaleInfo == null) return BadRequest();
            if (tankStrucks.requestedVolume != 0 && checkTankPump.processing == 0 && checkTankPump.sourceOfGoods == "")
            {
                checkTankPump.sourceOfGoods = tankStrucks.sourceOfGoods;
                checkTankPump.requestedVolume = tankStrucks.requestedVolume;
                checkScaleInfo.isDel = false;
                if (checkTankPump.requestedVolume != 0 && checkTankPump.sourceOfGoods != "")
                {
                    checkTankPump.processing = 1; checkTankPump.startTimePump = DateTime.Now;
                }
                _dbContext.Entry(checkTankPump).State = EntityState.Modified;
                await _dbContext.SaveChangesAsync();
                return Ok(checkTankPump);
            }
            if (checkTankPump.requestedVolume > 0 && checkTankPump.processing == 1 && (tankStrucks.pumpVolume <= checkTankPump.requestedVolume))
            {
                if (checkTankPump.pumpVolume <= checkTankPump.requestedVolume)
                {
                    checkTankPump.pumpVolume = tankStrucks.pumpVolume;
                    checkTankPump.endTimePump = DateTime.Now;
                    if (checkTankPump.pumpVolume == checkTankPump.requestedVolume && checkTankPump.processing != 2)
                    {
                        checkTankPump.processing = 2;
                    }
                }

                _dbContext.Entry(checkTankPump).State = EntityState.Modified;
                _dbContext?.SaveChangesAsync();
                return Ok(checkTankPump);
            }
            throw new Exception("Vượt giới hạn yêu cầu bơm");
        }
    }
}
