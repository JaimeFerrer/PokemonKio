import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { DialogBox } from '../components/DialogBox'
import { RetroButton } from '../components/RetroButton'
import { RetroPanel } from '../components/RetroPanel'
import { TopBar } from '../components/TopBar'
import { useAuth } from '../context/AuthContext'
import { useGeolocation } from '../hooks/useGeolocation'
import { createCapture } from '../services/captures'
import { cloudinaryReady, uploadPhoto } from '../services/cloudinary'
import './CapturePage.css'

export function CapturePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const geo = useGeolocation()

  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [pokemonName, setPokemonName] = useState('')
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!user) return
    setError(null)

    if (!photoFile) {
      setError('Hace falta una foto del Pokémon capturado.')
      return
    }
    if (geo.lat == null || geo.lng == null) {
      setError('Necesitamos tu ubicación para marcar la captura en el mapa.')
      return
    }
    if (!pokemonName.trim()) {
      setError('Ponle un nombre gracioso a tu Pokémon.')
      return
    }

    setSubmitting(true)
    try {
      const { url, publicId } = await uploadPhoto(photoFile)
      await createCapture({
        userId: user.uid,
        userName: user.displayName || 'Entrenador',
        pokemonName: pokemonName.trim(),
        comment: comment.trim(),
        photoUrl: url,
        photoPublicId: publicId,
        lat: geo.lat,
        lng: geo.lng,
      })
      navigate('/pokedex')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo subir la captura.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="screen">
      <TopBar title="Capturar Pokémon" />
      <DialogBox>¡Un Pokémon salvaje apareció! Hazle una foto, dale nombre y captúralo.</DialogBox>

      {!cloudinaryReady && (
        <DialogBox>
          Falta configurar Cloudinary (VITE_CLOUDINARY_CLOUD_NAME / VITE_CLOUDINARY_UPLOAD_PRESET) para poder subir
          fotos. Revisa el README.
        </DialogBox>
      )}

      <RetroPanel className="capture-photo">
        {photoPreview ? (
          <img src={photoPreview} alt="Pokémon capturado" className="capture-photo__preview" />
        ) : (
          <div className="capture-photo__placeholder title-sm">Sin foto todavía</div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <RetroButton type="button" variant="secondary" onClick={() => fileInputRef.current?.click()}>
          {photoPreview ? 'Repetir foto' : '📷 Hacer foto'}
        </RetroButton>
      </RetroPanel>

      <RetroPanel>
        <button type="button" className="capture-location title-sm" onClick={geo.locate} disabled={geo.loading}>
          {geo.loading
            ? 'Localizando...'
            : geo.lat != null
              ? `📍 Ubicación lista (${geo.lat.toFixed(4)}, ${geo.lng!.toFixed(4)})`
              : '📍 Usar mi ubicación actual'}
        </button>
        {geo.error && <p className="text-body" style={{ color: 'var(--accent-red)' }}>{geo.error}</p>}
      </RetroPanel>

      <RetroPanel>
        <form className="capture-form" onSubmit={handleSubmit}>
          <label className="capture-form__field">
            <span className="title-sm">Nombre del Pokémon</span>
            <input
              value={pokemonName}
              onChange={(e) => setPokemonName(e.target.value)}
              placeholder="Ej: Borrachosaurio"
              maxLength={40}
              required
            />
          </label>
          <label className="capture-form__field">
            <span className="title-sm">Comentario</span>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Cuenta la historia de la captura..."
              maxLength={280}
              rows={3}
            />
          </label>

          {error && <p className="text-body" style={{ color: 'var(--accent-red)' }}>{error}</p>}

          <RetroButton type="submit" disabled={submitting || !cloudinaryReady}>
            {submitting ? 'Capturando...' : '¡Capturar!'}
          </RetroButton>
        </form>
      </RetroPanel>
    </div>
  )
}
