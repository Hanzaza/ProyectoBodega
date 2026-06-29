using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Scaffolding.Internal;

namespace BodegaApi.Models;

public partial class BodegaContext : DbContext
{
    public BodegaContext()
    {
    }

    public BodegaContext(DbContextOptions<BodegaContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Aspnetrole> Aspnetroles { get; set; }

    public virtual DbSet<Aspnetuser> Aspnetusers { get; set; }

    public virtual DbSet<Cliente> Clientes { get; set; }

    public virtual DbSet<Producto> Productos { get; set; }

    public virtual DbSet<Proveedor> Proveedors { get; set; }

    public virtual DbSet<Vendedor> Vendedors { get; set; }

    public virtual DbSet<Venta> Ventas { get; set; }
    public virtual DbSet<Usuario> Usuarios { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_general_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<Aspnetrole>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("aspnetroles");

            entity.HasIndex(e => e.NormalizedName, "RoleNameIndex").IsUnique();

            entity.Property(e => e.Name).HasMaxLength(256);
            entity.Property(e => e.NormalizedName).HasMaxLength(256);
        });

        modelBuilder.Entity<Aspnetuser>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("aspnetusers");

            entity.HasIndex(e => e.NormalizedEmail, "EmailIndex");

            entity.HasIndex(e => e.NormalizedUserName, "UserNameIndex").IsUnique();

            entity.Property(e => e.AccessFailedCount).HasColumnType("int(11)");
            entity.Property(e => e.Email).HasMaxLength(256);
            entity.Property(e => e.LockoutEnd).HasMaxLength(6);
            entity.Property(e => e.NormalizedEmail).HasMaxLength(256);
            entity.Property(e => e.NormalizedUserName).HasMaxLength(256);
            entity.Property(e => e.UserName).HasMaxLength(256);

            entity.HasMany(d => d.Roles).WithMany(p => p.Users)
                .UsingEntity<Dictionary<string, object>>(
                    "Aspnetuserrole",
                    r => r.HasOne<Aspnetrole>().WithMany()
                        .HasForeignKey("RoleId")
                        .HasConstraintName("FK_AspNetUserRoles_AspNetRoles_RoleId"),
                    l => l.HasOne<Aspnetuser>().WithMany()
                        .HasForeignKey("UserId")
                        .HasConstraintName("FK_AspNetUserRoles_AspNetUsers_UserId"),
                    j =>
                    {
                        j.HasKey("UserId", "RoleId")
                            .HasName("PRIMARY")
                            .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });
                        j.ToTable("aspnetuserroles");
                        j.HasIndex(new[] { "RoleId" }, "IX_AspNetUserRoles_RoleId");
                    });
        });

        modelBuilder.Entity<Cliente>(entity =>
        {
            entity.HasKey(e => e.CodigoCliente).HasName("PRIMARY");

            entity.ToTable("clientes");

            entity.Property(e => e.CodigoCliente)
                .HasColumnType("int(11)")
                .HasColumnName("codigo_cliente");
            entity.Property(e => e.Cedula).HasColumnName("cedula");
            entity.Property(e => e.Direccion).HasColumnName("direccion");
            entity.Property(e => e.NombreCliente).HasColumnName("nombre_cliente");
            entity.Property(e => e.Telefono)
                .HasColumnType("int(11)")
                .HasColumnName("telefono");
        });

        modelBuilder.Entity<Producto>(entity =>
        {
            entity.HasKey(e => e.CodigoProducto).HasName("PRIMARY");

            entity.ToTable("productos");

            entity.HasIndex(e => e.ProveedorId, "IX_productos_ProveedorId");

            entity.Property(e => e.CodigoProducto)
                .HasColumnType("int(11)")
                .HasColumnName("codigo_producto");
            entity.Property(e => e.Cantidad)
                .HasColumnType("int(11)")
                .HasColumnName("cantidad");
            entity.Property(e => e.Categoria).HasColumnName("categoria");
            entity.Property(e => e.Descripcion).HasColumnName("descripcion");
            entity.Property(e => e.FechaEntrega).HasColumnName("fecha_entrega");
            entity.Property(e => e.NombreProducto).HasColumnName("nombre_producto");
            entity.Property(e => e.ProveedorId).HasColumnType("int(11)");
            entity.Property(e => e.ValorUnitario).HasColumnName("valor_unitario");

            entity.HasOne(d => d.Proveedor).WithMany(p => p.Productos).HasForeignKey(d => d.ProveedorId);
        });

        modelBuilder.Entity<Proveedor>(entity =>
        {
            entity.HasKey(e => e.CodigoProveedor).HasName("PRIMARY");

            entity.ToTable("proveedors");

            entity.Property(e => e.CodigoProveedor)
                .HasColumnType("int(11)")
                .HasColumnName("codigo_proveedor");
            entity.Property(e => e.Descripcion).HasColumnName("descripcion");
            entity.Property(e => e.Direccion).HasColumnName("direccion");
            entity.Property(e => e.NombreProveedor).HasColumnName("nombre_proveedor");
            entity.Property(e => e.Telefono)
                .HasColumnType("int(11)")
                .HasColumnName("telefono");
        });

        modelBuilder.Entity<Vendedor>(entity =>
        {
            entity.HasKey(e => e.CodigoVendedor).HasName("PRIMARY");

            entity.ToTable("vendedors");

            entity.Property(e => e.CodigoVendedor)
                .HasColumnType("int(11)")
                .HasColumnName("codigo_vendedor");
            entity.Property(e => e.Cedula).HasColumnName("cedula");
            entity.Property(e => e.Direccion).HasColumnName("direccion");
            entity.Property(e => e.NombreVendedor).HasColumnName("nombre_vendedor");
            entity.Property(e => e.Telefono)
                .HasColumnType("int(11)")
                .HasColumnName("telefono");
        });

        modelBuilder.Entity<Venta>(entity =>
        {
            entity.HasKey(e => e.CodigoVenta).HasName("PRIMARY");

            entity.ToTable("ventas");

            entity.HasIndex(e => e.ClienteId, "IX_ventas_ClienteId");

            entity.HasIndex(e => e.ProductoId, "IX_ventas_ProductoId");

            entity.HasIndex(e => e.VendedorId, "IX_ventas_VendedorId");

            entity.Property(e => e.CodigoVenta)
                .HasColumnType("int(11)")
                .HasColumnName("codigo_venta");
            entity.Property(e => e.CantidadVendida)
                .HasColumnType("int(11)")
                .HasColumnName("cantidad_vendida");
            entity.Property(e => e.ClienteId).HasColumnType("int(11)");
            entity.Property(e => e.Descripcion).HasColumnName("descripcion");
            entity.Property(e => e.DetalleDeVenta).HasColumnName("detalle_de_venta");
            entity.Property(e => e.Precio)
                .HasColumnType("int(11)")
                .HasColumnName("precio");
            entity.Property(e => e.ProductoId).HasColumnType("int(11)");
            entity.Property(e => e.VendedorId).HasColumnType("int(11)");

            entity.HasOne(d => d.Cliente).WithMany(p => p.Venta).HasForeignKey(d => d.ClienteId);

            entity.HasOne(d => d.Producto).WithMany(p => p.Venta).HasForeignKey(d => d.ProductoId);

            entity.HasOne(d => d.Vendedor).WithMany(p => p.Venta).HasForeignKey(d => d.VendedorId);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}