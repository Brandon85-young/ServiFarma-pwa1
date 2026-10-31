import { useEffect, useState } from 'react';
import { PRODUCTOS } from '../data/productos.js';
import TarjetaProducto from '../components/TarjetaProducto.jsx';
 
// Imágenes del carrusel (multimedia)
const BANNERS = [
  { imagen: '/img/banner1.svg', texto: 'Bienvenido a ServiFarmaSerVel' },
  { imagen: '/img/banner2.svg', texto: 'Conoce nuestro catálogo de medicamentos' },
  { imagen: '/img/banner3.svg', texto: 'Abierto todos los días de 7:00 a 23:00' },
];
 
// ===== PANTALLA DE INICIO =====
export default function Inicio({ irA, verProducto }) {
  const [actual, setActual] = useState(0);
 
  // El carrusel cambia solo cada 4 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setActual((a) => (a + 1) % BANNERS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);
function anterior() {
    setActual((actual - 1 + BANNERS.length) % BANNERS.length);
  }
 
  function siguiente() {
    setActual((actual + 1) % BANNERS.length);
  }
 
  const destacados = PRODUCTOS.slice(0, 3);
 
  return (
    <section className="inicio">
      {/* ===== CARRUSEL ===== */}
      <div className="carrusel">
        <button className="flecha izquierda" onClick={anterior} aria-label="Anterior">
          ‹
        </button>
 
        <img src={BANNERS[actual].imagen} alt={BANNERS[actual].texto} />
 
        <button className="flecha derecha" onClick={siguiente} aria-label="Siguiente">
          ›
        </button>
 
        <div className="puntos">
          {BANNERS.map((b, i) => (
            <button
              key={i}
              className={i === actual ? 'punto activo' : 'punto'}
              onClick={() => setActual(i)}
              aria-label={'Ir a la imagen ' + (i + 1)}
            />
          ))}
        </div>
      </div>
 
      {/* ===== PRODUCTOS DESTACADOS ===== */}
      <h2>Productos destacados</h2>
      <div className="tarjetas">
        {destacados.map((p) => (
          <TarjetaProducto
            key={p.id}
            producto={p}
            verProducto={verProducto}
            mostrarCategoria={false}
          />
        ))}
      </div>
 
      <div className="centrado">
        <button className="btn-principal" onClick={() => irA('catalogo')}>
          Ver todo el catálogo
        </button>
      </div>
    </section>
  );
}
