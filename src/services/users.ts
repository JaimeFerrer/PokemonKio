import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import type { UserProfile } from '../types'

export function subscribeToUserProfile(
  userId: string,
  callback: (profile: UserProfile | null) => void,
  onError?: (error: Error) => void,
): () => void {
  const ref = doc(db, 'users', userId)
  return onSnapshot(
    ref,
    (snap) => {
      if (!snap.exists()) {
        callback(null)
        return
      }
      const data = snap.data()
      callback({
        uid: snap.id,
        displayName: data.displayName ?? 'Entrenador',
        photoURL: data.photoURL ?? undefined,
      })
    },
    (error) => {
      console.error('subscribeToUserProfile failed:', error)
      onError?.(error)
    },
  )
}
