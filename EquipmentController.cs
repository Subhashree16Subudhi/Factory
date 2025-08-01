using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FactoryBackend.Data;
using FactoryBackend.Models;

[ApiController]
[Route("api/[controller]")]
public class EquipmentController : ControllerBase
{
    private readonly AppDbContext _context;

    public EquipmentController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Equipment>>> GetEquipment()
    {
        return Ok(await _context.Equipment.ToListAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Equipment>> GetEquipmentById(int id)
    {
        var equipment = await _context.Equipment.FindAsync(id);
        if (equipment == null)
            return NotFound();
        return Ok(equipment);
    }

    [HttpPost]
    public async Task<ActionResult<Equipment>> AddEquipment(Equipment equipment)
    {
        _context.Equipment.Add(equipment);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetEquipmentById), new { id = equipment.Id }, equipment);
    }
}
