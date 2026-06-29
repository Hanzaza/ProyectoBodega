import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Users, Truck, Package, LayoutDashboard, Briefcase, ShoppingCart, LogOut, User } from 'lucide-react';

// Importación de pantallas
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Proveedores from './pages/Proveedores';
import Productos from './pages/Productos';
import Vendedores from './pages/Vendedores';
import Ventas from './pages/Ventas';

// Componente para los enlaces del menú
const NavItem = ({ to, icon: Icon, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
        isActive 
          ? 'bg-blue-800 text-white border-l-4 border-blue-400' 
          : 'text-gray-300 hover:bg-gray-800 hover:text-white border-l-4 border-transparent'
      }`}
    >
      <Icon className="w-5 h-5 mr-3" />
      {children}
    </Link>
  );
};

function App() {
  // CORRECCIÓN: Inicializamos el estado verificando el token directamente
  // Si hay token será true, si no será false. ¡Adiós useEffect y doble renderizado!
  const [estaAutenticado, setEstaAutenticado] = useState(() => !!localStorage.getItem('token'));

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('rol');
    setEstaAutenticado(false);
  };

  // Si no hay token, forzamos la vista del Login
  if (!estaAutenticado) {
    return <Login onLoginExitoso={() => setEstaAutenticado(true)} />;
  }

  const usuarioActual = localStorage.getItem('username') || 'Usuario';
  const rolActual = localStorage.getItem('rol') || 'Administrador';

  return (
    <Router>
      <div className="flex h-screen bg-gray-50 font-sans">
        
        {/* Menú Lateral (Sidebar) */}
        <aside className="w-64 bg-gray-900 text-white flex flex-col shadow-xl z-10 hidden md:flex">
          <div className="p-6 bg-gray-950">
            <h2 className="text-xl font-bold tracking-wider text-white flex items-center">
              <Package className="w-6 h-6 mr-2 text-blue-500" />
              <span className="text-blue-500">Bodega</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">Sistema Control de Bodega Comercial</p>
          </div>
          
          <nav className="flex-1 py-6 space-y-1">
            <NavItem to="/Dashboard" icon={LayoutDashboard}>Inicio</NavItem>
            <NavItem to="/ventas" icon={ShoppingCart}>Ventas</NavItem>
            <NavItem to="/clientes" icon={Users}>Gestión de Clientes</NavItem>
            <NavItem to="/vendedores" icon={Briefcase}>Personal (Vendedores)</NavItem>
            <NavItem to="/proveedores" icon={Truck}>Proveedores</NavItem>
            <NavItem to="/productos" icon={Package}>Inventario</NavItem>
          </nav>

          {/* Perfil de Usuario y Botón de Salir */}
          <div className="p-4 bg-gray-950 border-t border-gray-800">
            <div className="flex items-center mb-4 px-2">
              <div className="bg-gray-800 p-2 rounded-full mr-3 border border-gray-700">
                <User className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{usuarioActual}</p>
                <p className="text-xs text-gray-400">{rolActual}</p>
              </div>
            </div>
            <button 
              onClick={cerrarSesion}
              className="w-full flex items-center justify-center space-x-2 p-2 rounded-lg text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors font-medium text-sm border border-transparent hover:border-gray-700"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </button>
          </div>

          <div className="p-4 bg-gray-950 text-xs text-center text-gray-600">
            &copy; 2026 - Tienda Comercial
          </div>
        </aside>

        {/* Área Principal de Contenido */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/vendedores" element={<Vendedores />} />
            <Route path="/proveedores" element={<Proveedores />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/ventas" element={<Ventas />} />
          </Routes>
        </main>
        
      </div>
    </Router>
  );
}

export default App;