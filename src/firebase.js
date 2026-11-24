// ===== CONEXIÓN CON FIREBASE - Juan =====
// 1) Pega aquí la configuración de tu proyecto:
//    Firebase Console -> ⚙ Configuración del proyecto -> Tus apps -> App web (</>)
// 2) Esta configuración NO es secreta: se puede subir a GitHub. La seguridad
//    la dan las REGLAS de Firestore (archivo firestore.rules).
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'TU_API_KEY',
  authDomain: 'TU_PROYECTO.firebaseapp.com',
  projectId: 'TU_PROYECTO',
  storageBucket: 'TU_PROYECTO.firebasestorage.app',
  messagingSenderId: 'TU_SENDER_ID',
  appId: 'TU_APP_ID',
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
