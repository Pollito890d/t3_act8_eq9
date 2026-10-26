// src/components/LoginForm.jsx
import React, { useState } from 'react';

export default function LoginForm({ onLoginSuccess }) {
  const [username, setUsername] = useState('barista@holacafe.com');
  const [password, setPassword] = useState('HolaCafe#2025');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Validación de campos vacíos
    if (!username.trim() || !password.trim()) {
      setErrorMessage('Por favor, completa todos los campos.');
      return;
    }

    setLoading(true);
    try {
      // Importamos el servicio y realizamos el login real con DummyJSON
      const { loginUser } = await import('../services/api');
      const userData = await loginUser(username, password);
      onLoginSuccess(userData);
    } catch (error) {
      setErrorMessage('Usuario o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2] px-4 font-sans">
      
      {/* Contenedor principal con la tarjeta blanca y sombra difuminada del mockup */}
      <div className="w-full max-w-[480px] bg-white px-10 py-12 rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-[#F4EFE6] relative">
        
        {/* Encabezado: Logo y Títulos */}
        <div className="flex flex-col items-center text-center mb-8">
          
          {/* Pastilla del Logo */}
          <div className="flex items-center gap-2 bg-[#F5EFE6] px-5 py-2.5 rounded-2xl border border-[#EBE3D5] mb-5 shadow-sm">
            <span className="text-2xl leading-none">🤌🏽</span>
            <div className="text-left">
              <span className="font-extrabold text-gray-900 tracking-wider text-sm block leading-tight">¡HOLA,</span>
              <span className="font-extrabold text-amber-800 tracking-wider text-sm block leading-tight">CAFÉ!</span>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 ml-1"></div>
          </div>

          <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">¡Hola, Café!</h1>
          <p className="text-xs text-gray-400 mt-1 font-medium">Control de Comandas y Monitoreo de Mesas</p>
        </div>

        {/* Alerta de Error */}
        {errorMessage && (
          <div className="mb-5 p-3.5 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs rounded-lg font-medium">
            {errorMessage}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Campo Correo o Usuario */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-2">
              Correo o usuario
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-gray-400 text-base">
                ✉️
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="barista@holacafe.com"
                className="w-full pl-11 pr-4 py-3.5 bg-[#FAF9F6] border border-[#EAE3D9] rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Campo Contraseña */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-2">
              Contraseña
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-gray-400 text-base">
                🔒
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-12 py-3.5 bg-[#FAF9F6] border border-[#EAE3D9] rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:bg-white transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-gray-400 hover:text-gray-600 text-sm focus:outline-none"
              >
                {showPassword ? '👁️‍🗨️' : '👁️'}
              </button>
            </div>
          </div>

          {/* Opciones: Recordar sesión y Olvidé contraseña */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 accent-[#E59819] rounded cursor-pointer"
              />
              <span className="text-xs font-medium text-gray-700 select-none">Recordar sesión</span>
            </label>
            
            <a 
              href="#forgot" 
              onClick={(e) => e.preventDefault()} 
              className="text-[#E59819] font-semibold hover:underline text-xs"
            >
              Olvidé mi contraseña
            </a>
          </div>

          {/* Botón de Entrar al Sistema */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-2 bg-gradient-to-r from-[#E59819] to-[#D4870B] hover:from-[#D4870B] hover:to-[#C37600] text-white font-bold text-sm rounded-xl shadow-[0_10px_20px_rgba(229,152,25,0.25)] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              'Iniciando sesión...'
            ) : (
              <>
                Entrar al Sistema <span className="text-lg leading-none">&rarr;</span>
              </>
            )}
          </button>
        </form>

        {/* Pie: Registro */}
        <div className="text-center mt-7">
          <p className="text-xs text-gray-500 font-medium">
            ¿No tienes una cuenta?{' '}
            <a 
              href="#register" 
              onClick={(e) => e.preventDefault()} 
              className="text-[#E59819] font-bold hover:underline"
            >
              Registrarse
            </a>
          </p>
        </div>

      </div>
    </div>
  );
}