import { useState } from 'react';
import TarjetaProducto from '../components/TarjetaProducto.jsx';
import { precio } from '../data/formato.js';
import '../styles/inicio.css';

// Turnos reales del personal de la farmacia
const TURNOS = [
  { nombre: 'Mañana', horas: '7:00–15:00' },
  { nombre: 'Tarde', horas: '13:00–21:00' },
  { nombre: 'Noche', horas: '15:00–23:00' },
];

const SUGERENCIAS = ['Paracetamol', 'Loratadina', 'Vitamina C'];

export default function Inicio({ productos, categorias, irA, verProducto, irACategoria, setBusqueda }) {
  const [texto, setTexto] = useState('');

  function buscar(e) {
    e.preventDefault();
    setBusqueda(texto);
    irA('catalogo');
  }

  function buscarSugerencia(palabra) {
    setBusqueda(palabra);
    irA('catalogo');
  }

  // Recomendados: los que la farmacia marca en el panel
  const recomendados = productos.filter((p) => p.destacado);
  const principal = recomendados[0];
  const resto = recomendados.slice(1, 4);

  return (
    <div className="inicio">
      {/* ===== PORTADA ===== */}
      <section className="contenedor portada">
        <div className="portada-texto">
          <p className="kicker">Farmacia · Acámbaro, Gto.</p>
          <h1>Consulta precios y existencias antes de venir.</h1>
          <p className="lectura texto-suave portada-bajada">
            Busca tu medicamento y revisa si lo tenemos en tienda. La compra se hace
            directo en mostrador.
          </p>

          <form className="portada-buscar" onSubmit={buscar}>
            <input
              className="campo"
              type="search"
              placeholder="¿Qué medicamento buscas?"
              aria-label="¿Qué medicamento buscas?"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
            />
            <button className="btn btn-principal" type="submit">Buscar</button>
          </form>

          <p className="sugerencias texto-suave">
            Lo más buscado:{' '}
            {SUGERENCIAS.map((s, i) => (
              <span key={s}>
                <button onClick={() => buscarSugerencia(s)}>{s}</button>
                {i < SUGERENCIAS.length - 1 && ' · '}
              </span>
            ))}
          </p>
        </div>

        {/* Ficha estilo etiqueta con los datos de la sucursal */}
        <aside className="ficha" aria-label="Datos de la sucursal">
          <p className="kicker">Ficha de la sucursal</p>
          <dl>
            <div>
              <dt>Dirección</dt>
              <dd>Loma Bonita #34, entre Sierra Mojada y Sierra León</dd>
            </div>
            <div>
              <dt>Horario</dt>
              <dd className="dato">Lun–Dom · 7:00–23:00</dd>
            </div>
            <div>
              <dt>Teléfono</dt>
              <dd className="dato">417 166 5930</dd>
            </div>
          </dl>
          <a className="btn btn-linea ficha-llamar" href="tel:4171665930">
            Llamar a la farmacia
          </a>
        </aside>
      </section>

      {/* ===== CATEGORÍAS COMO ÍNDICE ===== */}
      <section className="contenedor bloque indice">
        <div className="bloque-titulo">
          <h2>Categorías</h2>
          <p className="texto-suave">Entra directo a lo que necesitas.</p>
        </div>

        <ol className="indice-lista">
          {categorias.map((cat, i) => {
            const total = productos.filter((p) => p.categoria === cat).length;
            return (
              <li key={cat}>
                <button onClick={() => irACategoria(cat)}>
                  <span className="indice-num dato">{String(i + 1).padStart(2, '0')}</span>
                  <span className="indice-nombre">{cat}</span>
                  <span className="indice-total dato">
                    {total} {total === 1 ? 'producto' : 'productos'}
                  </span>
                  <span className="indice-flecha" aria-hidden="true">→</span>
                </button>
              </li>
            );
          })}
        </ol>
      </section>

      {/* ===== RECOMENDADOS (asimétrico: 1 grande + lista) ===== */}
      {principal && (
        <section className="contenedor bloque recomendados">
          <div className="recomendados-cabeza">
            <h2>Recomendados por la farmacia</h2>
            <button className="enlace" onClick={() => irACategoria('Todas')}>
              Ver todo el catálogo <span className="flecha">→</span>
            </button>
          </div>

          <div className="recomendados-cuerpo">
            <button className="principal" onClick={() => verProducto(principal)}>
              <span className="principal-imagen">
                <img src={principal.imagen} alt="" />
              </span>
              <span className="principal-info">
                <span className="kicker">{principal.categoria}</span>
                <span className="principal-nombre">{principal.nombre}</span>
                <span className="texto-suave">{principal.presentacion}</span>
                <span className="principal-precio dato">{precio(principal.precio)}</span>
              </span>
            </button>

            <div className="recomendados-lista">
              {resto.map((p) => (
                <TarjetaProducto key={p.id} producto={p} verProducto={verProducto} forma="renglon" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== AVISO HONESTO ===== */}
      <section className="contenedor">
        <p className="aviso lectura">
          <strong>Aquí solo consultas.</strong> La compra y el pago se hacen en mostrador.
          Los antibióticos se venden únicamente con receta médica.
        </p>
      </section>

      {/* ===== VISÍTANOS (único bloque morado del sitio) ===== */}
      <section className="visitanos">
        <div className="contenedor visitanos-in">
          <div>
            <p className="kicker">Visítanos</p>
            <h2>Loma Bonita #34, Acámbaro.</h2>
            <p className="visitanos-texto">
              Entre las calles Sierra Mojada y Sierra León. Sucursal única, atendida
              por tres turnos para cubrir todo el día.
            </p>
            <a
              className="enlace"
              href="https://www.google.com/maps/search/?api=1&query=Loma+Bonita+34+Acambaro+Guanajuato"
              target="_blank"
              rel="noreferrer"
            >
              Cómo llegar <span className="flecha">→</span>
            </a>
          </div>

          <table className="turnos">
            <caption className="kicker">Turnos de atención</caption>
            <tbody>
              {TURNOS.map((t) => (
                <tr key={t.nombre}>
                  <th scope="row">{t.nombre}</th>
                  <td className="dato">{t.horas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
