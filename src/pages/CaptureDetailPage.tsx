import { useEffect, useState, type FormEvent } from 'react'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import { useNavigate, useParams } from 'react-router-dom'
import { DialogBox } from '../components/DialogBox'
import { Loading } from '../components/Loading'
import { RetroButton } from '../components/RetroButton'
import { RetroPanel } from '../components/RetroPanel'
import { TopBar } from '../components/TopBar'
import { useAuth } from '../context/AuthContext'
import { deleteCapture, subscribeToCapture, toggleLike, updateCaptureDetails } from '../services/captures'
import type { Capture } from '../types'
import { pokemonMarkerIcon } from '../mapIcon'
import './CaptureDetailPage.css'

export function CaptureDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [capture, setCapture] = useState<Capture | null | undefined>(undefined)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editComment, setEditComment] = useState('')
  const [savingEdit, setSavingEdit] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    const unsub = subscribeToCapture(id, setCapture, (err) => setError(err.message))
    return unsub
  }, [id])

  if (error) {
    return (
      <div className="screen">
        <TopBar title="Captura" />
        <DialogBox>No se pudo cargar la captura: {error}</DialogBox>
      </div>
    )
  }

  if (capture === undefined) return <Loading />

  if (capture === null) {
    return (
      <div className="screen">
        <TopBar title="Captura" />
        <DialogBox>Esta captura ya no existe.</DialogBox>
      </div>
    )
  }

  const isLiked = user ? capture.likedBy.includes(user.uid) : false
  const date = new Date(capture.createdAt).toLocaleString('es-ES', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })

  const isOwner = user?.uid === capture.userId

  async function handleLike() {
    if (!user || isOwner) return
    await toggleLike(capture!.id, user.uid, isLiked)
  }

  async function handleDelete() {
    if (!isOwner) return
    const confirmed = window.confirm(`¿Seguro que quieres borrar "${capture!.pokemonName}" de tu Pokédex?`)
    if (!confirmed) return
    setDeleting(true)
    try {
      await deleteCapture(capture!.id)
      navigate('/pokedex')
    } catch (err) {
      setDeleting(false)
      window.alert(err instanceof Error ? err.message : 'No se pudo borrar la captura.')
    }
  }

  function startEditing() {
    setEditName(capture!.pokemonName)
    setEditComment(capture!.comment)
    setEditError(null)
    setEditing(true)
  }

  async function handleSaveEdit(e: FormEvent) {
    e.preventDefault()
    if (!isOwner) return
    if (!editName.trim()) {
      setEditError('El nombre no puede estar vacío.')
      return
    }
    setSavingEdit(true)
    setEditError(null)
    try {
      await updateCaptureDetails(capture!.id, { pokemonName: editName.trim(), comment: editComment.trim() })
      setEditing(false)
    } catch (err) {
      setEditError(err instanceof Error ? err.message : 'No se pudo guardar el cambio.')
    } finally {
      setSavingEdit(false)
    }
  }

  return (
    <div className="screen">
      <TopBar title={capture.pokemonName} />

      <RetroPanel className="detail-photo">
        <img src={capture.photoUrl} alt={capture.pokemonName} />
      </RetroPanel>

      {editing ? (
        <RetroPanel>
          <form className="detail-edit-form" onSubmit={handleSaveEdit}>
            <label className="detail-edit-form__field">
              <span className="title-sm">Nombre del Pokémon</span>
              <input value={editName} onChange={(e) => setEditName(e.target.value)} maxLength={40} required />
            </label>
            <label className="detail-edit-form__field">
              <span className="title-sm">Comentario</span>
              <textarea value={editComment} onChange={(e) => setEditComment(e.target.value)} maxLength={280} rows={3} />
            </label>
            {editError && <p className="text-body" style={{ color: 'var(--accent-red)' }}>{editError}</p>}
            <div className="detail-actions">
              <RetroButton type="submit" disabled={savingEdit}>
                {savingEdit ? 'Guardando...' : 'Guardar'}
              </RetroButton>
              <RetroButton type="button" variant="secondary" onClick={() => setEditing(false)} disabled={savingEdit}>
                Cancelar
              </RetroButton>
            </div>
          </form>
        </RetroPanel>
      ) : (
        <RetroPanel>
          <div className="detail-meta">
            <button type="button" className="detail-trainer" onClick={() => navigate(`/entrenador/${capture.userId}`, { state: { userName: capture.userName } })}>
              🧑 {capture.userName}
            </button>
            <span className="title-sm text-muted">{date}</span>
          </div>
          {capture.comment && <p className="text-body detail-comment">"{capture.comment}"</p>}
          {isOwner ? (
            <span className="detail-like detail-like--disabled">🤍 {capture.likes} me gusta</span>
          ) : (
            <button type="button" className="detail-like" onClick={handleLike} disabled={!user}>
              {isLiked ? '❤️' : '🤍'} {capture.likes} me gusta
            </button>
          )}
        </RetroPanel>
      )}

      <RetroPanel className="detail-map">
        <MapContainer
          center={[capture.lat, capture.lng]}
          zoom={14}
          style={{ height: 180, width: '100%', borderRadius: 4 }}
          scrollWheelZoom={false}
          dragging={false}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[capture.lat, capture.lng]} icon={pokemonMarkerIcon} />
        </MapContainer>
      </RetroPanel>

      <button type="button" className="title-sm detail-view-map" onClick={() => navigate('/mapa')}>
        Ver en el mapa completo →
      </button>

      {isOwner && !editing && (
        <div className="detail-actions">
          <RetroButton type="button" variant="secondary" onClick={startEditing}>
            ✏️ Editar
          </RetroButton>
          <RetroButton type="button" variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Borrando...' : '🗑️ Borrar'}
          </RetroButton>
        </div>
      )}
    </div>
  )
}
