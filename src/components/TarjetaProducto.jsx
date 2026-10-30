// ===== TARJETA DE PRODUCTO =====
// Se usa en Inicio y en Catálogo. El botón "Ver más" abre el detalle.
export default function TarjetaProducto({ producto, verProducto, mostrarCategoria = true }) {
  const agotado = producto.cantidad === 0;

  return (
    <article className="tarjeta" onClick={() => verProducto(producto)}>
      <div className="tarjeta-imagen">
        <img src={producto.imagen} alt={producto.nombre} loading="lazy" />
        {agotado && <span className="sello-agotado">Agotado</span>}
      </div>

      <h3>{producto.nombre}</h3>
      {mostrarCategoria && <p className="categoria">{producto.categoria}</p>}
      <p className="precio">${producto.precio}.00</p>

      <button
        className="btn-vermas"
        onClick={(e) => {
          e.stopPropagation(); // para que no se abra dos veces
          verProducto(producto);
        }}
      >
        Ver más
      </button>
    </article>
  );
}
