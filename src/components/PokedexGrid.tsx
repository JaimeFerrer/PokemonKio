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
          <div
            className="pokedex-card__photo"
            onClick={() => navigate(`/pokedex/${c.id}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') navigate(`/pokedex/${c.id}`)
            }}
          >
            <span className="pokedex-card__number">#{String(captures.length - i).padStart(3, '0')}</span>
            <div className="pokedex-card__img-wrap">
              <img src={c.photoUrl} alt={c.pokemonName} className="pokedex-card__img" />
              <button
                type="button"
                className="pokedex-card__expand"
                onClick={(e) => {
                  e.stopPropagation()
                  setLightboxCapture(c)
                }}
                aria-label="Ampliar foto"
              >
                🔍
              </button>
            </div>
            <span className="pokedex-card__name">{c.pokemonName}</span>
          </div>
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
