using System;
using System.Collections.Generic;

namespace BodegaApi.Models;

public partial class Cliente
{
    public int CodigoCliente { get; set; }

    public string? NombreCliente { get; set; }

    public int Telefono { get; set; }

    public string? Direccion { get; set; }

    public string? Cedula { get; set; }

    public virtual ICollection<Venta> Venta { get; set; } = new List<Venta>();
}
