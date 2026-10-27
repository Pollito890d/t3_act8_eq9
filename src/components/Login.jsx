import { useState } from "react";
import "./Login.css";
import logoCafe from '../img/hola_cafe_logo.jpeg';

function Icon({ name, ...props }) {
  const paths = {
    mail: <path d="M4 5h16v14H4z M4 6l8 6 8-6" />,
    lock: (
      <>
        <rect x="5" y="10" width="14" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 018 0v3 M12 14v3" />
      </>
    ),
    eye: (
      <>
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    eyeOff: (
      <>
        <path d="M3 3l18 18 M10.5 5.1L12 5c6.5 0 10 7 10 7a20 20 0 01-3 4 M6 6C3.4 8 2 12 2 12s3.5 7 10 7a12 12 0 005-1" />
      </>
    ),
    arrow: <path d="M5 12h14 M13 6l6 6-6 6" />,
  };

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!onLogin) {
      setError("Falta conectar el servicio de inicio de sesión.");
      return;
    }

    setLoading(true);

    try {
      await onLogin({ username: username.trim(), password, remember });
    } catch {
      setError("No se pudo iniciar sesión. Revisa tus datos e inténtalo otra vez.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <header className="login-header">
          <div className="login-brand">
            <img 
              src={logoCafe} 
              alt="Hola Café" 
              style={{ width: '163px', height: '80' }}
            />
            <span className="brand-dot" aria-hidden="true" />
          </div>

          <h1 id="login-title">¡Hola, Café!</h1>
          <p>Control de Comandas y Monitoreo de Mesas</p>
        </header>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-field">
            <label htmlFor="username">Correo o usuario</label>
            <div className="input-wrapper">
              <Icon name="mail" className="input-icon" />
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                placeholder="barista@holacafe.com"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="password">Contraseña</label>
            <div className="input-wrapper">
              <Icon name="lock" className="input-icon" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
                aria-pressed={showPassword}
                aria-controls="password"
              >
                <Icon name={showPassword ? "eyeOff" : "eye"} />
              </button>
            </div>
          </div>

          <div className="login-options">
            <label className="remember-session">
              <input
                type="checkbox"
                name="remember"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
              />
              Recordar sesión
            </label>

            <a href="/recuperar-contrasena">Olvidé mi contraseña</a>
          </div>

          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          <button
            className="login-submit"
            type="submit"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? "Entrando…" : "Entrar al Sistema"}
            {!loading && <Icon name="arrow" width="16" height="16" />}
          </button>
        </form>

        <p className="login-register">
          <a href="/registro">¿No tienes una cuenta? Registrarse</a>
        </p>
      </section>
    </main>
  );
}
