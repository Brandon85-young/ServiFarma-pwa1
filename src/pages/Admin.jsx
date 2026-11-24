import { useState } from 'react';
import {
  crearProducto,
  actualizarProducto,
  borrarProducto,
  crearCategoria,
  renombrarCategoria,
  borrarCategoria,
  cargarDatosIniciales,
  mensajeError,
  usaFirebase,
} from '../data/basedatos.js';
import { precio, diasPara, fechaCorta } from '../data/formato.js';
import '../styles/admin.css';

// ===== PANEL DE ADMINISTRACIÓN - Juan =====
// CRUD de productos y de categorías (Firestore) + control de caducidades.

const VACIO = {
  nombre: '',
  categoria: '',
  presentacion: '',
  precio: '',
  cantidad: '',
  caducidad: '',
  receta: false,
  destacado: false,
  descripcion: '',
  modoUso: '',
  precauciones: '',
  imagen: '/img/productos/generico.svg',
};

export default function Admin({ productos, categorias, usuario }) {
  const [seccion, setSeccion] = useState('productos');
  const [subiendo, setSubiendo] = useState(false);
  const [errorSubir, setErrorSubir] = useState('');

  async function subirEjemplo() {
    setSubiendo(true);
    setErrorSubir('');
    try {
      await cargarDatosIniciales();
    } catch (err) {
      setErrorSubir(mensajeError(err));
    }
    setSubiendo(false);
  }

  const vencidos = productos.filter((p) => p.caducidad && diasPara(p.caducidad) < 0).length;
  const porVencer = productos.filter((p) => {
    const d = p.caducidad ? diasPara(p.caducidad) : 999;
    return d >= 0 && d <= 60;
  }).length;

  return (
    <div className="contenedor admin">
      <aside className="admin-menu">
        <p className="kicker">Panel · {usuario}</p>
        <p className="admin-fuente dato">{usaFirebase ? '● Conectado a Firestore' : '○ Modo local (sin Firebase)'}</p>
        <nav>
          <button className={seccion === 'productos' ? 'activo' : ''} onClick={() => setSeccion('productos')}>
            Productos <span className="dato">{productos.length}</span>
          </button>
          <button className={seccion === 'categorias' ? 'activo' : ''} onClick={() => setSeccion('categorias')}>
            Categorías <span className="dato">{categorias.length}</span>
          </button>
          <button className={seccion === 'caducidades' ? 'activo' : ''} onClick={() => setSeccion('caducidades')}>
            Caducidades {vencidos + porVencer > 0 && <span className="dato alerta">{vencidos + porVencer}</span>}
          </button>
        </nav>
      </aside>

      <div className="admin-contenido">
        {/* Base vacía: botón para subir los datos de ejemplo una sola vez */}
        {productos.length === 0 && categorias.length === 0 && (
          <div className="admin-vacia">
            <p><strong>La base de datos está vacía.</strong> Sube los 8 productos y 5 categorías de ejemplo para empezar.</p>
            <button className="btn btn-principal" onClick={subirEjemplo} disabled={subiendo}>
              {subiendo ? 'Subiendo…' : 'Cargar datos de ejemplo'}
            </button>
            {errorSubir && <p className="admin-error">{errorSubir}</p>}
          </div>
        )}
        {seccion === 'productos' && <Productos productos={productos} categorias={categorias} />}
        {seccion === 'categorias' && <Categorias categorias={categorias} productos={productos} />}
        {seccion === 'caducidades' && (
          <Caducidades productos={productos} vencidos={vencidos} porVencer={porVencer} />
        )}
      </div>
    </div>
  );
}

