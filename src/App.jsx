import { useEffect, useState } from 'react';
import Encabezado from './components/Encabezado.jsx';
import PiePagina from './components/PiePagina.jsx';
import Login from './pages/Login.jsx';
import Inicio from './pages/Inicio.jsx';
import Catalogo from './pages/Catalogo.jsx';
import Detalle from './pages/Detalle.jsx';
import Admin from './pages/Admin.jsx';
import {
  escucharProductos,
  escucharCategorias,
  escucharSesion,
  cerrarSesion,
} from './data/basedatos.js';

// ===== APP PRINCIPAL (SPA) - Brandon =====
// Decide qué pantalla se muestra y escucha la base de datos (Firestore).
export default function App() {
  const [vista, setVista] = useState('inicio'); // inicio | catalogo | detalle | login | admin
  const [productoId, setProductoId] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('Todas');
  const [usuario, setUsuario] = useState(null);
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorDatos, setErrorDatos] = useState('');

  // ===== BASE DE DATOS EN TIEMPO REAL =====
  // Cada vez que algo cambia en Firestore, la app se actualiza sola.
  useEffect(() => {
    const dejarProductos = escucharProductos(
      (lista) => {
        setProductos(lista);
        setCargando(false);
      },
      () => {
        setErrorDatos('No se pudieron cargar los productos.');
        setCargando(false);
      }
    );
    const dejarCategorias = escucharCategorias(setCategorias);
    const dejarSesion = escucharSesion(setUsuario);
    // Al cerrar la app se dejan de escuchar los cambios
    return () => {
      dejarProductos();
      dejarCategorias();
      dejarSesion();
    };
  }, []);

  function irA(destino) {
    // El panel solo se abre con sesión iniciada
    if (destino === 'admin' && !usuario) destino = 'login';
    setVista(destino);
    window.scrollTo(0, 0);
  }

  // El buscador siempre busca en TODO el catálogo
  function buscarTexto(texto) {
    setBusqueda(texto);
    if (texto) setCategoria('Todas');
  }

  function verProducto(producto) {
    setProductoId(producto.id);
    irA('detalle');
  }

  function irACategoria(cat) {
    setCategoria(cat);
    setBusqueda('');
    irA('catalogo');
  }

  // Login.jsx ya inició la sesión; aquí solo se abre el panel
  function alEntrar() {
    setVista('admin');
    window.scrollTo(0, 0);
  }

  async function salir() {
    await cerrarSesion();
    irA('inicio');
  }

  const producto = productos.find((p) => p.id === productoId);

  return (
    <div className="app">
      <Encabezado
        vista={vista}
        irA={irA}
        busqueda={busqueda}
        setBusqueda={buscarTexto}
        usuario={usuario}
        onSalir={salir}
      />

      <main>
        {cargando && vista !== 'login' && vista !== 'admin' && (
          <p className="contenedor estado-datos">Cargando productos…</p>
        )}
        {errorDatos && <p className="contenedor estado-datos alerta">{errorDatos}</p>}

        {!cargando && vista === 'inicio' && (
          <Inicio
            productos={productos}
            categorias={categorias}
            irA={irA}
            verProducto={verProducto}
            irACategoria={irACategoria}
            setBusqueda={buscarTexto}
          />
        )}
        {!cargando && vista === 'catalogo' && (
          <Catalogo
            productos={productos}
            categorias={categorias}
            busqueda={busqueda}
            setBusqueda={setBusqueda}
            categoria={categoria}
            setCategoria={setCategoria}
            verProducto={verProducto}
          />
        )}
        {!cargando && vista === 'detalle' && (
          <Detalle
            producto={producto}
            productos={productos}
            verProducto={verProducto}
            irA={irA}
            irACategoria={irACategoria}
          />
        )}
        {vista === 'login' && <Login onLogin={alEntrar} irA={irA} />}
        {vista === 'admin' && usuario && (
          <Admin productos={productos} categorias={categorias} usuario={usuario} />
        )}
      </main>

      <PiePagina />
    </div>
  );
}
