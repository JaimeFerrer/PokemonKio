import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RetroButton } from '../components/RetroButton'
import { RetroPanel } from '../components/RetroPanel'
import { TopBar } from '../components/TopBar'
import { useAuth } from '../context/AuthContext'
import { subscribeToCaptures } from '../services/captures'
import type { Capture } from '../types'
import './ProfilePage.css'

export function ProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [captures, setCaptures] = useState<Capture[] | null>(null)

  useEffect(() => {
    const unsub = subscribeToCaptures(setCaptures)
    return unsub
  }, [])

  const myCaptures = useMemo(
    () => (captures && user ? captures.filter((c) => c.userId === user.uid) : []),
    [captures, user],
  )
  const totalLikes = useMemo(() => myCaptures.reduce((sum, c) => sum + c.likes, 0), [myCaptures])

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <div className="screen">
      <TopBar title="Perfil" />

      <RetroPanel className="profile-card">
        <div className="profile-avatar">🧑</div>
        <div>
          <p className="title-sm">{user?.displayName}</p>
          <p className="text-body text-muted">{user?.email}</p>
        </div>
      </RetroPanel>

      <div className="profile-stats">
        <RetroPanel className="profile-stat">
          <span className="title-lg">{myCaptures.length}</span>
          <span className="text-body">Capturas</span>
        </RetroPanel>
        <RetroPanel className="profile-stat">
          <span className="title-lg">{totalLikes}</span>
          <span className="text-body">Me gusta</span>
        </RetroPanel>
      </div>

      {myCaptures.length > 0 && (
        <div className="profile-grid">
          {myCaptures.map((c) => (
            <img
              key={c.id}
              src={c.photoUrl}
              alt={c.pokemonName}
              className="profile-grid__img pixel-border"
              onClick={() => navigate(`/pokedex/${c.id}`)}
            />
          ))}
        </div>
      )}

      <RetroButton variant="danger" onClick={handleLogout}>
        Cerrar sesión
      </RetroButton>
    </div>
  )
}
