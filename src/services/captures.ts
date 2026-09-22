import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  increment,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { db, storage } from '../firebase'
import type { Capture, NewCapture } from '../types'

const CAPTURES = 'captures'

export async function uploadCapturePhoto(userId: string, file: Blob): Promise<{ url: string; path: string }> {
  const path = `captures/${userId}/${Date.now()}.jpg`
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file, { contentType: 'image/jpeg' })
  const url = await getDownloadURL(storageRef)
  return { url, path }
}

export async function createCapture(data: NewCapture): Promise<void> {
  await addDoc(collection(db, CAPTURES), {
    ...data,
    likes: 0,
    likedBy: [],
    createdAt: serverTimestamp(),
  })
}

export function subscribeToCaptures(callback: (captures: Capture[]) => void): () => void {
  const q = query(collection(db, CAPTURES), orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snapshot) => {
    const captures = snapshot.docs.map((d) => {
      const data = d.data()
      return {
        id: d.id,
        userId: data.userId,
        userName: data.userName,
        pokemonName: data.pokemonName,
        comment: data.comment ?? '',
        photoUrl: data.photoUrl,
        photoPath: data.photoPath,
        lat: data.lat,
        lng: data.lng,
        locationLabel: data.locationLabel,
        createdAt: data.createdAt?.toMillis?.() ?? Date.now(),
        likes: data.likes ?? 0,
        likedBy: data.likedBy ?? [],
      } as Capture
    })
    callback(captures)
  })
}

export function subscribeToCapture(id: string, callback: (capture: Capture | null) => void): () => void {
  const ref = doc(db, CAPTURES, id)
  return onSnapshot(ref, (snap) => {
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
      photoPath: data.photoPath,
      lat: data.lat,
      lng: data.lng,
      locationLabel: data.locationLabel,
      createdAt: data.createdAt?.toMillis?.() ?? Date.now(),
      likes: data.likes ?? 0,
      likedBy: data.likedBy ?? [],
    })
  })
}

export async function toggleLike(captureId: string, userId: string, isLiked: boolean): Promise<void> {
  const ref = doc(db, CAPTURES, captureId)
  await updateDoc(ref, {
    likedBy: isLiked ? arrayRemove(userId) : arrayUnion(userId),
    likes: increment(isLiked ? -1 : 1),
  })
}
