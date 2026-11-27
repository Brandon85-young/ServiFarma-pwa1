// ===== ENCABEZADO - Michelle =====
// Franja con "Abierto ahora", logotipo, buscador siempre visible y menú.

// La farmacia abre de 7:00 a 23:00 todos los días
function estaAbierto() {
  const hora = new Date().getHours();
  return hora >= 7 && hora < 23;
}

export default function Encabezado({ vista, irA, busqueda, setBusqueda, usuario, onSalir }) {
  const abierto = estaAbierto();

  // Al escribir en el buscador se abre el catálogo
  function buscar(texto) {
    setBusqueda(texto);
    if (vista !== 'catalogo') irA('catalogo');
  }

  return (
    <header className="encabezado">
      <div className="franja">
        <div className="contenedor franja-in">
          <span className={abierto ? 'estado-tienda abierto' : 'estado-tienda'}>
            <i aria-hidden="true" />
            <strong>{abierto ? 'Abierto ahora' : 'Cerrado'}</strong>
            <span className="dato">7:00–23:00</span>
          </span>
          <a href="tel:4171665930" className="dato">417 166 5930</a>
        </div>
      </div>

      <div className="contenedor barra">
        <button className="logo" onClick={() => irA('inicio')}>
          ServiFarma<span>SerVel</span>
        </button>

        <nav className="nav" aria-label="Principal">
          <button className={vista === 'inicio' ? 'activo' : ''} onClick={() => irA('inicio')}>
            Inicio
          </button>
          <button
            className={vista === 'catalogo' || vista === 'detalle' ? 'activo' : ''}
            onClick={() => irA('catalogo')}
          >
            Catálogo
          </button>
          {usuario ? (
            <>
              <button className={vista === 'admin' ? 'activo' : ''} onClick={() => irA('admin')}>
                Panel
              </button>
              <button onClick={onSalir}>Salir</button>
            </>
          ) : (
            <button className={vista === 'login' ? 'activo' : ''} onClick={() => irA('login')}>
              Personal
            </button>
          )}
        </nav>

        <label className="buscador">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="search"
            className="campo"
            placeholder="Buscar medicamento"
            aria-label="Buscar medicamento"
            value={busqueda}
            onChange={(e) => buscar(e.target.value)}
          />
        </label>
      </div>
    </header>
  );
}
