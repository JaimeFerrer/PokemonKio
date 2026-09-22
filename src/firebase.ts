import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getStorage, type FirebaseStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const firebaseReady = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId)

// Solo se inicializa Firebase de verdad si hay credenciales en .env; si no se deja
// todo en null y App.tsx muestra una pantalla de configuración en vez de dejar
// que el SDK lance un error y deje la página en blanco.
let app: FirebaseApp | null = null
let authInternal: Auth | null = null
let dbInternal: Firestore | null = null
let storageInternal: FirebaseStorage | null = null

if (firebaseReady) {
  app = initializeApp(firebaseConfig)
  authInternal = getAuth(app)
  dbInternal = getFirestore(app)
  storageInternal = getStorage(app)
}

// El resto del código (AuthProvider, services/captures.ts) solo se monta/usa
// cuando App.tsx ha comprobado `firebaseReady`, así que estas aserciones son seguras.
export const auth = authInternal as Auth
export const db = dbInternal as Firestore
export const storage = storageInternal as FirebaseStorage
