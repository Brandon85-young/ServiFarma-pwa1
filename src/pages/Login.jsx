import { useState } from 'react';
import { iniciarSesion, mensajeError, usaFirebase } from '../data/basedatos.js';
import '../styles/login.css';

// ===== PANTALLA DE LOGIN - Máximo =====
// Usa Firebase Authentication (correo y contraseña).
// Sin Firebase configurado, el usuario de prueba es admin / 1234.
export default function Login({ onLogin, irA }) {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [verContrasena, setVerContrasena] = useState(false);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function entrar(e) {
    e.preventDefault();

    if (usuario.trim() === '' || contrasena === '') {
      setError('Escribe tu correo y tu contraseña.');
      return;
    }

    setError('');
    setEnviando(true);
    try {
      await iniciarSesion(usuario.trim(), contrasena);
      onLogin();
    } catch (err) {
      setError(mensajeError(err));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="contenedor login">
      <div className="login-texto">
        <p className="kicker">Acceso de personal</p>
        <h1>Solo para el personal de ServiFarma.</h1>
        <p className="texto-suave lectura">
          Desde aquí se actualizan el inventario, los precios y las fechas de caducidad.
          Si eres cliente, el catálogo está abierto para todos.
        </p>
        <button className="enlace login-volver" onClick={() => irA('catalogo')}>
          Ir al catálogo <span className="flecha">→</span>
        </button>
      </div>

      <form className="login-form" onSubmit={entrar} noValidate>
        <div className="login-campo">
          <label htmlFor="usuario">{usaFirebase ? 'Correo' : 'Usuario'}</label>
          <input
            id="usuario"
            className="campo"
            type={usaFirebase ? 'email' : 'text'}
            autoComplete="username"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
        </div>

        <div className="login-campo">
          <div className="login-etiqueta">
            <label htmlFor="contrasena">Contraseña</label>
            <button type="button" className="login-ver" onClick={() => setVerContrasena(!verContrasena)}>
              {verContrasena ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
          <input
            id="contrasena"
            className="campo"
            type={verContrasena ? 'text' : 'password'}
            autoComplete="current-password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
          />
        </div>

        {error && <p className="login-error" role="alert">{error}</p>}

        <button type="submit" className="btn btn-principal login-entrar" disabled={enviando}>
          {enviando ? 'Entrando…' : 'Entrar al panel'}
        </button>
        {!usaFirebase && <p className="login-prueba dato">Modo local · prueba: admin / 1234</p>}
      </form>
    </section>
  );
}
