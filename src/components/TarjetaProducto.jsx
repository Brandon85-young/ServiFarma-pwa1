import { precio, estadoExistencia } from '../data/formato.js';
import '../styles/tarjeta.css';

// ===== TARJETA DE PRODUCTO - Brandon =====
// Toda la tarjeta es un botón (ya no hace falta "Ver más").
// forma="tarjeta" -> imagen arriba, para cuadrícula
// forma="renglon" -> imagen chica a la izquierda, para listas
export default function TarjetaProducto({ producto, verProducto, forma = 'tarjeta' }) {
  const existencia = estadoExistencia(producto.cantidad);

  return (
    <button className={'tp tp-' + forma} onClick={() => verProducto(producto)}>
      <span className="tp-imagen">
        <img src={producto.imagen} alt="" loading="lazy" />
      </span>

      <span className="tp-info">
        <span className="tp-nombre">{producto.nombre}</span>
        <span className="tp-presentacion">{producto.presentacion}</span>
        {existencia.alerta && <span className="tp-alerta">{existencia.texto}</span>}
      </span>

      <span className="tp-precio dato">{precio(producto.precio)}</span>
      <span className="tp-flecha" aria-hidden="true">→</span>
    </button>
  );
}
