// ===== TARJETA DE PRODUCTO =====
// Se usa en Inicio y en Catálogo.
export default function TarjetaProducto({ producto, verProducto }) {
  return (
    <article className="tarjeta" onClick={() => verProducto(producto)}>
      <img src={producto.imagen} alt={producto.nombre} loading="lazy" />
      <h3>{producto.nombre}</h3>
      <p className="precio">${producto.precio}.00</p>
    </article>
  );
}
