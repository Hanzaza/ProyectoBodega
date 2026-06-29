using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BodegaApi.Models;

namespace BodegaApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientesController : ControllerBase
    {
        private readonly BodegaContext _context;

        public ClientesController(BodegaContext context)
        {
            _context = context;
        }
// POST: api/Clientes
        // Este método recibe un cliente desde la interfaz y lo guarda en la base de datos
        [HttpPost]
        public async Task<ActionResult<Cliente>> PostCliente(Cliente cliente)
        {
            _context.Clientes.Add(cliente);
            await _context.SaveChangesAsync();

            // Devuelve un código 201 (Creado) y el cliente guardado
            return CreatedAtAction(nameof(GetClientes), new { id = cliente.CodigoCliente }, cliente);
        }
        // PUT: api/Clientes/5
        // Este método actualiza un cliente existente
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCliente(int id, Cliente cliente)
        {
            if (id != cliente.CodigoCliente)
            {
                return BadRequest("El ID del cliente no coincide.");
            }

            _context.Entry(cliente).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClienteExists(id))
                {
                    return NotFound("Cliente no encontrado.");
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Clientes/5
        // Este método elimina un cliente de la base de datos
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCliente(int id)
        {
            var cliente = await _context.Clientes.FindAsync(id);
            if (cliente == null)
            {
                return NotFound("Cliente no encontrado.");
            }

            _context.Clientes.Remove(cliente);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Método auxiliar para comprobar si un cliente existe
        private bool ClienteExists(int id)
        {
            return _context.Clientes.Any(e => e.CodigoCliente == id);
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cliente>>> GetClientes()
        {
            var clientes = await _context.Clientes.ToListAsync();
            return Ok(clientes);
        }
    }
}