import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { DialogBox } from '../components/DialogBox'
import { RetroButton } from '../components/RetroButton'
import { RetroPanel } from '../components/RetroPanel'
import { useAuth } from '../context/AuthContext'
import './LoginPage.css'

export function LoginPage() {
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      if (mode === 'register') {
        if (!name.trim()) throw new Error('Elige un nombre de entrenador')
        await register(name.trim(), email.trim(), password)
      } else {
        await login(email.trim(), password)
      }
      navigate('/')
    } catch (err) {
      setError(mapError(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="screen">
      <h1 className="title-lg" style={{ textAlign: 'center' }}>
        Pokemon<span style={{ color: 'var(--accent-red)' }}>Kio</span>
      </h1>
      <DialogBox>
        {mode === 'login'
          ? '¡Bienvenido de nuevo, entrenador! Inicia sesión para seguir cazando Pokémon graciosos.'
          : 'Crea tu cuenta de entrenador para empezar a capturar Pokémon por ahí.'}
      </DialogBox>

      <RetroPanel>
        <form className="login-form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <label className="login-form__field">
              <span className="title-sm">Nombre</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ash" required />
            </label>
          )}
          <label className="login-form__field">
            <span className="title-sm">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ash@pokemonkio.com"
              required
            />
          </label>
          <label className="login-form__field">
            <span className="title-sm">Contraseña</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={6}
              required
            />
          </label>

          {error && <p className="text-body" style={{ color: 'var(--accent-red)' }}>{error}</p>}

          <RetroButton type="submit" disabled={busy}>
            {busy ? 'Un momento...' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
          </RetroButton>
        </form>
      </RetroPanel>

      <button
        type="button"
        className="title-sm login-switch"
        onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
      >
        {mode === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
      </button>
    </div>
  )
}

function mapError(err: unknown): string {
  const code = (err as { code?: string })?.code
  switch (code) {
    case 'auth/email-already-in-use':
      return 'Ese email ya tiene una cuenta de entrenador.'
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Email o contraseña incorrectos.'
    case 'auth/weak-password':
      return 'La contraseña debe tener al menos 6 caracteres.'
    default:
      return err instanceof Error ? err.message : 'Algo ha ido mal, inténtalo de nuevo.'
  }
}
