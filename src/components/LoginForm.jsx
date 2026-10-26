
import React, { useState } from 'react';

export default function LoginForm({ onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        // Validación de campos vacíos (Buenas prácticas)
        if (!username.trim() || !password.trim()) {
            setErrorMessage('Por favor, ingresa tu usuario y contraseña.');
            return;
        }

        setLoading(true);
        try {
            // Llamada al servicio centralizado
            const userData = await loginUserFromService(username, password);
            onLoginSuccess(userData);
        } catch (error) {
            setErrorMessage(error.message || 'Usuario o contraseña incorrectos.');
        } finally {
            setLoading(false);
        }
    };

    // Importamos el servicio localmente o lo pasamos por props
    async function loginUserFromService(user, pass) {
        const { loginUser } = await import('../services/api');
        return await loginUser(user, pass);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] px-4">
            <div className="w-full max-w-[440px] bg-white p-8 rounded-2xl shadow-xl border border-orange-100 relative">
        
                {/* Logo y Encabezado según Figma */}
                <div className="flex flex-col items-center mb-6">
                    <div className="flex items-center gap-2 bg-[#F5EFE6] px-4 py-2 rounded-xl border border-[#EBE3D5] mb-4">
                        <span className="text-2xl">🤌🏽</span>
                        <span className="font-bold text-gray-800 tracking-wide text-lg">¡HOLA, CAFÉ!</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">¡Hola, Café!</h1>
                    <p className="text-sm text-gray-500 mt-1">Control de Comandas y Monitoreo de Mesas</p>
                </div>

                {/* Mensaje de Error */}
                {errorMessage && (
                    <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
                        {errorMessage}
                    </div>
                )}

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                            Correo o usuario
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                ✉️
                            </span>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="ej. emilys o barista@holacafe.com"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                            Contraseña
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"></span>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 text-sm"
                            >
                                {showPassword ? '👁️‍🗨️' : '👁️'}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm py-1">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 accent-amber-600 rounded"
                            />
                            <span className="text-gray-600 select-none">Recordar sesión</span>
                        </label>
                        <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-amber-600 font-medium hover:underline text-xs">
                            Olvidé mi contraseña
                        </a>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-xl shadow-md transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? 'Iniciando sesión...' : <>Entrar al Sistema &rarr;</>}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <p className="text-xs text-gray-500">
                        ¿No tienes una cuenta?{' '}
                        <a href="#register" onClick={(e) => e.preventDefault()} className="text-amber-600 font-medium hover:underline">
                            Registrarse
                        </a>
                    </p>
                </div>

        </div>
    </div>
  );
}