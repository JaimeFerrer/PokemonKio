import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { DialogBox } from '../components/DialogBox'
import { RetroButton } from '../components/RetroButton'
import { RetroPanel } from '../components/RetroPanel'
import { TopBar } from '../components/TopBar'
import { useAuth } from '../context/AuthContext'
import { subscribeToCaptures } from '../services/captures'
import { uploadPhoto } from '../services/cloudinary'
import type { Capture } from '../types'
import './ProfilePage.css'

export function ProfilePage() {
  const { user, logout, updateProfilePhoto } = useAuth()
  const navigate = useNavigate()
  const photoInputRef = useRef<HTMLInputElement>(null)
  const [captures, setCaptures] = useState<Capture[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [photoError, setPhotoError] = useState<string | null>(null)

  useEffect(() => {
    const unsub = subscribeToCaptures(setCaptures, (err) => setError(err.message))
    return unsub
  }, [])

  const myCaptures = useMemo(
    () => (captures && user ? captures.filter((c) => c.userId === user.uid) : []),
    [captures, user],
  )
  const totalLikes = useMemo(() => myCaptures.reduce((sum, c) => sum + c.likes, 0), [myCaptures])

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  async function handlePhotoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoError(null)
    setUploadingPhoto(true)
    try {
      const { url } = await uploadPhoto(file)
      await updateProfilePhoto(url)
    } catch (err) {
      setPhotoError(err instanceof Error ? err.message : 'No se pudo subir la foto de perfil.')
    } finally {
      setUploadingPhoto(false)
      e.target.value = ''
    }
  }

  return (
    <div className="screen">
      <TopBar title="Perfil" />

      {error && <DialogBox>No se pudieron cargar tus capturas: {error}</DialogBox>}

      <RetroPanel className="profile-card">
        <button
          type="button"
          className="profile-avatar"
          onClick={() => photoInputRef.current?.click()}
          disabled={uploadingPhoto}
          aria-label="Cambiar foto de perfil"
        >
          {user?.photoURL ? <img src={user.photoURL} alt="Foto de perfil" /> : '🧑'}
        </button>
        <input
          ref={photoInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          style={{ display: 'none' }}
        />
        <div>
          <p className="title-sm">{user?.displayName}</p>
          <p className="text-body text-muted">{user?.email}</p>
        </div>
      </RetroPanel>

      {photoError && <p className="text-body" style={{ color: 'var(--accent-red)' }}>{photoError}</p>}

      <div className="profile-stats">
        <RetroPanel className="profile-stat">
          <span className="title-lg">{myCaptures.length}</span>
          <span className="text-body">Capturas</span>
        </RetroPanel>
        <RetroPanel className="profile-stat">
          <span className="title-lg">{totalLikes}</span>
          <span className="text-body">Me gusta</span>
        </RetroPanel>
      </div>

      {myCaptures.length > 0 && (
        <div className="profile-grid">
          {myCaptures.map((c) => (
            <img
              key={c.id}
              src={c.photoUrl}
              alt={c.pokemonName}
              className="profile-grid__img pixel-border"
              onClick={() => navigate(`/pokedex/${c.id}`)}
            />
          ))}
        </div>
      )}

      <RetroButton variant="danger" onClick={handleLogout}>
        Cerrar sesión
      </RetroButton>
    </div>
  )
}
