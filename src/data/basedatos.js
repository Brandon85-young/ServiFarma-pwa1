// ===== BASE DE DATOS (Firestore + Authentication) - Juan =====
// Toda la app lee y escribe datos SOLO por estas funciones.
// - Con Firebase configurado: usa Firestore y Firebase Authentication.
// - Sin configurar: usa el navegador (localStorage) con las mismas funciones.
//
// Colecciones en Firestore:
//   productos  -> un documento por producto (el id lo pone Firestore)
//   categorias -> un documento por categoría (el id es el nombre)
import {
  collection,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  getDocs,
  query,
  where,
  writeBatch,
} from 'firebase/firestore';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { db, auth, firebaseListo } from '../firebase.js';
import { CATEGORIAS, PRODUCTOS } from './productos.js';

export const usaFirebase = firebaseListo;

// =====================================================================
// MODO LOCAL (solo si no hay Firebase). Imita a Firestore con listeners.
// =====================================================================
const local = {
  productos: leerLocal('servifarma-productos', PRODUCTOS),
  categorias: leerLocal('servifarma-categorias', CATEGORIAS),
  usuario: null,
  oyentes: { productos: [], categorias: [], usuario: [] },
};

function leerLocal(clave, porDefecto) {
  try {
    const guardado = localStorage.getItem(clave);
    if (guardado) return JSON.parse(guardado);
  } catch {
    // Si el navegador no deja leer, usamos los datos iniciales
  }
  return porDefecto;
}

function avisarLocal(tipo) {
  try {
    if (tipo !== 'usuario') localStorage.setItem('servifarma-' + tipo, JSON.stringify(local[tipo]));
  } catch {
    // Si no se puede guardar, sigue en memoria
  }
  local.oyentes[tipo].forEach((fn) => fn(local[tipo]));
}

function escucharLocal(tipo, fn) {
  local.oyentes[tipo].push(fn);
  fn(local[tipo]);
  return () => {
    local.oyentes[tipo] = local.oyentes[tipo].filter((f) => f !== fn);
  };
}

// =====================================================================
// PRODUCTOS (CRUD)
// =====================================================================

// READ: avisa cada vez que cambian los productos (en tiempo real)
export function escucharProductos(alCambiar, alFallar) {
  if (!usaFirebase) return escucharLocal('productos', alCambiar);

  return onSnapshot(
    collection(db, 'productos'),
    (snap) => alCambiar(snap.docs.map((d) => ({ ...d.data(), id: d.id }))),
    alFallar
  );
}

// CREATE
export async function crearProducto(datos) {
  const { id: _quitar, ...sinId } = datos;
  if (!usaFirebase) {
    const nuevo = local.productos.reduce((m, p) => Math.max(m, Number(p.id) || 0), 0) + 1;
    local.productos = [...local.productos, { ...sinId, id: nuevo }];
    return avisarLocal('productos');
  }
  await addDoc(collection(db, 'productos'), sinId);
}

// UPDATE
export async function actualizarProducto(id, datos) {
  const { id: _quitar, ...sinId } = datos;
  if (!usaFirebase) {
    local.productos = local.productos.map((p) => (p.id === id ? { ...sinId, id } : p));
    return avisarLocal('productos');
  }
  await updateDoc(doc(db, 'productos', id), sinId);
}

// DELETE
export async function borrarProducto(id) {
  if (!usaFirebase) {
    local.productos = local.productos.filter((p) => p.id !== id);
    return avisarLocal('productos');
  }
  await deleteDoc(doc(db, 'productos', id));
}

// =====================================================================
// CATEGORÍAS (CRUD)
// =====================================================================

export function escucharCategorias(alCambiar, alFallar) {
  if (!usaFirebase) return escucharLocal('categorias', alCambiar);

  return onSnapshot(
    collection(db, 'categorias'),
    (snap) => alCambiar(snap.docs.map((d) => d.id).sort((a, b) => a.localeCompare(b))),
    alFallar
  );
}

export async function crearCategoria(nombre) {
  if (!usaFirebase) {
    local.categorias = [...local.categorias, nombre];
    return avisarLocal('categorias');
  }
  await setDoc(doc(db, 'categorias', nombre), { nombre });
}

// Cambia el nombre de la categoría y de todos sus productos (en un solo paso)
export async function renombrarCategoria(vieja, nueva) {
  if (!usaFirebase) {
    local.categorias = local.categorias.map((c) => (c === vieja ? nueva : c));
    local.productos = local.productos.map((p) => (p.categoria === vieja ? { ...p, categoria: nueva } : p));
    avisarLocal('categorias');
    return avisarLocal('productos');
  }
  const lote = writeBatch(db);
  lote.set(doc(db, 'categorias', nueva), { nombre: nueva });
  lote.delete(doc(db, 'categorias', vieja));
  const deEsa = await getDocs(query(collection(db, 'productos'), where('categoria', '==', vieja)));
  deEsa.forEach((d) => lote.update(d.ref, { categoria: nueva }));
  await lote.commit();
}

export async function borrarCategoria(nombre) {
  if (!usaFirebase) {
    local.categorias = local.categorias.filter((c) => c !== nombre);
    return avisarLocal('categorias');
  }
  await deleteDoc(doc(db, 'categorias', nombre));
}

// =====================================================================
// DATOS DE EJEMPLO: sube los 8 productos y 5 categorías iniciales
// (se usa una sola vez, desde el panel, cuando la base está vacía)
// =====================================================================
export async function cargarDatosIniciales() {
  if (!usaFirebase) {
    local.productos = PRODUCTOS;
    local.categorias = CATEGORIAS;
    avisarLocal('categorias');
    return avisarLocal('productos');
  }
  const lote = writeBatch(db);
  CATEGORIAS.forEach((c) => lote.set(doc(db, 'categorias', c), { nombre: c }));
  PRODUCTOS.forEach(({ id: _quitar, ...p }) => lote.set(doc(collection(db, 'productos')), p));
  await lote.commit();
}

// =====================================================================
// SESIÓN (Firebase Authentication con correo y contraseña)
// =====================================================================

export function escucharSesion(alCambiar) {
  if (!usaFirebase) return escucharLocal('usuario', alCambiar);
  return onAuthStateChanged(auth, (u) => alCambiar(u ? u.email : null));
}

export async function iniciarSesion(correo, contrasena) {
  if (!usaFirebase) {
    if (correo !== 'admin' || contrasena !== '1234') {
      throw { code: 'auth/invalid-credential' };
    }
    local.usuario = 'admin';
    return avisarLocal('usuario');
  }
  await signInWithEmailAndPassword(auth, correo, contrasena);
}

export async function cerrarSesion() {
  if (!usaFirebase) {
    local.usuario = null;
    return avisarLocal('usuario');
  }
  await signOut(auth);
}

// Convierte los códigos de error de Firebase en mensajes entendibles
export function mensajeError(error) {
  const codigo = error?.code || '';
  if (codigo.includes('invalid-credential') || codigo.includes('wrong-password') || codigo.includes('user-not-found')) {
    return 'Usuario o contraseña incorrectos.';
  }
  if (codigo.includes('invalid-email')) return 'Escribe un correo válido.';
  if (codigo.includes('too-many-requests')) return 'Demasiados intentos. Espera un momento.';
  if (codigo.includes('network')) return 'No hay conexión a internet.';
  if (codigo.includes('permission-denied')) return 'No tienes permiso. Inicia sesión otra vez.';
  return 'Ocurrió un error. Intenta de nuevo.';
}
