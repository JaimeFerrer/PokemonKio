import { useNavigate } from 'react-router-dom'
import { DialogBox } from '../components/DialogBox'
import { MenuList } from '../components/MenuList'
import { useAuth } from '../context/AuthContext'
import './MainMenuPage.css'

export function MainMenuPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const name = user?.displayName || 'Entrenador'

  return (
    <div className="screen">
      <div className="main-menu__header">
        <h1 className="title-lg">
          Pokemon<span style={{ color: 'var(--accent-red)' }}>Kio</span>
        </h1>
        <p className="title-sm text-muted">Entrenador: {name}</p>
      </div>

      <DialogBox>¿Qué quieres hacer hoy?</DialogBox>

      <MenuList
        options={[
          { key: 'capture', label: '📸 Capturar Pokémon', onSelect: () => navigate('/capturar') },
          { key: 'pokedex', label: '📖 Pokédex', onSelect: () => navigate('/pokedex') },
          { key: 'map', label: '🗺️ Mapa', onSelect: () => navigate('/mapa') },
          { key: 'ranking', label: '🏆 Ranking', onSelect: () => navigate('/ranking') },
          { key: 'profile', label: '🧑 Perfil', onSelect: () => navigate('/perfil') },
        ]}
      />
    </div>
  )
}
