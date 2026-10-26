import { useState } from "react";
import {
  Armchair,
  ClipboardList,
  CookingPot,
  BellRing,
  Wallet,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";

import "./Sistema.css";

const opciones = [
  { id: "mesas", nombre: "Monitoreo de Mesas", icono: Armchair },
  { id: "ordenes", nombre: "Comandero / Órdenes", icono: ClipboardList },
  { id: "cocina", nombre: "Cocina", icono: CookingPot },
  { id: "avisos", nombre: "Botones de Aviso", icono: BellRing },
  { id: "caja", nombre: "Caja", icono: Wallet },
  { id: "configuracion", nombre: "Configuración", icono: Settings },
];

export default function Sistema({
  usuario,
  onLogout,
  cerrandoSesion = false,
  children,
}) {
  const [seccion, setSeccion] = useState("cocina");
  const [fotoFallida, setFotoFallida] = useState(false);

  // Evita mostrar el sistema si no existe una sesión.
  if (!usuario) return null;

  const opcionActual = opciones.find((opcion) => opcion.id === seccion);

  const nombre = usuario.nombre || "Usuario";
  const rol = usuario.rol || "Usuario";
  const foto = usuario.foto;

  const iniciales =
    nombre
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((palabra) => palabra[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <div className="sistema">
      {/* SIDEBAR */}
      <aside className="sidebar" aria-label="Menú principal">
        <div className="sidebar-marca">
          <div className="sidebar-logo">
            <img src="../src/img/hola_cafe_logo.jpeg" alt="Hola Café" />
          </div>

          <div className="sidebar-marca-texto">
            <strong>¡Hola, Café!</strong>
            <span>{opcionActual.nombre}</span>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Secciones">
          {opciones.map((opcion) => {
            const Icono = opcion.icono;
            const activa = seccion === opcion.id;

            return (
              <button
                key={opcion.id}
                type="button"
                className={`sidebar-opcion ${activa ? "activa" : ""}`}
                onClick={() => setSeccion(opcion.id)}
                aria-current={activa ? "page" : undefined}
                aria-label={opcion.nombre}
                title={opcion.nombre}
              >
                <Icono size={19} strokeWidth={1.6} aria-hidden="true" />
                <span>{opcion.nombre}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button
            type="button"
            className="sidebar-salir"
            onClick={onLogout}
            disabled={cerrandoSesion}
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
          >
            <LogOut size={20} strokeWidth={1.6} aria-hidden="true" />
            <span>
              {cerrandoSesion ? "Cerrando…" : "Cerrar sesión"}
            </span>
          </button>
        </div>
      </aside>

      <div className="sistema-principal">
        {/* NAVBAR */}
        <header className="navbar">
          <nav className="navbar-ruta" aria-label="Ubicación actual">
            <span>Panel Principal</span>
            <ChevronRight size={14} aria-hidden="true" />
            <strong aria-current="page">{opcionActual.nombre}</strong>
          </nav>

          <div className="navbar-acciones">
            <div className="navbar-perfil">
              {foto && !fotoFallida ? (
                <img
                  key={foto}
                  className="perfil-avatar"
                  src={foto}
                  alt={`Foto de ${nombre}`}
                  onError={() => setFotoFallida(true)}
                />
              ) : (
                <span className="perfil-iniciales" aria-hidden="true">
                  {iniciales}
                </span>
              )}

              <div className="perfil-datos">
                <strong title={nombre}>{nombre}</strong>
                <span>{rol}</span>
              </div>
            </div>

            <button
              type="button"
              className="navbar-salir"
              onClick={onLogout}
              disabled={cerrandoSesion}
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
            >
              <LogOut size={17} aria-hidden="true" />
              <span>
                {cerrandoSesion ? "Cerrando…" : "Cerrar sesión"}
              </span>
            </button>
          </div>
        </header>

        {/* Aquí puedes colocar tus vistas actuales */}
        <main className="sistema-contenido" id="contenido-principal">
          {children || (
            <>
              <div className="contenido-etiqueta">
                <span aria-hidden="true" />
                PANEL DE GESTIÓN
              </div>

              <h1>{opcionActual.nombre}</h1>
              <p className="contenido-descripcion">
                Bienvenido, {nombre}. Selecciona una opción del menú
                para comenzar.
              </p>

              <section
                className="contenido-panel"
                aria-label={opcionActual.nombre}
              >
                Aquí puedes mostrar el contenido de{" "}
                <strong>{opcionActual.nombre}</strong>.
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
