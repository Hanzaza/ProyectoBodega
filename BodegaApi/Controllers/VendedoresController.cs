using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BodegaApi.Models;

namespace BodegaApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VendedoresController : ControllerBase
    {
        private readonly BodegaContext _context;

        public VendedoresController(BodegaContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Vendedor>>> GetVendedores()
        {
            return await _context.Vendedors.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Vendedor>> PostVendedor(Vendedor vendedor)
        {
            _context.Vendedors.Add(vendedor);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetVendedores), new { id = vendedor.CodigoVendedor }, vendedor);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutVendedor(int id, Vendedor vendedor)
        {
            if (id != vendedor.CodigoVendedor) return BadRequest();
            _context.Entry(vendedor).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVendedor(int id)
        {
            var vendedor = await _context.Vendedors.FindAsync(id);
            if (vendedor == null) return NotFound();
            _context.Vendedors.Remove(vendedor);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}