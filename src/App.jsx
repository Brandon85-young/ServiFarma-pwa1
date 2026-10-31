
import { useState } from 'react';
import Encabezado from './components/Encabezado.jsx';
import PiePagina from './components/PiePagina.jsx';
import Login from './pages/Login.jsx';
import Inicio from './pages/Inicio.jsx';
import Catalogo from './pages/Catalogo.jsx';
import Detalle from './pages/Detalle.jsx';
 
// ===== APP PRINCIPAL: decide qué pantalla se muestra =====
export default function App() {
  const [vista, setVista] = useState('inicio'); // inicio | login | catalogo | detalle
  const [productoSel, setProductoSel] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [usuario, setUsuario] = useState(null);
 
  function irA(destino) {
    setVista(destino);
    window.scrollTo(0, 0);
  }
 
  function verProducto(producto) {
    setProductoSel(producto);
    irA('detalle');
  }
 
  function iniciarSesion(nombre) {
    setUsuario(nombre);
    irA('inicio');
  }
 
  return (
    <div className="app">
      <Encabezado
        vista={vista}
        irA={irA}
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        usuario={usuario}
        onSalir={() => setUsuario(null)}
      />
 
      <main>
        {vista === 'inicio' && <Inicio irA={irA} verProducto={verProducto} />}
        {vista === 'login' && <Login onLogin={iniciarSesion} />}
        {vista === 'catalogo' && <Catalogo busqueda={busqueda} verProducto={verProducto} />}
        {vista === 'detalle' && <Detalle producto={productoSel} verProducto={verProducto} volver={() => irA('catalogo')} />}
      </main>
 
      <PiePagina />
    </div>
  );
}
