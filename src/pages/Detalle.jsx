// ===== PANTALLA DE DETALLE DEL PRODUCTO =====
export default function Detalle({ producto, volver }) {
  if (!producto) return null;

  return (
    <section className="detalle">
      <button className="btn-volver" onClick={volver}>
        ← Volver al catálogo
      </button>

      <h2>{producto.nombre}</h2>

      <div className="detalle-contenido">
        <div className="detalle-imagen">
          <img src={producto.imagen} alt={producto.nombre} />
        </div>

        <div className="detalle-info">
          <p className="precio grande">${producto.precio}.00</p>
          <p>{producto.descripcion}</p>
        </div>
      </div>
    </section>
  );
}
