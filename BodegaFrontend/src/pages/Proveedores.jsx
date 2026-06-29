import { useEffect, useState } from 'react';

function Proveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  // Estado para el formulario
  const [proveedorActual, setProveedorActual] = useState({
    codigoProveedor: 0,
    nombreProveedor: '',
    direccion: '',
    telefono: '',
    descripcion: ''
  });
  const [modoEdicion, setModoEdicion] = useState(false);

  // Cargar lista desde la API
  const cargarProveedores = () => {
    fetch('http://localhost:5087/api/Proveedores')
      .then(respuesta => respuesta.json())
      .then(datos => {
        setProveedores(datos);
        setCargando(false);
      })
      .catch(error => console.error("Error al cargar proveedores:", error));
  }

  useEffect(() => {
    cargarProveedores();
  }, []);

  // Crear o Actualizar
  const guardarProveedor = (e) => {
    e.preventDefault();
    const metodo = modoEdicion ? 'PUT' : 'POST';
    const url = modoEdicion 
      ? `http://localhost:5087/api/Proveedores/${proveedorActual.codigoProveedor}` 
      : 'http://localhost:5087/api/Proveedores';

    fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...proveedorActual,
        telefono: parseInt(proveedorActual.telefono) 
      })
    })
    .then(respuesta => {
      if(respuesta.ok || respuesta.status === 201 || respuesta.status === 204) {
        setProveedorActual({ codigoProveedor: 0, nombreProveedor: '', direccion: '', telefono: '', descripcion: '' });
        setModoEdicion(false);
        cargarProveedores();
      }
    })
    .catch(error => console.error("Error al guardar:", error));
  }

  const prepararEdicion = (proveedor) => {
    setProveedorActual(proveedor);
    setModoEdicion(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const cancelarEdicion = () => {
    setProveedorActual({ codigoProveedor: 0, nombreProveedor: '', direccion: '', telefono: '', descripcion: '' });
    setModoEdicion(false);
  }

  const eliminarProveedor = (id) => {
    if(window.confirm("¿Estás seguro de que deseas eliminar este proveedor?")) {
      fetch(`http://localhost:5087/api/Proveedores/${id}`, { method: 'DELETE' })
      .then(respuesta => {
        if(respuesta.ok || respuesta.status === 204) cargarProveedores();
      })
      .catch(error => console.error("Error al eliminar:", error));
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-800">Proveedores</h1>
          <p className="text-gray-500 mt-1">Directorio de empresas suministradoras</p>
        </header>

        {/* Formulario */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-700">
              {modoEdicion ? `Editando Proveedor #${proveedorActual.codigoProveedor}` : 'Registrar Nuevo Proveedor'}
            </h2>
            {modoEdicion && (
              <button onClick={cancelarEdicion} className="text-sm text-gray-500 hover:text-gray-700 underline">
                Cancelar edición
              </button>
            )}
          </div>
          
          <form onSubmit={guardarProveedor} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Proveedor</label>
              <input 
                type="text" required
                className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                value={proveedorActual.nombreProveedor}
                onChange={(e) => setProveedorActual({...proveedorActual, nombreProveedor: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input 
                type="number" required
                className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                value={proveedorActual.telefono}
                onChange={(e) => setProveedorActual({...proveedorActual, telefono: e.target.value})}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
              <input 
                type="text" required
                className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                value={proveedorActual.direccion}
                onChange={(e) => setProveedorActual({...proveedorActual, direccion: e.target.value})}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción / Notas</label>
              <textarea 
                rows="2"
                className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                value={proveedorActual.descripcion}
                onChange={(e) => setProveedorActual({...proveedorActual, descripcion: e.target.value})}
              ></textarea>
            </div>
            
            <div className="md:col-span-2 pt-2">
              <button type="submit" className={`font-medium py-2.5 px-8 rounded text-white ${modoEdicion ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                {modoEdicion ? 'Actualizar Proveedor' : 'Guardar Proveedor'}
              </button>
            </div>
          </form>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            {cargando ? (
              <div className="p-8 text-center text-gray-500 animate-pulse">Cargando proveedores...</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Nombre</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Contacto / Dirección</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Descripción</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {proveedores.length === 0 ? (
                    <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-500">No hay proveedores registrados.</td></tr>
                  ) : (
                    proveedores.map((prov) => (
                      <tr key={prov.codigoProveedor} className="hover:bg-blue-50">
                        <td className="px-6 py-4 text-sm text-gray-500">#{prov.codigoProveedor}</td>
                        <td className="px-6 py-4 font-medium text-gray-900">{prov.nombreProveedor}</td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{prov.telefono}</div>
                          <div className="text-xs text-gray-500">{prov.direccion}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{prov.descripcion}</td>
                        <td className="px-6 py-4 text-right text-sm font-medium">
                          <button onClick={() => prepararEdicion(prov)} className="text-blue-600 hover:text-blue-900 mr-4">Editar</button>
                          <button onClick={() => eliminarProveedor(prov.codigoProveedor)} className="text-red-600 hover:text-red-900">Eliminar</button>
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

export default Proveedores;