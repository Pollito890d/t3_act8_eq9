// src/App.jsx
import { useState } from "react";
import Login from "./components/Login";
import Sistema from "./components/Sistema"; // Asegúrate de que la ruta sea correcta
import { loginUser } from "./services/api"; // Tu función fetch de DummyJSON

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [cerrandoSesion, setCerrandoSesion] = useState(false);

  // Función que se ejecuta cuando el login es exitoso
  async function handleLogin({ username, password }) {
    // Llamada a la API de DummyJSON
    const perfilRaw = await loginUser(username, password);

    if (!perfilRaw) {
      throw new Error("No se recibió el perfil del usuario.");
    }

    // Adaptamos los datos de DummyJSON al formato que espera tu componente Sistema
    const perfilAdaptado = {
      nombre: `${perfilRaw.firstName} ${perfilRaw.lastName}`,
      rol: "Administrador", // DummyJSON no devuelve rol, así que lo simulamos
      foto: perfilRaw.image, // DummyJSON usa "image", Sistema usa "foto"
      ...perfilRaw // Guardamos el resto por si acaso
    };

    setUsuario(perfilAdaptado);
  }

  // Función para cerrar sesión
  async function handleLogout() {
    setCerrandoSesion(true);

    try {
      // Si tuvieras un token en localStorage, aquí lo borrarías:
      // localStorage.removeItem("userToken");
      
      // Simulamos una pequeña demora de red para que se vea el "Cerrando..."
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch {
      console.error("Error al cerrar sesión");
    } finally {
      setUsuario(null);
      setCerrandoSesion(false);
    }
  }

  // Si NO hay usuario, mostramos la pantalla de Login
  if (!usuario) {
    return <Login onLogin={handleLogin} />;
  }

  // Si SÍ hay usuario, renderizamos el componente Sistema
  return (
    <Sistema
      usuario={usuario}
      onLogout={handleLogout}
      cerrandoSesion={cerrandoSesion}
    />
  );
}