import { useEffect, useMemo, useState } from 'react'
import { DialogBox } from '../components/DialogBox'
import { Loading } from '../components/Loading'
import { PokedexGrid } from '../components/PokedexGrid'
import { TopBar } from '../components/TopBar'
import { useAuth } from '../context/AuthContext'
import { subscribeToCaptures } from '../services/captures'
import type { Capture } from '../types'
import './PokedexPage.css'

export function PokedexPage() {
  const { user } = useAuth()
  const [captures, setCaptures] = useState<Capture[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<'general' | 'individual'>('general')

  useEffect(() => {
    const unsub = subscribeToCaptures(setCaptures, (err) => setError(err.message))
    return unsub
  }, [])

  const myCaptures = useMemo(
    () => (captures && user ? captures.filter((c) => c.userId === user.uid) : []),
    [captures, user],
  )

  return (
    <div className="screen">
      <TopBar title="Pokédex" />

      <div className="pokedex-tabs">
        <button
          className={`title-sm pokedex-tab ${tab === 'general' ? 'pokedex-tab--active' : ''}`}
          onClick={() => setTab('general')}
          type="button"
        >
          General
        </button>
        <button
          className={`title-sm pokedex-tab ${tab === 'individual' ? 'pokedex-tab--active' : ''}`}
          onClick={() => setTab('individual')}
          type="button"
        >
          Individual
        </button>
      </div>

      {error && <DialogBox>No se pudieron cargar las capturas: {error}</DialogBox>}

      {!error && captures === null && <Loading label="Cargando capturas..." />}

      {captures !== null && tab === 'general' && (
        captures.length === 0 ? (
          <DialogBox>Todavía no hay capturas. ¡Sé el primero en cazar un Pokémon!</DialogBox>
        ) : (
          <PokedexGrid captures={captures} showTrainer />
        )
      )}

      {captures !== null && tab === 'individual' && (
        myCaptures.length === 0 ? (
          <DialogBox>Todavía no tienes capturas propias. ¡Ve a cazar tu primer Pokémon!</DialogBox>
        ) : (
          <PokedexGrid captures={myCaptures} />
        )
      )}
    </div>
  )
}
