import { useEffect, useState } from 'react'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import { useNavigate, useParams } from 'react-router-dom'
import { DialogBox } from '../components/DialogBox'
import { Loading } from '../components/Loading'
import { RetroPanel } from '../components/RetroPanel'
import { TopBar } from '../components/TopBar'
import { useAuth } from '../context/AuthContext'
import { subscribeToCapture, toggleLike } from '../services/captures'
import type { Capture } from '../types'
import { pokemonMarkerIcon } from '../mapIcon'
import './CaptureDetailPage.css'

export function CaptureDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [capture, setCapture] = useState<Capture | null | undefined>(undefined)

  useEffect(() => {
    if (!id) return
    const unsub = subscribeToCapture(id, setCapture)
    return unsub
  }, [id])

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

  async function handleLike() {
    if (!user) return
    await toggleLike(capture!.id, user.uid, isLiked)
  }

  return (
    <div className="screen">
      <TopBar title={capture.pokemonName} />

      <RetroPanel className="detail-photo">
        <img src={capture.photoUrl} alt={capture.pokemonName} />
      </RetroPanel>

      <RetroPanel>
        <div className="detail-meta">
          <span className="title-sm">🧑 {capture.userName}</span>
          <span className="title-sm text-muted">{date}</span>
        </div>
        {capture.comment && <p className="text-body detail-comment">"{capture.comment}"</p>}
        <button type="button" className="detail-like" onClick={handleLike} disabled={!user}>
          {isLiked ? '❤️' : '🤍'} {capture.likes} me gusta
        </button>
      </RetroPanel>

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
    </div>
  )
}
