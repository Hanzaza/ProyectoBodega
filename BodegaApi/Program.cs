using Microsoft.EntityFrameworkCore;
using BodegaApi.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// 1. Configurar la conexión a MySQL usando tu Cadena de Conexión
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<BodegaContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// 2. Configurar CORS para permitir que React (que usa el puerto 5173) se conecte
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// Agregar controladores y desactivar la validación estricta de Entity Framework para llaves foráneas
builder.Services.AddControllers(options => 
{
    options.SuppressImplicitRequiredAttributeForNonNullableReferenceTypes = true;
});

// 3. NUEVO: Configurar Autenticación con JWT (JSON Web Tokens)
var jwtKey = builder.Configuration["Jwt:Key"];
var keyBytes = Encoding.UTF8.GetBytes(jwtKey);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(keyBytes)
        };
    });

// Configuración para la documentación (Swagger)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configurar el pipeline HTTP
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// 4. Activar CORS (Es crucial que esté antes de UseAuthorization)
app.UseCors("AllowReactApp");

// 5. NUEVO: Activar el middleware de Autenticación (Debe ir estrictamente antes de UseAuthorization)
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();