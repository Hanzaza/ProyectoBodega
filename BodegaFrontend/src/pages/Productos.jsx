import { useEffect, useState } from 'react';

function Productos() {
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]); // Para el menú desplegable
  const [cargando, setCargando] = useState(true);
  
  const [productoActual, setProductoActual] = useState({
    codigoProducto: 0,
    proveedorId: 0,
    nombreProducto: '',
    descripcion: '',
    fechaEntrega: '',
    categoria: '',
    cantidad: 0,
    valorUnitario: 0
  });
  const [modoEdicion, setModoEdicion] = useState(false);

  // Cargar Productos y Proveedores al mismo tiempo
  const cargarDatos = () => {
    Promise.all([
      fetch('http://localhost:5087/api/Productos').then(res => res.json()),
      fetch('http://localhost:5087/api/Proveedores').then(res => res.json())
    ])
    .then(([datosProductos, datosProveedores]) => {
      setProductos(datosProductos);
      setProveedores(datosProveedores);
      setCargando(false);
    })
    .catch(error => console.error("Error al cargar datos:", error));
  }

  useEffect(() => {
    cargarDatos();
  }, []);

  const guardarProducto = (e) => {
    e.preventDefault();

    // Validación estricta del proveedor
    if (productoActual.proveedorId === 0 || productoActual.proveedorId === "0" || productoActual.proveedorId === "") {
      alert("Por favor, seleccione un proveedor válido del menú desplegable.");
      return;
    }

    const metodo = modoEdicion ? 'PUT' : 'POST';
    const url = modoEdicion 
      ? `http://localhost:5087/api/Productos/${productoActual.codigoProducto}` 
      : 'http://localhost:5087/api/Productos';

    // Formatear los datos antes de enviarlos (asegurar números)
    const payload = {
      ...productoActual,
      proveedorId: parseInt(productoActual.proveedorId),
      cantidad: parseInt(productoActual.cantidad),
      valorUnitario: parseFloat(productoActual.valorUnitario)
    };

    fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(async respuesta => {
      if(respuesta.ok || respuesta.status === 201 || respuesta.status === 204) {
        setProductoActual({ codigoProducto: 0, proveedorId: 0, nombreProducto: '', descripcion: '', fechaEntrega: '', categoria: '', cantidad: 0, valorUnitario: 0 });
        setModoEdicion(false);
        cargarDatos();
        alert("¡Producto registrado con éxito!");
      } else {
         // AQUÍ ATRAPAMOS EL ERROR SILENCIOSO DE LA API
         const errorDetalle = await respuesta.text();
         alert("La API rechazó los datos. Error:\n" + errorDetalle);
      }
    })
    .catch(error => {
      alert("Error de conexión. Revisa si la API está encendida.");
      console.error(error);
    });
  }

  const prepararEdicion = (producto) => {
    // Extraer solo la parte de la fecha (YYYY-MM-DD) para el input type="date"
    const fechaCorta = producto.fechaEntrega ? producto.fechaEntrega.split('T')[0] : '';
    setProductoActual({ ...producto, fechaEntrega: fechaCorta });
    setModoEdicion(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const cancelarEdicion = () => {
    setProductoActual({ codigoProducto: 0, proveedorId: 0, nombreProducto: '', descripcion: '', fechaEntrega: '', categoria: '', cantidad: 0, valorUnitario: 0 });
    setModoEdicion(false);
  }

  const eliminarProducto = (id) => {
    if(window.confirm("¿Confirmas la eliminación de este producto del inventario?")) {
      fetch(`http://localhost:5087/api/Productos/${id}`, { method: 'DELETE' })
      .then(respuesta => {
        if(respuesta.ok || respuesta.status === 204) cargarDatos();
      })
      .catch(error => console.error("Error al eliminar:", error));
    }
  }

  // Función auxiliar para mostrar el nombre del proveedor en la tabla en lugar de su ID
  const obtenerNombreProveedor = (id) => {
    const prov = proveedores.find(p => p.codigoProveedor === id);
    return prov ? prov.nombreProveedor : 'Desconocido';
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="border-b pb-4 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Inventario</h1>
            <p className="text-gray-500 mt-1">Control de existencias y mercancía</p>
          </div>
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-semibold">
            Total Productos: {productos.length}
          </div>
        </header>

        {/* Formulario */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-700">
              {modoEdicion ? `Editando Producto #${productoActual.codigoProducto}` : 'Registrar Nuevo Producto'}
            </h2>
            {modoEdicion && (
              <button onClick={cancelarEdicion} className="text-sm text-gray-500 hover:text-gray-700 underline">
                Cancelar edición
              </button>
            )}
          </div>
          
          <form onSubmit={guardarProducto} className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Producto</label>
              <input type="text" required className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                value={productoActual.nombreProducto} onChange={(e) => setProductoActual({...productoActual, nombreProducto: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor Relacionado</label>
              <select required className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                value={productoActual.proveedorId} onChange={(e) => setProductoActual({...productoActual, proveedorId: e.target.value})}
              >
                <option value={0} disabled>Seleccione una opción...</option>
                {proveedores.map(prov => (
                  <option key={prov.codigoProveedor} value={prov.codigoProveedor}>
                    {prov.nombreProveedor}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <input type="text" required className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                value={productoActual.categoria} onChange={(e) => setProductoActual({...productoActual, categoria: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad en Bodega</label>
              <input type="number" required min="0" className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                value={productoActual.cantidad} onChange={(e) => setProductoActual({...productoActual, cantidad: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor Unitario (C$)</label>
              <input type="number" required min="0" step="0.01" className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                value={productoActual.valorUnitario} onChange={(e) => setProductoActual({...productoActual, valorUnitario: e.target.value})}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <input type="text" className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                value={productoActual.descripcion} onChange={(e) => setProductoActual({...productoActual, descripcion: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Entrega</label>
              <input type="date" required className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                value={productoActual.fechaEntrega} onChange={(e) => setProductoActual({...productoActual, fechaEntrega: e.target.value})}
              />
            </div>
            
            <div className="md:col-span-3 pt-2 border-t mt-2">
              <button type="submit" className={`font-medium py-2.5 px-8 rounded text-white ${modoEdicion ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                {modoEdicion ? 'Actualizar Registro' : 'Registrar al Inventario'}
              </button>
            </div>
          </form>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            {cargando ? (
              <div className="p-8 text-center text-gray-500 animate-pulse">Cargando inventario...</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Cod.</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Producto</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Proveedor</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Stock</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Precio Un.</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {productos.length === 0 ? (
                    <tr><td colSpan="6" className="px-6 py-10 text-center text-gray-500">Bodega vacía.</td></tr>
                  ) : (
                    productos.map((prod) => (
                      <tr key={prod.codigoProducto} className="hover:bg-blue-50">
                        <td className="px-6 py-4 text-sm text-gray-500 font-mono">{prod.codigoProducto}</td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{prod.nombreProducto}</div>
                          <div className="text-xs text-gray-500">{prod.categoria} | Entrega: {new Date(prod.fechaEntrega).toLocaleDateString()}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 bg-gray-50/50">
                          {obtenerNombreProveedor(prod.proveedorId)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${prod.cantidad > 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {prod.cantidad} uds.
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">C${prod.valorUnitario.toFixed(2)}</td>
                        <td className="px-6 py-4 text-right text-sm font-medium">
                          <button onClick={() => prepararEdicion(prod)} className="text-blue-600 hover:text-blue-900 mr-4">Editar</button>
                          <button onClick={() => eliminarProducto(prod.codigoProducto)} className="text-red-600 hover:text-red-900">Eliminar</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Productos;