import { useState } from 'react';

// ===== PANTALLA DE LOGIN =====
// Usuario de prueba: admin / 1234 (después se conecta con Firebase)
export default function Login({ onLogin }) {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');

  function entrar(e) {
    e.preventDefault();

    if (usuario.trim() === '' || contrasena === '') {
      setError('Escribe tu usuario y tu contraseña.');
      return;
    }
    if (usuario !== 'admin' || contrasena !== '1234') {
      setError('Usuario o contraseña incorrectos.');
      return;
    }

    setError('');
    onLogin(usuario);
  }

  return (
    <section className="login">
      <form className="login-caja" onSubmit={entrar}>
        <h2>Iniciar sesión</h2>

        <label htmlFor="usuario">Usuario</label>
        <input
          id="usuario"
          type="text"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          placeholder="Escribe tu usuario"
        />

        <label htmlFor="contrasena">Contraseña</label>
        <input
          id="contrasena"
          type="password"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          placeholder="Escribe tu contraseña"
        />

        {error && <p className="mensaje-error">{error}</p>}

        <button type="submit" className="btn-principal">Entrar</button>
      </form>
    </section>
  );
}
