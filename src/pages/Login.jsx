// ===== PANTALLA DE LOGIN =====
export default function Login() {
  return (
    <section className="login">
      <form className="login-caja">
        <h2>Iniciar sesión</h2>

        <label htmlFor="usuario">Usuario</label>
        <input id="usuario" type="text" placeholder="Escribe tu usuario" />

        <label htmlFor="contrasena">Contraseña</label>
        <input id="contrasena" type="password" placeholder="Escribe tu contraseña" />

        <button type="submit" className="btn-principal">Entrar</button>
      </form>
    </section>
  );
}
