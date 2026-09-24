import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { auth, db } from '../firebase'

interface AuthContextValue {
  user: User | null
  loading: boolean
  register: (name: string, email: string, password: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateProfilePhoto: (photoUrl: string) => Promise<void>
  removeProfilePhoto: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  async function register(name: string, email: string, password: string) {
    const credential = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(credential.user, { displayName: name })
    await setDoc(doc(db, 'users', credential.user.uid), {
      uid: credential.user.uid,
      displayName: name,
      email,
      createdAt: serverTimestamp(),
    })
  }

  async function login(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password)
  }

  async function logout() {
    await signOut(auth)
  }

  async function resetPassword(email: string) {
    await sendPasswordResetEmail(auth, email)
  }

  async function updateProfilePhoto(photoUrl: string) {
    if (!auth.currentUser) return
    await updateProfile(auth.currentUser, { photoURL: photoUrl })
    await setDoc(doc(db, 'users', auth.currentUser.uid), { photoURL: photoUrl }, { merge: true })
    setUser((prev) => (prev ? ({ ...prev, photoURL: photoUrl } as User) : prev))
  }

  async function removeProfilePhoto() {
    if (!auth.currentUser) return
    await updateProfile(auth.currentUser, { photoURL: null })
    await setDoc(doc(db, 'users', auth.currentUser.uid), { photoURL: null }, { merge: true })
    setUser((prev) => (prev ? ({ ...prev, photoURL: null } as User) : prev))
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, register, login, logout, resetPassword, updateProfilePhoto, removeProfilePhoto }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
