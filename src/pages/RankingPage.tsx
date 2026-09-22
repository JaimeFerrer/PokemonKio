import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DialogBox } from '../components/DialogBox'
import { Loading } from '../components/Loading'
import { RetroPanel } from '../components/RetroPanel'
import { TopBar } from '../components/TopBar'
import { subscribeToCaptures } from '../services/captures'
import type { Capture } from '../types'
import './RankingPage.css'

export function RankingPage() {
  const [captures, setCaptures] = useState<Capture[] | null>(null)
  const [tab, setTab] = useState<'captures' | 'trainers'>('captures')
  const navigate = useNavigate()

  useEffect(() => {
    const unsub = subscribeToCaptures(setCaptures)
    return unsub
  }, [])

  const topCaptures = useMemo(
    () => (captures ? [...captures].sort((a, b) => b.likes - a.likes).slice(0, 15) : []),
    [captures],
  )

  const topTrainers = useMemo(() => {
    if (!captures) return []
    const map = new Map<string, { name: string; count: number; likes: number }>()
    for (const c of captures) {
      const entry = map.get(c.userId) ?? { name: c.userName, count: 0, likes: 0 }
      entry.count += 1
      entry.likes += c.likes
      map.set(c.userId, entry)
    }
    return [...map.values()].sort((a, b) => b.count - a.count || b.likes - a.likes)
  }, [captures])

  return (
    <div className="screen">
      <TopBar title="Ranking" />
      <DialogBox>¡Aquí se decide quién es el mejor cazador de Pokémon graciosos!</DialogBox>

      <div className="ranking-tabs">
        <button
          className={`title-sm ranking-tab ${tab === 'captures' ? 'ranking-tab--active' : ''}`}
          onClick={() => setTab('captures')}
          type="button"
        >
          Mejores capturas
        </button>
        <button
          className={`title-sm ranking-tab ${tab === 'trainers' ? 'ranking-tab--active' : ''}`}
          onClick={() => setTab('trainers')}
          type="button"
        >
          Entrenadores
        </button>
      </div>

      {captures === null && <Loading />}

      {captures !== null && tab === 'captures' && (
        <RetroPanel>
          {topCaptures.length === 0 && <p className="text-body">Sin capturas todavía.</p>}
          <ol className="ranking-list">
            {topCaptures.map((c, i) => (
              <li key={c.id} className="ranking-list__item" onClick={() => navigate(`/pokedex/${c.id}`)}>
                <span className="ranking-list__pos">{i + 1}</span>
                <img src={c.photoUrl} alt={c.pokemonName} />
                <div className="ranking-list__info">
                  <span className="title-sm">{c.pokemonName}</span>
                  <span className="text-body text-muted">por {c.userName}</span>
                </div>
                <span className="ranking-list__likes">❤️ {c.likes}</span>
              </li>
            ))}
          </ol>
        </RetroPanel>
      )}

      {captures !== null && tab === 'trainers' && (
        <RetroPanel>
          {topTrainers.length === 0 && <p className="text-body">Sin entrenadores todavía.</p>}
          <ol className="ranking-list">
            {topTrainers.map((t, i) => (
              <li key={t.name + i} className="ranking-list__item">
                <span className="ranking-list__pos">{i + 1}</span>
                <div className="ranking-list__info">
                  <span className="title-sm">{t.name}</span>
                  <span className="text-body text-muted">{t.count} capturas</span>
                </div>
                <span className="ranking-list__likes">❤️ {t.likes}</span>
              </li>
            ))}
          </ol>
        </RetroPanel>
      )}
    </div>
  )
}
