using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Globalization;
using webapi.Data;
using webapi.Models;

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : Controller
    {
        private readonly ScaleInfo _dbContext;
        public ReportController(ScaleInfo dbContext)
        {
            _dbContext = dbContext;
        }
        [HttpGet("get")]
        public async Task<ActionResult<StruckScaleInfomation>> GetAllList()
        {
            try
            {
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
                        }).AsNoTracking().OrderByDescending(x => x.struckId).ToListAsync();
                return Ok(list);
            }
            catch (Exception)
            {
                throw;
            }
        }
        [HttpGet("getlist/{type}")]
        public async Task<ActionResult<StruckScaleInfomation>> GetListType(string? type, DateTime? startDate, DateTime? endDate, string? search)
        {
            if (type == null) return BadRequest("Invalid type");
            var struckInfo = _dbContext.StruckInfo.AsQueryable();
            if (startDate != null) struckInfo = struckInfo.Where(x => x.createDate >= startDate);
            if (endDate != null) struckInfo = struckInfo.Where(x => x.createDate <= endDate);
            if (!string.IsNullOrEmpty(search) && search.Trim() != "") struckInfo = struckInfo.Where(x => (x.customer != null && x.customer.Contains(search)) || (x.product != null && x.product.Contains(search)));
            if (type != null && startDate != null && type == "Cân xe")
            {
                var list = await struckInfo.GroupJoin(
                    _dbContext.StruckScale,
                    struckScales => struckScales.id,
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
                    }).AsNoTracking().OrderByDescending(x => x.struckId).ToListAsync();
                return Ok(list);
            }
            if (type != null && startDate != null && type == "Bơm xe bồn")
            {
                var list = await struckInfo.GroupJoin(
                    _dbContext.TankStruck,
                    tankPump => tankPump.id,
                    struckInfos => struckInfos.struckID,
                    (struckInfos, scaleGroup) => new { struckInfos, scaleGroup })
                    .SelectMany(
                    x => x.scaleGroup.DefaultIfEmpty(),
                    (tankPumps, struckinfoTable) => new StruckScaleInfomation()
                    {
                        struckId = tankPumps.struckInfos.id,
                        ordinalNumber = tankPumps.struckInfos.ordinalNumber,
                        carNumber = tankPumps.struckInfos.carNumber,
                        product = tankPumps.struckInfos.product,
                        customer = tankPumps.struckInfos.customer,
                        documents = tankPumps.struckInfos.documents,
                        notes = tankPumps.struckInfos.notes,
                        sourceOfGoods = struckinfoTable != null ? struckinfoTable.sourceOfGoods : null,
                        requestedVolume = struckinfoTable != null ? struckinfoTable.requestedVolume : null,
                        pumpVolume = struckinfoTable != null ? struckinfoTable.pumpVolume : null,
                        startTimePump = struckinfoTable != null ? struckinfoTable.startTimePump : null,
                        endTimePump = struckinfoTable != null ? struckinfoTable.endTimePump : null,
                        processing = struckinfoTable != null ? struckinfoTable.processing : 0,
                        createDate = struckinfoTable != null ? struckinfoTable.createDate : null
                    }).AsNoTracking().OrderByDescending(x => x.struckId).ToListAsync();
                return Ok(list);
            }
            return Ok(null);
        }
    }
}
