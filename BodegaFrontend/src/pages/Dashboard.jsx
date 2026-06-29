import { useEffect, useState } from 'react';
import { Users, Package, ShoppingCart, TrendingUp, Banknote, Activity } from 'lucide-react';

// 1. Movemos el componente "TarjetaMetrica" AFUERA de la función Dashboard
const TarjetaMetrica = ({ titulo, valor, icono: Icono, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
    <div className={`p-4 rounded-lg ${color} text-white mr-4`}>
      <Icono className="w-6 h-6" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{titulo}</p>
      <h3 className="text-2xl font-bold text-gray-800">{valor}</h3>
    </div>
  </div>
);

function Dashboard() {
  const [estadisticas, setEstadisticas] = useState({
    totalClientes: 0,
    totalProductos: 0,
    totalVentas: 0,
    ingresosTotales: 0,
    ultimasVentas: []
  });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:5087/api/Clientes').then(res => res.json()),
      fetch('http://localhost:5087/api/Productos').then(res => res.json()),
      fetch('http://localhost:5087/api/Ventas').then(res => res.json())
    ])
    .then(([datosClientes, datosProductos, datosVentas]) => {
      const ingresos = datosVentas.reduce((suma, venta) => suma + venta.precio, 0);
      const recientes = [...datosVentas].sort((a, b) => b.codigoVenta - a.codigoVenta).slice(0, 5);

      setEstadisticas({
        totalClientes: datosClientes.length,
        totalProductos: datosProductos.length,
        totalVentas: datosVentas.length,
        ingresosTotales: ingresos,
        ultimasVentas: recientes
      });
      setCargando(false);
    })
    .catch(error => console.error("Error al cargar el dashboard:", error));
  }, []);

  if (cargando) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Calculando métricas del sistema...</div>;
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-gray-800">Panel de Control</h1>
          <p className="text-gray-500 mt-1">Resumen general de operaciones de la bodega</p>
        </header>

        {/* Tarjetas de Métricas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <TarjetaMetrica 
            titulo="Ingresos Totales" 
            valor={`C$${estadisticas.ingresosTotales.toFixed(2)}`} 
            icono={Banknote} 
            color="bg-green-500" 
          />
          <TarjetaMetrica 
            titulo="Ventas Realizadas" 
            valor={estadisticas.totalVentas} 
            icono={ShoppingCart} 
            color="bg-blue-500" 
          />
          <TarjetaMetrica 
            titulo="Productos en Catálogo" 
            valor={estadisticas.totalProductos} 
            icono={Package} 
            color="bg-amber-500" 
          />
          <TarjetaMetrica 
            titulo="Clientes Registrados" 
            valor={estadisticas.totalClientes} 
            icono={Users} 
            color="bg-purple-500" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Panel de Actividad Reciente */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="font-bold text-gray-800 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                Últimas Transacciones
              </h3>
            </div>
            <div className="p-0">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Ticket</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Monto</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Detalle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {estadisticas.ultimasVentas.length === 0 ? (
                    <tr><td colSpan="3" className="px-6 py-8 text-center text-gray-500">No hay transacciones recientes.</td></tr>
                  ) : (
                    estadisticas.ultimasVentas.map(venta => (
                      <tr key={venta.codigoVenta} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-mono text-gray-500">#{venta.codigoVenta}</td>
                        <td className="px-6 py-4 text-sm font-bold text-green-600">C${venta.precio.toFixed(2)}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-xs">{venta.descripcion}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Panel de Estado del Sistema */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 flex items-center mb-6">
              <Activity className="w-5 h-5 mr-2 text-blue-500" />
              Estado del Sistema
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 text-green-700 rounded-lg">
                <span className="text-sm font-medium">API .NET</span>
                <span className="text-xs font-bold px-2 py-1 bg-green-200 rounded-full">EN LÍNEA</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 text-blue-700 rounded-lg">
                <span className="text-sm font-medium">Base de Datos</span>
                <span className="text-xs font-bold px-2 py-1 bg-blue-200 rounded-full">CONECTADA</span>
              </div>
              <div className="mt-8 pt-6 border-t text-center">
                <p className="text-xs text-gray-400">Bodega</p>
                <p className="text-xs text-gray-400 mt-1">Todos los sistemas operativos.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;