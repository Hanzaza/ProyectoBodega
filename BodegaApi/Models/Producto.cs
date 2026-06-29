using System;
using System.Collections.Generic;
using System.Text.Json.Serialization; // 1. Agregamos esta librería

namespace BodegaApi.Models;

public partial class Producto
{
    public int CodigoProducto { get; set; }

    public int ProveedorId { get; set; }

    public string? NombreProducto { get; set; }

    public string? Descripcion { get; set; }

    public DateOnly? FechaEntrega { get; set; }

    public string? Categoria { get; set; }

    public int Cantidad { get; set; }

    public float ValorUnitario { get; set; }

    // 2. Le decimos a .NET que ignore este objeto al recibir y enviar JSON, y lo hacemos opcional con el "?"
    [JsonIgnore]
    public virtual Proveedor? Proveedor { get; set; }

    // 3. Ignoramos también la lista de ventas para evitar bucles infinitos en Swagger y React
    [JsonIgnore]
    public virtual ICollection<Venta> Venta { get; set; } = new List<Venta>();
}