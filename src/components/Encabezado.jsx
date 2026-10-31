import { useState } from 'react';
 
// ===== ENCABEZADO (aparece en todas las pantallas) =====
export default function Encabezado({ vista, irA, busqueda, setBusqueda, usuario, onSalir }) {
  const [menuAbierto, setMenuAbierto] = useState(false);
 
  function ir(destino) {
    irA(destino);
    setMenuAbierto(false);
  }
 
  // Al escribir en el buscador se abre el catálogo
  function buscar(texto) {
    setBusqueda(texto);
    if (vista !== 'catalogo') irA('catalogo');
  }
 
  return (
    <header className="encabezado">
      <button className="logo" onClick={() => ir('inicio')}>
        ServiFarma
      </button>
 
      <button
        className="btn-menu"
        aria-label="Abrir menú"
        onClick={() => setMenuAbierto(!menuAbierto)}
      >
        ☰
      </button>
 
      <nav className={menuAbierto ? 'menu abierto' : 'menu'}>
        <button className={vista === 'inicio' ? 'activo' : ''} onClick={() => ir('inicio')}>
          Inicio
        </button>
        <button className={vista === 'catalogo' ? 'activo' : ''} onClick={() => ir('catalogo')}>
          Catálogo
        </button>
 
        <input
          type="search"
          className="buscador"
          placeholder="Buscar medicamento..."
          value={busqueda}
          onChange={(e) => buscar(e.target.value)}
        />
 
        {usuario ? (
          <span className="usuario">
            Hola, {usuario}
            <button className="btn-login" onClick={onSalir}>Salir</button>
          </span>
        ) : (
          <button className="btn-login" onClick={() => ir('login')}>
            Login
          </button>
        )}
      </nav>
    </header>
  );
}
