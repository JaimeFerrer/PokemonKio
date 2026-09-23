import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DialogBox } from '../components/DialogBox'
import { Loading } from '../components/Loading'
import { TopBar } from '../components/TopBar'
import { subscribeToCaptures } from '../services/captures'
import type { Capture } from '../types'
import './PokedexPage.css'

export function PokedexPage() {
  const [captures, setCaptures] = useState<Capture[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const unsub = subscribeToCaptures(setCaptures, (err) => setError(err.message))
    return unsub
  }, [])

  return (
    <div className="screen">
      <TopBar title="Pokédex" />

      {error && <DialogBox>No se pudieron cargar las capturas: {error}</DialogBox>}

      {!error && captures === null && <Loading label="Cargando capturas..." />}

      {captures !== null && captures.length === 0 && (
        <DialogBox>Todavía no hay capturas. ¡Sé el primero en cazar un Pokémon!</DialogBox>
      )}

      {captures !== null && captures.length > 0 && (
        <div className="pokedex-grid">
          {captures.map((c, i) => (
            <button
              key={c.id}
              type="button"
              className="pokedex-card pixel-border"
              onClick={() => navigate(`/pokedex/${c.id}`)}
            >
              <span className="pokedex-card__number">#{String(captures.length - i).padStart(3, '0')}</span>
              <img src={c.photoUrl} alt={c.pokemonName} className="pokedex-card__img" />
              <span className="pokedex-card__name">{c.pokemonName}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
