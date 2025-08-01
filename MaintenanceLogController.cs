using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FactoryBackend.Data; 
using FactoryBackend.Models;
namespace FactoryBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MaintenanceLogController : ControllerBase
    {
        private readonly AppDbContext _context;
        public MaintenanceLogController(AppDbContext context) => _context = context;
        [HttpGet("equipment/{equipmentId}")]
        public async Task<IActionResult> GetByEquipment(int equipmentId)
        {
            var logs = await _context.MaintenanceLogs
                .Where(log => log.EquipmentId == equipmentId)
                .OrderByDescending(log => log.DatePerformed)
                .ToListAsync();

            return Ok(logs);
        }

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] MaintenanceLog log)
        {
            _context.MaintenanceLogs.Add(log);
            await _context.SaveChangesAsync();
            return Ok(log);
        }
    }
}