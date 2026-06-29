import { useEffect, useState } from 'react';

function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [vendedores, setVendedores] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  const [ventaActual, setVentaActual] = useState({
    codigoVenta: 0,
    clienteId: 0,
    productoId: 0,
    vendedorId: 0,
    cantidadVendida: 0,
    precio: 0,
    descripcion: '',
    detalleDeVenta: ''
  });
  const [modoEdicion, setModoEdicion] = useState(false);

  const cargarDatos = () => {
    // Promise.all nos permite hacer las 4 consultas al mismo tiempo
    Promise.all([
      fetch('http://localhost:5087/api/Ventas').then(res => res.json()),
      fetch('http://localhost:5087/api/Clientes').then(res => res.json()),
      fetch('http://localhost:5087/api/Productos').then(res => res.json()),
      fetch('http://localhost:5087/api/Vendedores').then(res => res.json())
    ])
    .then(([datosVentas, datosClientes, datosProductos, datosVendedores]) => {
      setVentas(datosVentas);
      setClientes(datosClientes);
      setProductos(datosProductos);
      setVendedores(datosVendedores);
      setCargando(false);
    })
    .catch(error => console.error("Error al cargar datos:", error));
  }

  useEffect(() => {
    cargarDatos();
  }, []);

  const guardarVenta = (e) => {
    e.preventDefault();

    if (ventaActual.clienteId === 0 || ventaActual.productoId === 0 || ventaActual.vendedorId === 0) {
      alert("Por favor, seleccione Cliente, Producto y Vendedor.");
      return;
    }

    const metodo = modoEdicion ? 'PUT' : 'POST';
    const url = modoEdicion 
      ? `http://localhost:5087/api/Ventas/${ventaActual.codigoVenta}` 
      : 'http://localhost:5087/api/Ventas';

    const payload = {
      ...ventaActual,
      clienteId: parseInt(ventaActual.clienteId),
      productoId: parseInt(ventaActual.productoId),
      vendedorId: parseInt(ventaActual.vendedorId),
      cantidadVendida: parseInt(ventaActual.cantidadVendida),
      precio: parseFloat(ventaActual.precio)
    };

    fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(respuesta => {
      if(respuesta.ok || respuesta.status === 201 || respuesta.status === 204) {
        setVentaActual({ codigoVenta: 0, clienteId: 0, productoId: 0, vendedorId: 0, cantidadVendida: 0, precio: 0, descripcion: '', detalleDeVenta: '' });
        setModoEdicion(false);
        cargarDatos();
      }
    })
    .catch(error => console.error("Error al guardar:", error));
  }

  const prepararEdicion = (venta) => {
    setVentaActual(venta);
    setModoEdicion(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const cancelarEdicion = () => {
    setVentaActual({ codigoVenta: 0, clienteId: 0, productoId: 0, vendedorId: 0, cantidadVendida: 0, precio: 0, descripcion: '', detalleDeVenta: '' });
    setModoEdicion(false);
  }

  const eliminarVenta = (id) => {
    if(window.confirm("¿Anular esta venta permanentemente?")) {
      fetch(`http://localhost:5087/api/Ventas/${id}`, { method: 'DELETE' })
      .then(respuesta => {
        if(respuesta.ok || respuesta.status === 204) cargarDatos();
      })
      .catch(error => console.error("Error al eliminar:", error));
    }
  }

  // Funciones auxiliares para mostrar nombres en lugar de IDs en la tabla
  const getNombre = (lista, id, campoId, campoNombre) => {
    const item = lista.find(x => x[campoId] === id);
    return item ? item[campoNombre] : 'Desconocido';
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-800">Registro de Ventas</h1>
          <p className="text-gray-500 mt-1">Control de transacciones y salidas de bodega</p>
        </header>

        {/* Formulario */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-700">
              {modoEdicion ? `Editando Venta #${ventaActual.codigoVenta}` : 'Nueva Venta'}
            </h2>
            {modoEdicion && (
              <button onClick={cancelarEdicion} className="text-sm text-gray-500 hover:text-gray-700 underline">Cancelar edición</button>
            )}
          </div>
          
          <form onSubmit={guardarVenta} className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
              <select required className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                value={ventaActual.clienteId} onChange={(e) => setVentaActual({...ventaActual, clienteId: e.target.value})} >
                <option value={0} disabled>Seleccione Cliente...</option>
                {clientes.map(c => <option key={c.codigoCliente} value={c.codigoCliente}>{c.nombreCliente}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Producto</label>
              <select required className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                value={ventaActual.productoId} onChange={(e) => setVentaActual({...ventaActual, productoId: e.target.value})} >
                <option value={0} disabled>Seleccione Producto...</option>
                {productos.map(p => <option key={p.codigoProducto} value={p.codigoProducto}>{p.nombreProducto}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vendedor (Atendido por)</label>
              <select required className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                value={ventaActual.vendedorId} onChange={(e) => setVentaActual({...ventaActual, vendedorId: e.target.value})} >
                <option value={0} disabled>Seleccione Vendedor...</option>
                {vendedores.map(v => <option key={v.codigoVendedor} value={v.codigoVendedor}>{v.nombreVendedor}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad Vendida</label>
              <input type="number" required min="1" className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                value={ventaActual.cantidadVendida} onChange={(e) => setVentaActual({...ventaActual, cantidadVendida: e.target.value})} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio Total</label>
              <input type="number" required min="0" step="0.01" className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                value={ventaActual.precio} onChange={(e) => setVentaActual({...ventaActual, precio: e.target.value})} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción Breve</label>
              <input type="text" required className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                value={ventaActual.descripcion} onChange={(e) => setVentaActual({...ventaActual, descripcion: e.target.value})} />
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Detalles Adicionales de la Venta</label>
              <textarea rows="2" className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                value={ventaActual.detalleDeVenta} onChange={(e) => setVentaActual({...ventaActual, detalleDeVenta: e.target.value})}></textarea>
            </div>
            
            <div className="md:col-span-3 pt-2 border-t mt-2">
              <button type="submit" className={`font-medium py-2.5 px-8 rounded text-white ${modoEdicion ? 'bg-amber-500' : 'bg-green-600 hover:bg-green-700'}`}>
                {modoEdicion ? 'Actualizar Transacción' : 'Registrar Venta'}
              </button>
            </div>
          </form>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            {cargando ? (
              <div className="p-8 text-center text-gray-500">Cargando transacciones...</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Ticket</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Detalles</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Involucrados</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Monto</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {ventas.length === 0 ? (
                    <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-500">No hay ventas registradas.</td></tr>
                  ) : (
                    ventas.map((v) => (
                      <tr key={v.codigoVenta} className="hover:bg-green-50">
                        <td className="px-6 py-4 text-sm font-mono text-gray-500">#{v.codigoVenta}</td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{getNombre(productos, v.productoId, 'codigoProducto', 'nombreProducto')}</div>
                          <div className="text-xs text-gray-500">Cant: {v.cantidadVendida} | {v.descripcion}</div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div><span className="font-medium text-blue-700">C:</span> {getNombre(clientes, v.clienteId, 'codigoCliente', 'nombreCliente')}</div>
                          <div><span className="font-medium text-amber-700">V:</span> {getNombre(vendedores, v.vendedorId, 'codigoVendedor', 'nombreVendedor')}</div>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-gray-900">${v.precio.toFixed(2)}</td>
                        <td className="px-6 py-4 text-right text-sm font-medium">
                          <button onClick={() => prepararEdicion(v)} className="text-blue-600 hover:text-blue-900 mr-4">Editar</button>
                          <button onClick={() => eliminarVenta(v.codigoVenta)} className="text-red-600 hover:text-red-900">Anular</button>
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

export default Ventas;