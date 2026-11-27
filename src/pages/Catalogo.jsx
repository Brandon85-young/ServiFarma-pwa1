import { useState } from 'react';
import TarjetaProducto from '../components/TarjetaProducto.jsx';
import '../styles/catalogo.css';

// ===== PANTALLA DE CATÁLOGO - Brandon =====
export default function Catalogo({
  productos,
  categorias,
  busqueda,
  setBusqueda,
  categoria,
  setCategoria,
  verProducto,
}) {
  const [orden, setOrden] = useState('nombre');
  // En celular empieza en lista; en computadora, en cuadrícula
  const [forma, setForma] = useState(() =>
    window.innerWidth < 600 ? 'renglon' : 'tarjeta'
  );

  // 1) Filtra por categoría y por búsqueda
  let lista = productos;
  if (categoria !== 'Todas') lista = lista.filter((p) => p.categoria === categoria);
  if (busqueda) {
    lista = lista.filter((p) => p.nombre.toLowerCase().includes(busqueda.toLowerCase()));
  }

  // 2) Ordena
  lista = [...lista].sort((a, b) => {
    if (orden === 'menor') return a.precio - b.precio;
    if (orden === 'mayor') return b.precio - a.precio;
    return a.nombre.localeCompare(b.nombre);
  });

  const opciones = ['Todas', ...categorias];
  const contar = (cat) =>
    cat === 'Todas' ? productos.length : productos.filter((p) => p.categoria === cat).length;

  return (
    <section className="contenedor catalogo">
      {/* ===== CATEGORÍAS: lista lateral en computadora, fila deslizable en celular ===== */}
      <nav className="cat-lista" aria-label="Categorías">
        <p className="kicker cat-titulo">Categorías</p>
        {opciones.map((cat) => (
          <button
            key={cat}
            className={categoria === cat ? 'activa' : ''}
            onClick={() => setCategoria(cat)}
          >
            <span>{cat === 'Todas' ? 'Todos' : cat}</span>
            <span className="dato cat-num">{contar(cat)}</span>
          </button>
        ))}
      </nav>

      <div className="cat-contenido">
        <header className="cat-cabeza">
          <div>
            <p className="kicker">Catálogo</p>
            <h1>{categoria === 'Todas' ? 'Todos los productos' : categoria}</h1>
          </div>

          <div className="cat-controles">
            <select className="campo" value={orden} onChange={(e) => setOrden(e.target.value)} aria-label="Ordenar">
              <option value="nombre">A – Z</option>
              <option value="menor">Precio: menor a mayor</option>
              <option value="mayor">Precio: mayor a menor</option>
            </select>
            <div className="cat-forma" role="group" aria-label="Forma de ver">
              <button className={forma === 'tarjeta' ? 'activa' : ''} onClick={() => setForma('tarjeta')}>
                Cuadrícula
              </button>
              <button className={forma === 'renglon' ? 'activa' : ''} onClick={() => setForma('renglon')}>
                Lista
              </button>
            </div>
          </div>
        </header>

        <p className="cat-resumen texto-suave">
          <span className="dato">{lista.length}</span> {lista.length === 1 ? 'producto' : 'productos'}
          {busqueda && (
            <>
              {' '}para “{busqueda}” ·{' '}
              <button className="enlace" onClick={() => setBusqueda('')}>Quitar búsqueda</button>
            </>
          )}
        </p>

        {lista.length > 0 ? (
          <div className={forma === 'tarjeta' ? 'cat-cuadricula' : 'cat-renglones'}>
            {lista.map((p) => (
              <TarjetaProducto key={p.id} producto={p} verProducto={verProducto} forma={forma} />
            ))}
          </div>
        ) : (
          <div className="cat-vacio">
            <p>No encontramos ese producto.</p>
            <p className="texto-suave">
              Puede que sí lo tengamos en tienda: llama al <a className="dato" href="tel:4171665930">417 166 5930</a>.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
