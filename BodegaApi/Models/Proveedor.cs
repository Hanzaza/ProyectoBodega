using System;
using System.Collections.Generic;

namespace BodegaApi.Models;

public partial class Proveedor
{
    public int CodigoProveedor { get; set; }

    public string? NombreProveedor { get; set; }

    public string? Direccion { get; set; }

    public int Telefono { get; set; }

    public string? Descripcion { get; set; }

    public virtual ICollection<Producto> Productos { get; set; } = new List<Producto>();
}
