using System;
using System.Collections.Generic;

namespace BodegaApi.Models;

public partial class Usuario
{
    public int Id { get; set; }
    public string Username { get; set; } = null!;
    public string ClaveHash { get; set; } = null!;
    public string Rol { get; set; } = null!; // Ejemplo: "Administrador", "Vendedor"
}