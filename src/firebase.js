// ===== CONEXIÓN CON FIREBASE - Juan =====
// Configuración del proyecto ServiFarmaSerVel en Firebase.
// Esta configuración NO es secreta: se puede subir a GitHub. La seguridad
// la dan las REGLAS de Firestore (archivo firestore.rules).
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyC8veTjnZQ7MFQibnr9ajEdsYuPHseQw5o',
  authDomain: 'servifarmaservel-8d4e4.firebaseapp.com',
  projectId: 'servifarmaservel-8d4e4',
  storageBucket: 'servifarmaservel-8d4e4.firebasestorage.app',
  messagingSenderId: '438509310675',
  appId: '1:438509310675:web:2d815ef68256a412ebfa26',
};

// Mientras no pongan su configuración, la app usa el modo local
// (datos en el navegador) para que no truene.
export const firebaseListo = !firebaseConfig.apiKey.startsWith('TU_');

let db = null;
let auth = null;

if (firebaseListo) {
  const app = initializeApp(firebaseConfig);
  // Caché local: la PWA puede mostrar el catálogo aunque no haya internet
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
  });
  auth = getAuth(app);
}

export { db, auth };
