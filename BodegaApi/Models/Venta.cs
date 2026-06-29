using System;
using System.Collections.Generic;

namespace BodegaApi.Models;

public partial class Venta
{
    public int CodigoVenta { get; set; }

    public int ProductoId { get; set; }

    public int ClienteId { get; set; }

    public int VendedorId { get; set; }

    public string? Descripcion { get; set; }

    public string? DetalleDeVenta { get; set; }

    public int CantidadVendida { get; set; }

    public int Precio { get; set; }

    public virtual Cliente Cliente { get; set; } = null!;

    public virtual Producto Producto { get; set; } = null!;

    public virtual Vendedor Vendedor { get; set; } = null!;
}
