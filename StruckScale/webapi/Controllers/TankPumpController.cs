﻿using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using webapi.Data;
using webapi.Models;

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TankPumpController : Controller
    {
        private readonly ScaleInfo _dbContext;
        public TankPumpController(ScaleInfo dbContext)
        {
            this._dbContext = dbContext;
        }
        [HttpGet("GetList")]
        public async Task<ActionResult<TankPumpInfomation>> GetList()
        {
            try
            {
                DateTime dateTime = DateTime.Now;
                var DayNow = dateTime.AddDays(-1).ToShortDateString();
                var list = await _dbContext.TankStruck.GroupJoin(
                   _dbContext.StruckInfo,
                   tankStrucks => tankStrucks.struckID,
                   struckInfos => struckInfos.id,
                   (struckInfos, tankPumpGroup) => new { struckInfos, tankPumpGroup }
               )
               .SelectMany(
                   x => x.tankPumpGroup.DefaultIfEmpty(),
                   (struckTankPump, struckInfos) => new TankPumpInfomation()
                   {
                       struckID = struckTankPump.struckInfos.struckID,
                       sourceOfGoods = struckTankPump.struckInfos.sourceOfGoods,
                       pumpVolume =  struckTankPump.struckInfos.pumpVolume,
                       requestedVolume =  struckTankPump.struckInfos.requestedVolume,
                       startTimePump =  struckTankPump.struckInfos.startTimePump,
                       endTimePump = struckTankPump.struckInfos.endTimePump ,
                       createDate = struckTankPump.struckInfos.createDate,
                       ordinalNumber = struckInfos != null ? struckInfos.ordinalNumber : null,
                       carNumber = struckInfos != null ? struckInfos.carNumber : null,
                       product = struckInfos != null ? struckInfos.product : null,
                       customer = struckInfos != null ? struckInfos.customer : null,
                       documents = struckInfos != null ? struckInfos.documents : null,
                       notes = struckInfos != null ? struckInfos.notes : null
                   }).Where(x => x.createDate >= Convert.ToDateTime(DayNow) || x.pumpVolume == 0).OrderByDescending(x => x.struckID).ToListAsync();
                return Ok(list);
            }
            catch (Exception)
            {
                throw;
            }
        }
        [HttpPut("{id}")]
        public async Task<ActionResult<TankStrucks>> EditTankPump(int id, [FromBody] TankStrucks tankStrucks)
        {
            var checkScaleInfo = await _dbContext.StruckInfo.FindAsync(id);
            var checkTankPump = await _dbContext.TankStruck.Where(x => x.struckID != null && x.struckID == id).FirstOrDefaultAsync();
            if (checkTankPump == null) return BadRequest();
            if (checkTankPump != null && checkTankPump.requestedVolume == 0)
            {
                checkTankPump.sourceOfGoods = tankStrucks.sourceOfGoods;
                checkTankPump.requestedVolume = tankStrucks.requestedVolume;
                checkTankPump.startTimePump = DateTime.Now;
                checkScaleInfo.isDel = false;
                await _dbContext.SaveChangesAsync();
                return Ok(checkTankPump);
            }
            if (checkTankPump != null && checkTankPump.requestedVolume > 0 && (tankStrucks.pumpVolume <= checkTankPump.requestedVolume))
            {
                if (checkTankPump.pumpVolume <= checkTankPump.requestedVolume)
                {
                    checkTankPump.pumpVolume = tankStrucks.pumpVolume;
                    checkTankPump.endTimePump = DateTime.Now;
                }
                else
                {
                    throw new Exception("Vượt qua giới hạn bơm");
                }
                _dbContext?.SaveChangesAsync();
                return Ok(checkTankPump);
            }
            throw new Exception("Vượt giới hạn yêu cầu bơm");
        }
    }
}
