import { useEffect, useState } from 'react'

function Clientes() {
  const [clientes, setClientes] = useState([])
  const [cargando, setCargando] = useState(true)
  
  // Estado para el formulario y control de edición
  const [clienteActual, setClienteActual] = useState({
    codigoCliente: 0,
    nombreCliente: '',
    cedula: '',
    telefono: '',
    direccion: ''
  })
  const [modoEdicion, setModoEdicion] = useState(false)

  // Función para cargar todos los clientes desde la API
  const cargarClientes = () => {
    fetch('http://localhost:5087/api/Clientes')
      .then(respuesta => respuesta.json())
      .then(datos => {
        setClientes(datos)
        setCargando(false)
      })
      .catch(error => console.error("Error al cargar clientes:", error))
  }

  useEffect(() => {
    cargarClientes()
  }, [])

  // Función combinada para Crear o Editar un cliente
  const guardarCliente = (e) => {
    e.preventDefault();
    
    // Si estamos en modo edición, usamos PUT y apuntamos al ID específico
    const metodo = modoEdicion ? 'PUT' : 'POST';
    const url = modoEdicion 
      ? `http://localhost:5087/api/Clientes/${clienteActual.codigoCliente}` 
      : 'http://localhost:5087/api/Clientes';

    fetch(url, {
      method: metodo,
      headers: {
        'Content-Type': 'application/json'
      },
      // Convertimos el teléfono a número entero antes de enviar
      body: JSON.stringify({
        ...clienteActual,
        telefono: parseInt(clienteActual.telefono) 
      })
    })
    .then(respuesta => {
      // Para POST esperamos 201 (Created), para PUT esperamos 204 (No Content) o 200 (OK)
      if(respuesta.ok || respuesta.status === 201 || respuesta.status === 204) {
        // Limpiamos el formulario y salimos del modo edición
        setClienteActual({ codigoCliente: 0, nombreCliente: '', cedula: '', telefono: '', direccion: '' })
        setModoEdicion(false)
        // Recargamos la tabla para ver los cambios
        cargarClientes()
      } else {
        console.error("Error en la respuesta de la API al guardar.");
      }
    })
    .catch(error => console.error("Error de conexión al guardar:", error))
  }

  // Función para preparar el formulario para editar un cliente específico
  const prepararEdicion = (cliente) => {
    setClienteActual(cliente);
    setModoEdicion(true);
    // Hacemos scroll suave hacia arriba para que el usuario vea el formulario
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Función para cancelar la edición y limpiar el formulario
  const cancelarEdicion = () => {
    setClienteActual({ codigoCliente: 0, nombreCliente: '', cedula: '', telefono: '', direccion: '' });
    setModoEdicion(false);
  }

  // Función para eliminar un cliente de la base de datos
  const eliminarCliente = (id) => {
    // Confirmación nativa del navegador antes de borrar
    if(window.confirm("¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer.")) {
      fetch(`http://localhost:5087/api/Clientes/${id}`, {
        method: 'DELETE'
      })
      .then(respuesta => {
        if(respuesta.ok || respuesta.status === 204) {
          cargarClientes(); // Recargar la tabla si la eliminación fue exitosa
        } else {
          console.error("Error al eliminar el cliente.");
        }
      })
      .catch(error => console.error("Error de conexión al eliminar:", error))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-800">
            Control de Bodega
          </h1>
          <p className="text-gray-500 mt-1">Gestión administrativa de Clientes</p>
        </header>

        {/* Panel del Formulario (Crear/Editar) */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-700">
              {modoEdicion ? `Editando Cliente #${clienteActual.codigoCliente}` : 'Registrar Nuevo Cliente'}
            </h2>
            {modoEdicion && (
              <button 
                onClick={cancelarEdicion}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Cancelar edición
              </button>
            )}
          </div>
          
          <form onSubmit={guardarCliente} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
              <input 
                type="text" required
                className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                value={clienteActual.nombreCliente}
                onChange={(e) => setClienteActual({...clienteActual, nombreCliente: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cédula de Identidad</label>
              <input 
                type="text" required
                className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                value={clienteActual.cedula}
                onChange={(e) => setClienteActual({...clienteActual, cedula: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input 
                type="number" required
                className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                value={clienteActual.telefono}
                onChange={(e) => setClienteActual({...clienteActual, telefono: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección Exacta</label>
              <input 
                type="text" required
                className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                value={clienteActual.direccion}
                onChange={(e) => setClienteActual({...clienteActual, direccion: e.target.value})}
              />
            </div>
            
            <div className="md:col-span-2 pt-2">
              <button 
                type="submit" 
                className={`w-full md:w-auto font-medium py-2.5 px-8 rounded transition-colors ${
                  modoEdicion 
                    ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                }`}
              >
                {modoEdicion ? 'Actualizar Cliente' : 'Guardar Cliente'}
              </button>
            </div>
          </form>
        </div>

        {/* Panel de la Tabla de Clientes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
             <h3 className="font-semibold text-gray-700">Directorio de Clientes</h3>
             <span className="text-sm text-gray-500">Total: {clientes.length}</span>
          </div>
          
          <div className="overflow-x-auto">
            {cargando ? (
              <div className="p-8 text-center text-gray-500 animate-pulse">Cargando base de datos...</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cédula</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contacto</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {clientes.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-10 text-center text-gray-500 bg-gray-50">
                        Aún no hay clientes registrados en el sistema.
                      </td>
                    </tr>
                  ) : (
                    clientes.map((cliente) => (
                      <tr key={cliente.codigoCliente} className="hover:bg-blue-50 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {cliente.codigoCliente}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{cliente.nombreCliente}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {cliente.cedula}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{cliente.telefono}</div>
                          <div className="text-xs text-gray-500 truncate max-w-xs" title={cliente.direccion}>
                            {cliente.direccion}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            onClick={() => prepararEdicion(cliente)}
                            className="text-blue-600 hover:text-blue-900 mr-4 transition-colors"
                            title="Editar cliente"
                          >
                            Editar
                          </button>
                          <button 
                            onClick={() => eliminarCliente(cliente.codigoCliente)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Eliminar cliente"
                          >
                            Eliminar
                          </button>
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
  )
}

export default Clientes