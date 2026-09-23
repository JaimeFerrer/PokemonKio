import { useNavigate } from 'react-router-dom'
import type { Capture } from '../types'
import './PokedexGrid.css'

interface PokedexGridProps {
  captures: Capture[]
  showTrainer?: boolean
}

export function PokedexGrid({ captures, showTrainer = false }: PokedexGridProps) {
  const navigate = useNavigate()

  return (
    <div className="pokedex-grid">
      {captures.map((c, i) => (
        <div key={c.id} className="pokedex-card pixel-border">
          <button type="button" className="pokedex-card__photo" onClick={() => navigate(`/pokedex/${c.id}`)}>
            <span className="pokedex-card__number">#{String(captures.length - i).padStart(3, '0')}</span>
            <img src={c.photoUrl} alt={c.pokemonName} className="pokedex-card__img" />
            <span className="pokedex-card__name">{c.pokemonName}</span>
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
    </div>
  )
}
