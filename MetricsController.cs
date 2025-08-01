using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FactoryBackend.Data;
using FactoryBackend.Models;

namespace FactoryBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MetricsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MetricsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/metrics/equipment/5
        [HttpGet("equipment/{equipmentId}")]
        public async Task<IActionResult> GetByEquipment(int equipmentId)
        {
            var metrics = await _context.Metrics
                .Where(m => m.EquipmentId == equipmentId)
                .OrderByDescending(m => m.Timestamp)
                .ToListAsync();

            return Ok(metrics);
        }

        // POST: api/metrics
        [HttpPost]
        public async Task<IActionResult> Add([FromBody] Metric metric)
        {
            metric.Timestamp = DateTime.UtcNow;

            _context.Metrics.Add(metric);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetByEquipment),
                new { equipmentId = metric.EquipmentId },
                metric
            );
        }
    }
}
