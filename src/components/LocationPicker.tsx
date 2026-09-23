import { useEffect } from 'react'
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import { pokemonMarkerIcon } from '../mapIcon'
import './LocationPicker.css'

const DEFAULT_CENTER: [number, number] = [40.4168, -3.7038] // Madrid, punto de partida por defecto

interface LocationPickerProps {
  value: [number, number] | null
  onChange: (position: [number, number]) => void
}

function ClickHandler({ onChange }: { onChange: (position: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      onChange([e.latlng.lat, e.latlng.lng])
    },
  })
  return null
}

function RecenterOnChange({ center }: { center: [number, number] | null }) {
  const map = useMap()
  useEffect(() => {
    if (center) map.setView(center, 16)
  }, [center, map])
  return null
}

export function LocationPicker({ value, onChange }: LocationPickerProps) {
  return (
    <div className="location-picker pixel-border">
      <MapContainer
        center={value ?? DEFAULT_CENTER}
        zoom={value ? 16 : 5}
        style={{ height: 220, width: '100%' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onChange={onChange} />
        <RecenterOnChange center={value} />
        {value && (
          <Marker
            position={value}
            icon={pokemonMarkerIcon}
            draggable
            eventHandlers={{
              dragend: (e) => {
                const pos = e.target.getLatLng()
                onChange([pos.lat, pos.lng])
              },
            }}
          />
        )}
      </MapContainer>
    </div>
  )
}
