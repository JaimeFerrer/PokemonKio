export interface AppUser {
  uid: string
  displayName: string
  email: string
  createdAt: number
}

export interface Capture {
  id: string
  userId: string
  userName: string
  pokemonName: string
  comment: string
  photoUrl: string
  photoPublicId: string
  lat: number
  lng: number
  locationLabel?: string
  createdAt: number
  likes: number
  likedBy: string[]
}

export type NewCapture = Omit<Capture, 'id' | 'likes' | 'likedBy' | 'createdAt'>
