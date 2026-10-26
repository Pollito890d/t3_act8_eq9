
import React, { useState } from 'react';
import LoginForm from './components/LoginForm';

export default function App() {
  const [user, setUser] = useState(null); // Almacena los datos del usuario autenticado

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {!user ? (
        /* Fase 1: Pantalla de Login */
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      ) : (
        /* Fase 2: Sistema Simulado (Temporalmente aquí antes de pasar al Dashboard completo) */
        <div className="p-8">
          <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow">
            <div className="flex items-center justify-between border-b pb-4 mb-6">
              <div className="flex items-center gap-3">
                <img 
                  src={user.image} 
                  alt={user.firstName} 
                  className="w-12 h-12 rounded-full border border-amber-500 object-cover"
                />
                <div>
                  <h2 className="font-bold text-lg text-gray-800">{user.firstName} {user.lastName}</h2>
                  <p className="text-xs text-gray-500">@{user.username} • Administrador</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 font-medium rounded-xl text-sm transition"
              >
                Cerrar Sesión
              </button>
            </div>
            <div className="p-6 bg-amber-50 rounded-xl border border-amber-200 text-amber-900">
              <h3 className="font-bold text-base mb-1">¡Bienvenido al Sistema Central de ¡Hola, Café!</h3>
              <p className="text-sm">La sesión se ha iniciado correctamente usando la API de DummyJSON[cite: 1]. Las vistas del Sidebar y Navbar (Fase 2) están listas para integrarse.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}