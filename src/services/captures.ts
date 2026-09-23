import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  increment,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../firebase'
import type { Capture, NewCapture } from '../types'

const CAPTURES = 'captures'

export async function createCapture(data: NewCapture): Promise<void> {
  await addDoc(collection(db, CAPTURES), {
    ...data,
    likes: 0,
    likedBy: [],
    createdAt: serverTimestamp(),
  })
}

export function subscribeToCaptures(
  callback: (captures: Capture[]) => void,
  onError?: (error: Error) => void,
): () => void {
  const q = query(collection(db, CAPTURES), orderBy('createdAt', 'desc'))
  return onSnapshot(
    q,
    (snapshot) => {
      const captures = snapshot.docs.map((d) => {
        const data = d.data()
        return {
          id: d.id,
          userId: data.userId,
          userName: data.userName,
          pokemonName: data.pokemonName,
          comment: data.comment ?? '',
          photoUrl: data.photoUrl,
          photoPublicId: data.photoPublicId,
          lat: data.lat,
          lng: data.lng,
          locationLabel: data.locationLabel,
          createdAt: data.createdAt?.toMillis?.() ?? Date.now(),
          likes: data.likes ?? 0,
          likedBy: data.likedBy ?? [],
        } as Capture
      })
      callback(captures)
    },
    (error) => {
      console.error('subscribeToCaptures failed:', error)
      onError?.(error)
    },
  )
}

export function subscribeToCapture(
  id: string,
  callback: (capture: Capture | null) => void,
  onError?: (error: Error) => void,
): () => void {
  const ref = doc(db, CAPTURES, id)
  return onSnapshot(
    ref,
    (snap) => {
      if (!snap.exists()) {
        callback(null)
        return
      }
      const data = snap.data()
      callback({
        id: snap.id,
        userId: data.userId,
        userName: data.userName,
        pokemonName: data.pokemonName,
        comment: data.comment ?? '',
        photoUrl: data.photoUrl,
        photoPublicId: data.photoPublicId,
        lat: data.lat,
        lng: data.lng,
        locationLabel: data.locationLabel,
        createdAt: data.createdAt?.toMillis?.() ?? Date.now(),
        likes: data.likes ?? 0,
        likedBy: data.likedBy ?? [],
      })
    },
    (error) => {
      console.error('subscribeToCapture failed:', error)
      onError?.(error)
    },
  )
}

export async function toggleLike(captureId: string, userId: string, isLiked: boolean): Promise<void> {
  const ref = doc(db, CAPTURES, captureId)
  await updateDoc(ref, {
    likedBy: isLiked ? arrayRemove(userId) : arrayUnion(userId),
    likes: increment(isLiked ? -1 : 1),
  })
}

export async function deleteCapture(captureId: string): Promise<void> {
  await deleteDoc(doc(db, CAPTURES, captureId))
}

export async function updateCaptureDetails(
  captureId: string,
  data: { pokemonName: string; comment: string },
): Promise<void> {
  await updateDoc(doc(db, CAPTURES, captureId), {
    pokemonName: data.pokemonName,
    comment: data.comment,
  })
}
