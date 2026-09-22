import { useEffect, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { useNavigate } from 'react-router-dom'
import { DialogBox } from '../components/DialogBox'
import { Loading } from '../components/Loading'
import { TopBar } from '../components/TopBar'
import { pokemonMarkerIcon } from '../mapIcon'
import { subscribeToCaptures } from '../services/captures'
import type { Capture } from '../types'
import './MapPage.css'

const DEFAULT_CENTER: [number, number] = [40.4168, -3.7038] // Madrid, punto de partida por defecto

export function MapPage() {
  const [captures, setCaptures] = useState<Capture[] | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const unsub = subscribeToCaptures(setCaptures)
    return unsub
  }, [])

  if (captures === null) {
    return (
      <div className="screen">
        <TopBar title="Mapa" />
        <Loading label="Cargando mapa..." />
      </div>
    )
  }

  const center: [number, number] = captures.length > 0 ? [captures[0].lat, captures[0].lng] : DEFAULT_CENTER

  return (
    <div className="screen screen--map">
      <TopBar title="Mapa" />
      {captures.length === 0 && <DialogBox>Todavía no hay capturas en el mapa.</DialogBox>}
      <div className="map-wrapper pixel-border">
        <MapContainer center={center} zoom={captures.length > 0 ? 6 : 5} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {captures.map((c) => (
            <Marker key={c.id} position={[c.lat, c.lng]} icon={pokemonMarkerIcon}>
              <Popup>
                <div className="map-popup" onClick={() => navigate(`/pokedex/${c.id}`)}>
                  <img src={c.photoUrl} alt={c.pokemonName} />
                  <strong>{c.pokemonName}</strong>
                  <span>por {c.userName}</span>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  )
}