// ===================== PRODUCTOS (CRUD) =====================
function Productos({ productos, categorias }) {
  const [form, setForm] = useState(null); // null = cerrado
  const [editandoId, setEditandoId] = useState(null);
  const [borrarId, setBorrarId] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');
  const [guardando, setGuardando] = useState(false);

  function nuevo() {
    setForm({ ...VACIO, categoria: categorias[0] || '' });
    setEditandoId(null);
    setError('');
  }

  function editar(p) {
    setForm({ ...p });
    setEditandoId(p.id);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cambiar(campo, valor) {
    setForm({ ...form, [campo]: valor });
  }

  async function guardar(e) {
    e.preventDefault();
    if (form.nombre.trim() === '') return setError('El nombre es obligatorio.');
    if (form.precio === '' || Number(form.precio) < 0) return setError('Escribe un precio válido.');
    if (form.cantidad === '' || Number(form.cantidad) < 0) return setError('Escribe una cantidad válida.');

    const datos = { ...form, precio: Number(form.precio), cantidad: Number(form.cantidad) };

    setGuardando(true);
    try {
      if (editandoId) {
        await actualizarProducto(editandoId, datos);
        setAviso(`Se actualizó “${datos.nombre}”.`);
      } else {
        await crearProducto(datos);
        setAviso(`Se agregó “${datos.nombre}”.`);
      }
      setForm(null);
      setEditandoId(null);
    } catch (err) {
      setError(mensajeError(err));
    }
    setGuardando(false);
  }

  async function borrar(p) {
    try {
      await borrarProducto(p.id);
      setAviso(`Se borró “${p.nombre}”.`);
    } catch (err) {
      setAviso(mensajeError(err));
    }
    setBorrarId(null);
  }

  const lista = productos
    .filter((p) => p.nombre.toLowerCase().includes(filtro.toLowerCase()))
    .sort((a, b) => a.nombre.localeCompare(b.nombre));

  return (
    <section>
      <header className="admin-cabeza">
        <h1>Productos</h1>
        {!form && (
          <button className="btn btn-principal" onClick={nuevo}>+ Nuevo producto</button>
        )}
      </header>

      {aviso && (
        <p className="admin-aviso" role="status">
          {aviso} <button onClick={() => setAviso('')} aria-label="Cerrar aviso">×</button>
        </p>
      )}

      {/* ----- Formulario para crear / editar ----- */}
      {form && (
        <form className="admin-form" onSubmit={guardar} noValidate>
          <h2>{editandoId ? 'Editar producto' : 'Nuevo producto'}</h2>

          <div className="admin-campos">
            <label className="ancho-2">Nombre
              <input className="campo" value={form.nombre} onChange={(e) => cambiar('nombre', e.target.value)} />
            </label>
            <label>Categoría
              <select className="campo" value={form.categoria} onChange={(e) => cambiar('categoria', e.target.value)}>
                {categorias.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label>Presentación
              <input className="campo" placeholder="Caja con 10 tabletas" value={form.presentacion} onChange={(e) => cambiar('presentacion', e.target.value)} />
            </label>
            <label>Precio ($)
              <input className="campo dato" type="number" min="0" step="0.5" value={form.precio} onChange={(e) => cambiar('precio', e.target.value)} />
            </label>
            <label>Existencia (piezas)
              <input className="campo dato" type="number" min="0" value={form.cantidad} onChange={(e) => cambiar('cantidad', e.target.value)} />
            </label>
            <label>Caducidad
              <input className="campo dato" type="date" value={form.caducidad} onChange={(e) => cambiar('caducidad', e.target.value)} />
            </label>
            <div className="admin-checks">
              <label className="check">
                <input type="checkbox" checked={form.receta} onChange={(e) => cambiar('receta', e.target.checked)} />
                Requiere receta
              </label>
              <label className="check">
                <input type="checkbox" checked={form.destacado} onChange={(e) => cambiar('destacado', e.target.checked)} />
                Recomendado en inicio
              </label>
            </div>
            <label className="ancho-2">Descripción
              <textarea className="campo" rows="2" value={form.descripcion} onChange={(e) => cambiar('descripcion', e.target.value)} />
            </label>
            <label className="ancho-2">Modo de uso
              <textarea className="campo" rows="2" value={form.modoUso} onChange={(e) => cambiar('modoUso', e.target.value)} />
            </label>
            <label className="ancho-2">Precauciones
              <textarea className="campo" rows="2" value={form.precauciones} onChange={(e) => cambiar('precauciones', e.target.value)} />
            </label>
          </div>

          {error && <p className="admin-error" role="alert">{error}</p>}

          <div className="admin-botones">
            <button type="submit" className="btn btn-principal" disabled={guardando}>
              {guardando ? 'Guardando…' : editandoId ? 'Guardar cambios' : 'Agregar producto'}
            </button>
            <button type="button" className="btn btn-linea" onClick={() => setForm(null)}>Cancelar</button>
          </div>
        </form>
      )}

      {/* ----- Tabla de productos ----- */}
      <input
        className="campo admin-filtro"
        type="search"
        placeholder="Filtrar por nombre"
        aria-label="Filtrar por nombre"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />

      <table className="tabla">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Categoría</th>
            <th className="num">Precio</th>
            <th className="num">Existencia</th>
            <th>Caducidad</th>
            <th><span className="oculto">Acciones</span></th>
          </tr>
        </thead>
        <tbody>
          {lista.map((p) => (
            <tr key={p.id} className={editandoId === p.id ? 'editando' : ''}>
              <td data-etiqueta="Producto">
                <strong>{p.nombre}</strong>
                <span className="texto-suave tabla-sub">{p.presentacion}</span>
              </td>
              <td data-etiqueta="Categoría">{p.categoria}</td>
              <td data-etiqueta="Precio" className="num dato">{precio(p.precio)}</td>
              <td data-etiqueta="Existencia" className={p.cantidad < 10 ? 'num dato alerta' : 'num dato'}>
                {p.cantidad}
              </td>
              <td data-etiqueta="Caducidad" className={p.caducidad && diasPara(p.caducidad) <= 60 ? 'dato alerta' : 'dato'}>
                {fechaCorta(p.caducidad)}
              </td>
              <td>
                <span className="tabla-acciones">
                {borrarId === p.id ? (
                  <span className="confirmar">
                    ¿Borrar?
                    <button className="alerta" onClick={() => borrar(p)}>Sí, borrar</button>
                    <button onClick={() => setBorrarId(null)}>No</button>
                  </span>
                ) : (
                  <>
                    <button onClick={() => editar(p)}>Editar</button>
                    <button className="alerta" onClick={() => setBorrarId(p.id)}>Borrar</button>
                  </>
                )}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {lista.length === 0 && <p className="texto-suave admin-vacio">No hay productos con ese nombre.</p>}
    </section>
  );
}

// ===================== CATEGORÍAS (CRUD) =====================
function Categorias({ categorias, productos }) {
  const [nueva, setNueva] = useState('');
  const [editando, setEditando] = useState(null);
  const [texto, setTexto] = useState('');
  const [mensaje, setMensaje] = useState('');

  const enUso = (cat) => productos.filter((p) => p.categoria === cat).length;
  const existe = (nombre) => categorias.some((c) => c.toLowerCase() === nombre.toLowerCase());

  // En Firestore el nombre es el id del documento, así que no puede llevar "/"
  function nombreValido(nombre) {
    if (!nombre) return false;
    if (nombre.includes('/')) {
      setMensaje('El nombre no puede llevar “/”.');
      return false;
    }
    if (existe(nombre)) {
      setMensaje('Esa categoría ya existe.');
      return false;
    }
    return true;
  }

  async function agregar(e) {
    e.preventDefault();
    const nombre = nueva.trim();
    if (!nombreValido(nombre)) return;
    try {
      await crearCategoria(nombre);
      setNueva('');
      setMensaje('');
    } catch (err) {
      setMensaje(mensajeError(err));
    }
  }

  async function guardar(vieja) {
    const nombre = texto.trim();
    if (!nombre || nombre === vieja) return setEditando(null);
    if (!nombreValido(nombre)) return;
    try {
      // Los productos de esa categoría también cambian de nombre
      await renombrarCategoria(vieja, nombre);
      setEditando(null);
      setMensaje('');
    } catch (err) {
      setMensaje(mensajeError(err));
    }
  }

  async function borrar(cat) {
    if (enUso(cat) > 0) {
      return setMensaje(`“${cat}” tiene productos. Muévelos a otra categoría antes de borrarla.`);
    }
    try {
      await borrarCategoria(cat);
      setMensaje('');
    } catch (err) {
      setMensaje(mensajeError(err));
    }
  }

  return (
    <section>
      <header className="admin-cabeza">
        <h1>Categorías</h1>
      </header>

      <form className="admin-agregar" onSubmit={agregar}>
        <input className="campo" placeholder="Nombre de la nueva categoría" value={nueva} onChange={(e) => setNueva(e.target.value)} />
        <button className="btn btn-principal" type="submit">Agregar</button>
      </form>

      {mensaje && <p className="admin-error" role="alert">{mensaje}</p>}

      <ul className="admin-cats">
        {categorias.map((cat) => (
          <li key={cat}>
            {editando === cat ? (
              <>
                <input
                  className="campo"
                  value={texto}
                  autoFocus
                  onChange={(e) => setTexto(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && guardar(cat)}
                />
                <span className="tabla-acciones">
                  <button onClick={() => guardar(cat)}>Guardar</button>
                  <button onClick={() => setEditando(null)}>Cancelar</button>
                </span>
              </>
            ) : (
              <>
                <span className="admin-cat-nombre">{cat}</span>
                <span className="dato texto-suave">{enUso(cat)} productos</span>
                <span className="tabla-acciones">
                  <button onClick={() => { setEditando(cat); setTexto(cat); }}>Editar</button>
                  <button className="alerta" onClick={() => borrar(cat)}>Borrar</button>
                </span>
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

// ===================== CADUCIDADES =====================
function Caducidades({ productos, vencidos, porVencer }) {
  const lista = productos
    .filter((p) => p.caducidad)
    .map((p) => ({ ...p, dias: diasPara(p.caducidad) }))
    .sort((a, b) => a.dias - b.dias);

  function estado(dias) {
    if (dias < 0) return { texto: 'Vencido', clase: 'alerta' };
    if (dias <= 60) return { texto: 'Por vencer', clase: 'alerta' };
    return { texto: 'En regla', clase: 'texto-suave' };
  }

  return (
    <section>
      <header className="admin-cabeza">
        <h1>Caducidades</h1>
      </header>
      <p className="admin-resumen">
        <span className="dato alerta">{vencidos}</span> vencidos ·{' '}
        <span className="dato alerta">{porVencer}</span> por vencer en los próximos 60 días
      </p>

      <table className="tabla">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Caduca</th>
            <th className="num">Días</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {lista.map((p) => {
            const e = estado(p.dias);
            return (
              <tr key={p.id}>
                <td data-etiqueta="Producto"><strong>{p.nombre}</strong></td>
                <td data-etiqueta="Caduca" className="dato">{fechaCorta(p.caducidad)}</td>
                <td data-etiqueta="Días" className={'num dato ' + e.clase}>{p.dias}</td>
                <td data-etiqueta="Estado" className={e.clase}>{e.texto}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
