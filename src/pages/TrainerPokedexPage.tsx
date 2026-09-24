import { useEffect, useMemo, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { DialogBox } from '../components/DialogBox'
import { Loading } from '../components/Loading'
import { PokedexGrid } from '../components/PokedexGrid'
import { RetroPanel } from '../components/RetroPanel'
import { TopBar } from '../components/TopBar'
import { subscribeToCaptures } from '../services/captures'
import { subscribeToUserProfile } from '../services/users'
import type { Capture, UserProfile } from '../types'
import './TrainerPokedexPage.css'

export function TrainerPokedexPage() {
  const { userId } = useParams<{ userId: string }>()
  const location = useLocation()
  const [captures, setCaptures] = useState<Capture[] | null>(null)
  const [profile, setProfile] = useState<UserProfile | null | undefined>(undefined)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsub = subscribeToCaptures(setCaptures, (err) => setError(err.message))
    return unsub
  }, [])

  useEffect(() => {
    if (!userId) return
    const unsub = subscribeToUserProfile(userId, setProfile)
    return unsub
  }, [userId])

  const trainerCaptures = useMemo(
    () => (captures ? captures.filter((c) => c.userId === userId) : []),
    [captures, userId],
  )
  const totalLikes = useMemo(() => trainerCaptures.reduce((sum, c) => sum + c.likes, 0), [trainerCaptures])

  const trainerName =
    profile?.displayName ??
    (location.state as { userName?: string } | null)?.userName ??
    trainerCaptures[0]?.userName ??
    'Entrenador'

  return (
    <div className="screen">
      <TopBar title="Perfil de entrenador" />

      {error && <DialogBox>No se pudieron cargar las capturas: {error}</DialogBox>}

      <RetroPanel className="trainer-card">
        <div className="trainer-avatar">
          {profile?.photoURL ? <img src={profile.photoURL} alt={trainerName} /> : '🧑'}
        </div>
        <div>
          <p className="title-sm">{trainerName}</p>
          <div className="trainer-stats">
            <span className="text-body">
              <strong>{trainerCaptures.length}</strong> capturas
            </span>
            <span className="text-body">
              <strong>{totalLikes}</strong> me gusta
            </span>
          </div>
        </div>
      </RetroPanel>

      <p className="title-sm trainer-pokedex-heading">Pokédex de {trainerName}</p>

      {!error && captures === null && <Loading label="Cargando capturas..." />}

      {captures !== null && trainerCaptures.length === 0 && (
        <DialogBox>Este entrenador todavía no tiene capturas.</DialogBox>
      )}

      {captures !== null && trainerCaptures.length > 0 && <PokedexGrid captures={trainerCaptures} />}
    </div>
  )
}
