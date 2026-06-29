using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using BodegaApi.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BodegaApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly BodegaContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(BodegaContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // Endpoint para registrar un usuario nuevo (encriptando su contraseña)
        [HttpPost("registrar")]
        public async Task<IActionResult> Registrar(Usuario usuario)
        {
            // Verificar si el nombre de usuario ya existe
            if (await _context.Usuarios.AnyAsync(u => u.Username == usuario.Username))
            {
                return BadRequest("El nombre de usuario ya está registrado.");
            }

            // Encriptar la contraseña usando BCrypt antes de guardarla
            usuario.ClaveHash = BCrypt.Net.BCrypt.HashPassword(usuario.ClaveHash);

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Usuario registrado exitosamente de forma segura." });
        }

        // Endpoint de Login que genera el Token JWT
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto login)
        {
            // Buscar el usuario en la base de datos
            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Username == login.Username);

            if (usuario == null)
            {
                return Unauthorized("Usuario o contraseña incorrectos.");
            }

            // Verificar si la contraseña coincide con el hash guardado
            bool claveCorrecta = BCrypt.Net.BCrypt.Verify(login.Clave, usuario.ClaveHash);

            if (!claveCorrecta)
            {
                return Unauthorized("Usuario o contraseña incorrectos.");
            }

            // Si las credenciales son válidas, generamos el Token JWT
            var token = GenerarJwtToken(usuario);

            return Ok(new { 
                token = token, 
                username = usuario.Username, 
                rol = usuario.Rol 
            });
        }

        // Función interna para construir y firmar el token de acceso
        private string GenerarJwtToken(Usuario usuario)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var keyBytes = Encoding.UTF8.GetBytes(jwtSettings["Key"]!);

            // Guardamos la identidad del usuario dentro del token (Claims)
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, usuario.Username),
                new Claim(ClaimTypes.Role, usuario.Rol),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(8), // El token expira en 8 horas
                Issuer = jwtSettings["Issuer"],
                Audience = jwtSettings["Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(keyBytes), SecurityAlgorithms.HmacSha256Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var creadoToken = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(creadoToken);
        }
    }
}