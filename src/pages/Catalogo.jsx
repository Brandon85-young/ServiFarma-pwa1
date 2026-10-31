import { useState } from 'react';
import { CATEGORIAS, PRODUCTOS } from '../data/productos.js';
import TarjetaProducto from '../components/TarjetaProducto.jsx';
 
// ===== PANTALLA DE CATÁLOGO =====
export default function Catalogo({ busqueda, verProducto }) {
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [orden, setOrden] = useState('nombre');
  const [filtroAbierto, setFiltroAbierto] = useState(false);
 
  // Marca o desmarca una categoría del filtro
  function cambiarCategoria(cat) {
    if (seleccionadas.includes(cat)) {
      setSeleccionadas(seleccionadas.filter((c) => c !== cat));
    } else {
      setSeleccionadas([...seleccionadas, cat]);
    }
  }
 
  // 1) Filtra por búsqueda y por categoría
  let lista = PRODUCTOS.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );
  if (seleccionadas.length > 0) {
    lista = lista.filter((p) => seleccionadas.includes(p.categoria));
  }
 
  // 2) Ordena
  lista = [...lista].sort((a, b) => {
    if (orden === 'menor') return a.precio - b.precio;
    if (orden === 'mayor') return b.precio - a.precio;
    return a.nombre.localeCompare(b.nombre);
  });
 
  return (
    <section className="catalogo">
      {/* ===== FILTRO (barra lateral) ===== */}
      <aside className={filtroAbierto ? 'filtro abierto' : 'filtro'}>
        <h3>Filtro</h3>
        {CATEGORIAS.map((cat) => (
          <label key={cat} className="opcion">
            <input
              type="checkbox"
              checked={seleccionadas.includes(cat)}
              onChange={() => cambiarCategoria(cat)}
            />
            {cat}
          </label>
        ))}
        {seleccionadas.length > 0 && (
          <button className="btn-limpiar" onClick={() => setSeleccionadas([])}>
            Quitar filtros
          </button>
        )}
      </aside>
 
      <div className="catalogo-contenido">
        <div className="catalogo-encabezado">
          <h2>Catálogo</h2>
          <div className="controles">
            <button className="btn-filtro" onClick={() => setFiltroAbierto(!filtroAbierto)}>
              Filtro
            </button>
            <select value={orden} onChange={(e) => setOrden(e.target.value)}>
              <option value="nombre">Ordenar: A - Z</option>
              <option value="menor">Precio: menor a mayor</option>
              <option value="mayor">Precio: mayor a menor</option>
            </select>
          </div>
        </div>
 
        {busqueda && <p className="nota">Resultados para: "{busqueda}"</p>}
 
        <div className="tarjetas">
          {lista.map((p) => (
            <TarjetaProducto key={p.id} producto={p} verProducto={verProducto} />
          ))}
        </div>
 
        {lista.length === 0 && (
          <p className="vacio">No se encontró ningún producto.</p>
        )}
      </div>
    </section>
  );
}
