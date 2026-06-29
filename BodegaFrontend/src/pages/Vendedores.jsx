import { useEffect, useState } from 'react';

function Vendedores() {
  const [vendedores, setVendedores] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  const [vendedorActual, setVendedorActual] = useState({
    codigoVendedor: 0,
    nombreVendedor: '',
    cedula: '',
    telefono: '',
    direccion: ''
  });
  const [modoEdicion, setModoEdicion] = useState(false);

  const cargarVendedores = () => {
    fetch('http://localhost:5087/api/Vendedores')
      .then(respuesta => respuesta.json())
      .then(datos => {
        setVendedores(datos);
        setCargando(false);
      })
      .catch(error => console.error("Error al cargar vendedores:", error));
  }

  useEffect(() => {
    cargarVendedores();
  }, []);

  const guardarVendedor = (e) => {
    e.preventDefault();
    const metodo = modoEdicion ? 'PUT' : 'POST';
    const url = modoEdicion 
      ? `http://localhost:5087/api/Vendedores/${vendedorActual.codigoVendedor}` 
      : 'http://localhost:5087/api/Vendedores';

    fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...vendedorActual,
        telefono: parseInt(vendedorActual.telefono) 
      })
    })
    .then(respuesta => {
      if(respuesta.ok || respuesta.status === 201 || respuesta.status === 204) {
        setVendedorActual({ codigoVendedor: 0, nombreVendedor: '', cedula: '', telefono: '', direccion: '' });
        setModoEdicion(false);
        cargarVendedores();
      }
    })
    .catch(error => console.error("Error al guardar:", error));
  }

  const prepararEdicion = (vendedor) => {
    setVendedorActual(vendedor);
    setModoEdicion(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const cancelarEdicion = () => {
    setVendedorActual({ codigoVendedor: 0, nombreVendedor: '', cedula: '', telefono: '', direccion: '' });
    setModoEdicion(false);
  }

  const eliminarVendedor = (id) => {
    if(window.confirm("¿Dar de baja a este vendedor del sistema?")) {
      fetch(`http://localhost:5087/api/Vendedores/${id}`, { method: 'DELETE' })
      .then(respuesta => {
        if(respuesta.ok || respuesta.status === 204) cargarVendedores();
      })
      .catch(error => console.error("Error al eliminar:", error));
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-800">Personal de Ventas</h1>
          <p className="text-gray-500 mt-1">Gestión administrativa de Vendedores</p>
        </header>

        {/* Formulario */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-700">
              {modoEdicion ? `Editando Registro #${vendedorActual.codigoVendedor}` : 'Alta de Nuevo Vendedor'}
            </h2>
            {modoEdicion && (
              <button onClick={cancelarEdicion} className="text-sm text-gray-500 hover:text-gray-700 underline">
                Cancelar edición
              </button>
            )}
          </div>
          
          <form onSubmit={guardarVendedor} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
              <input type="text" required className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                value={vendedorActual.nombreVendedor} onChange={(e) => setVendedorActual({...vendedorActual, nombreVendedor: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cédula</label>
              <input type="text" required className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                value={vendedorActual.cedula} onChange={(e) => setVendedorActual({...vendedorActual, cedula: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input type="number" required className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                value={vendedorActual.telefono} onChange={(e) => setVendedorActual({...vendedorActual, telefono: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
              <input type="text" required className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                value={vendedorActual.direccion} onChange={(e) => setVendedorActual({...vendedorActual, direccion: e.target.value})}
              />
            </div>
            
            <div className="md:col-span-2 pt-2">
              <button type="submit" className={`font-medium py-2.5 px-8 rounded text-white ${modoEdicion ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                {modoEdicion ? 'Actualizar Datos' : 'Registrar Vendedor'}
              </button>
            </div>
          </form>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            {cargando ? (
              <div className="p-8 text-center text-gray-500 animate-pulse">Cargando personal...</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Nombre</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Cédula</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Contacto</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {vendedores.length === 0 ? (
                    <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-500">No hay vendedores registrados en el sistema.</td></tr>
                  ) : (
                    vendedores.map((vendedor) => (
                      <tr key={vendedor.codigoVendedor} className="hover:bg-blue-50">
                        <td className="px-6 py-4 text-sm text-gray-500">#{vendedor.codigoVendedor}</td>
                        <td className="px-6 py-4 font-medium text-gray-900">{vendedor.nombreVendedor}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{vendedor.cedula}</td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{vendedor.telefono}</div>
                          <div className="text-xs text-gray-500">{vendedor.direccion}</div>
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium">
                          <button onClick={() => prepararEdicion(vendedor)} className="text-blue-600 hover:text-blue-900 mr-4">Editar</button>
                          <button onClick={() => eliminarVendedor(vendedor.codigoVendedor)} className="text-red-600 hover:text-red-900">Eliminar</button>
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

export default Vendedores;