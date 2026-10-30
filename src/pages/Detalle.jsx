import { useState } from 'react';

// ===== PANTALLA DE DETALLE DEL PRODUCTO =====
// Los botones cambian la información que se ve del producto.
export default function Detalle({ producto, volver }) {
  const [pestana, setPestana] = useState('descripcion');

  if (!producto) return null;

  // Mensaje según cuántas piezas quedan
  let estado = { texto: 'Disponible', clase: 'disponible' };
  if (producto.cantidad === 0) estado = { texto: 'Agotado', clase: 'agotado' };
  else if (producto.cantidad < 10) estado = { texto: 'Quedan pocas piezas', clase: 'pocas' };

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
          <span className={'estado ' + estado.clase}>{estado.texto}</span>

          {/* ===== BOTONES PARA VER MÁS INFORMACIÓN ===== */}
          <div className="pestanas">
            <button
              className={pestana === 'descripcion' ? 'pestana activa' : 'pestana'}
              onClick={() => setPestana('descripcion')}
            >
              Descripción
            </button>
            <button
              className={pestana === 'uso' ? 'pestana activa' : 'pestana'}
              onClick={() => setPestana('uso')}
            >
              Modo de uso
            </button>
            <button
              className={pestana === 'precauciones' ? 'pestana activa' : 'pestana'}
              onClick={() => setPestana('precauciones')}
            >
              Precauciones
            </button>
            <button
              className={pestana === 'existencia' ? 'pestana activa' : 'pestana'}
              onClick={() => setPestana('existencia')}
            >
              Cantidad
            </button>
          </div>

          <div className="panel">
            {pestana === 'descripcion' && <p>{producto.descripcion}</p>}
            {pestana === 'uso' && <p>{producto.modoUso}</p>}
            {pestana === 'precauciones' && <p>{producto.precauciones}</p>}
            {pestana === 'existencia' && (
              <ul>
                <li>Cantidad disponible: {producto.cantidad} piezas</li>
                <li>Categoría: {producto.categoria}</li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
