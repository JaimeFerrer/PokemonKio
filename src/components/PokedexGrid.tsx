import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Capture } from '../types'
import { ImageLightbox } from './ImageLightbox'
import './PokedexGrid.css'

interface PokedexGridProps {
  captures: Capture[]
  showTrainer?: boolean
}

export function PokedexGrid({ captures, showTrainer = false }: PokedexGridProps) {
  const navigate = useNavigate()
  const [lightboxCapture, setLightboxCapture] = useState<Capture | null>(null)

  return (
    <div className="pokedex-grid">
      {captures.map((c, i) => (
        <div key={c.id} className="pokedex-card pixel-border">
          <span className="pokedex-card__number">#{String(captures.length - i).padStart(3, '0')}</span>
          <div
            className="pokedex-card__img-wrap"
            onClick={() => setLightboxCapture(c)}
            role="button"
            tabIndex={0}
            aria-label={`Ver foto de ${c.pokemonName} a pantalla completa`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setLightboxCapture(c)
            }}
          >
            <img src={c.photoUrl} alt={c.pokemonName} className="pokedex-card__img" />
          </div>
          <button type="button" className="pokedex-card__name-btn" onClick={() => navigate(`/pokedex/${c.id}`)}>
            {c.pokemonName}
          </button>
          {showTrainer && (
            <button
              type="button"
              className="pokedex-card__trainer"
              onClick={() => navigate(`/entrenador/${c.userId}`, { state: { userName: c.userName } })}
            >
              🧑 {c.userName}
            </button>
          )}
        </div>
      ))}

      {lightboxCapture && (
        <ImageLightbox
          photoUrl={lightboxCapture.photoUrl}
          alt={lightboxCapture.pokemonName}
          onClose={() => setLightboxCapture(null)}
        />
      )}
    </div>
  )
}
