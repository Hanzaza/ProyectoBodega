import { useState } from 'react';
import { Lock, User, LogIn } from 'lucide-react';

function Login({ onLoginExitoso }) {
  const [credenciales, setCredenciales] = useState({ username: '', clave: '' });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const manejarLogin = (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    fetch('http://localhost:5087/api/Auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credenciales)
    })
    .then(async respuesta => {
      if (respuesta.ok) {
        const datos = await respuesta.json();
        // Guardamos el token en la bóveda del navegador
        localStorage.setItem('token', datos.token);
        localStorage.setItem('username', datos.username);
        localStorage.setItem('rol', datos.rol);
        
        onLoginExitoso(); // Le avisamos a la App principal que ya entramos
      } else {
        setError('Usuario o contraseña incorrectos. Intente de nuevo.');
      }
    })
    .catch(() => setError('Error de conexión con el servidor.'))
    .finally(() => setCargando(false));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Control De Bodega</h1>
          <p className="text-gray-500 text-sm mt-1">Ingrese sus credenciales para continuar</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center mb-6 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={manejarLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de Usuario</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="text" 
                required 
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="ej. admin"
                value={credenciales.username}
                onChange={(e) => setCredenciales({...credenciales, username: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="password" 
                required 
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="••••••"
                value={credenciales.clave}
                onChange={(e) => setCredenciales({...credenciales, clave: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={cargando}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg flex items-center justify-center transition-colors"
          >
            {cargando ? 'Verificando...' : (
              <>
                <LogIn className="w-5 h-5 mr-2" />
                Iniciar Sesión
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;