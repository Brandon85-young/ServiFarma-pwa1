import TarjetaProducto from '../components/TarjetaProducto.jsx';
import { precio, estadoExistencia } from '../data/formato.js';
import '../styles/detalle.css';

// ===== PANTALLA DE DETALLE DEL PRODUCTO - Miguel =====
// Ya no hay pestañas: descripción, modo de uso y precauciones se ven
// completas, porque en un medicamento las precauciones no deben esconderse.
export default function Detalle({ producto, productos, verProducto, irA, irACategoria }) {
  if (!producto) {
    return (
      <section className="contenedor detalle-vacio">
        <p>Este producto ya no está en el catálogo.</p>
        <button className="enlace" onClick={() => irA('catalogo')}>
          Volver al catálogo <span className="flecha">→</span>
        </button>
      </section>
    );
  }

  const existencia = estadoExistencia(producto.cantidad);

  // "Otros en la misma categoría"; si no hay, otros productos
  let relacionados = productos.filter((p) => p.categoria === producto.categoria && p.id !== producto.id);
  let tituloRelacionados = 'Otros en ' + producto.categoria;
  if (relacionados.length === 0) {
    relacionados = productos.filter((p) => p.id !== producto.id);
    tituloRelacionados = 'También te puede interesar';
  }
  relacionados = relacionados.slice(0, 4);

  return (
    <div className="detalle">
      <div className="contenedor">
        {/* Migas de pan */}
        <nav className="migas" aria-label="Ubicación">
          <button onClick={() => irACategoria('Todas')}>Catálogo</button>
          <span aria-hidden="true">/</span>
          <button onClick={() => irACategoria(producto.categoria)}>{producto.categoria}</button>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{producto.nombre}</span>
        </nav>

        <article className="detalle-cuerpo">
          <div className="detalle-imagen">
            <img src={producto.imagen} alt={producto.nombre} />
          </div>

          <div className="detalle-info">
            <p className="kicker">{producto.categoria}</p>
            <h1>{producto.nombre}</h1>
            <p className="detalle-presentacion">{producto.presentacion}</p>

            {/* Precio y existencia, como etiqueta */}
            <div className="detalle-etiqueta">
              <span className="detalle-precio dato">{precio(producto.precio)}</span>
              <span className={existencia.alerta ? 'dato alerta' : 'dato texto-suave'}>
                {existencia.texto}
              </span>
            </div>

            {producto.receta && (
              <p className="detalle-receta">Se vende solo con receta médica.</p>
            )}

            <section className="detalle-seccion">
              <h2>Descripción</h2>
              <p>{producto.descripcion}</p>
            </section>
            <section className="detalle-seccion">
              <h2>Modo de uso</h2>
              <p>{producto.modoUso}</p>
            </section>
            <section className={producto.receta ? 'detalle-seccion importante' : 'detalle-seccion'}>
              <h2>Precauciones</h2>
              <p>{producto.precauciones}</p>
            </section>

            <p className="detalle-nota texto-suave">
              ¿Dudas sobre este producto? Pregunta en mostrador o llama al{' '}
              <a className="dato" href="tel:4171665930">417 166 5930</a>.
            </p>
          </div>
        </article>

        {/* Productos relacionados */}
        <section className="relacionados">
          <h2>{tituloRelacionados}</h2>
          <div className="relacionados-lista">
            {relacionados.map((p) => (
              <TarjetaProducto key={p.id} producto={p} verProducto={verProducto} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
