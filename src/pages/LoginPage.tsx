import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { DialogBox } from '../components/DialogBox'
import { Logo } from '../components/Logo'
import { RetroButton } from '../components/RetroButton'
import { RetroPanel } from '../components/RetroPanel'
import { useAuth } from '../context/AuthContext'
import './LoginPage.css'

type Mode = 'login' | 'register' | 'reset'

export function LoginPage() {
  const { login, register, resetPassword } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  function switchMode(next: Mode) {
    setMode(next)
    setError(null)
    setNotice(null)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setNotice(null)
    setBusy(true)
    try {
      if (mode === 'register') {
        if (!name.trim()) throw new Error('Elige un nombre de entrenador')
        await register(name.trim(), email.trim(), password)
        navigate('/')
      } else if (mode === 'reset') {
        await resetPassword(email.trim())
        setNotice('Te hemos enviado un email para restablecer tu contraseña. Revisa también la carpeta de spam.')
      } else {
        await login(email.trim(), password)
        navigate('/')
      }
    } catch (err) {
      setError(mapError(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="screen">
      <Logo />
      <DialogBox>
        {mode === 'login' && '¡Bienvenido de nuevo, entrenador! Inicia sesión para seguir cazando Pokémon graciosos.'}
        {mode === 'register' && 'Crea tu cuenta de entrenador para empezar a capturar Pokémon por ahí.'}
        {mode === 'reset' && 'Escribe tu email y te enviaremos un enlace para elegir una contraseña nueva.'}
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
          {mode !== 'reset' && (
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
          )}

          {mode === 'login' && (
            <button type="button" className="login-forgot title-sm" onClick={() => switchMode('reset')}>
              ¿Has olvidado tu contraseña?
            </button>
          )}

          {error && <p className="text-body" style={{ color: 'var(--accent-red)' }}>{error}</p>}
          {notice && <p className="text-body" style={{ color: 'var(--accent-green)' }}>{notice}</p>}

          <RetroButton type="submit" disabled={busy}>
            {busy
              ? 'Un momento...'
              : mode === 'login'
                ? 'Entrar'
                : mode === 'register'
                  ? 'Crear cuenta'
                  : 'Enviar enlace'}
          </RetroButton>
        </form>
      </RetroPanel>

      {mode === 'reset' ? (
        <button type="button" className="title-sm login-switch" onClick={() => switchMode('login')}>
          ← Volver a inicio de sesión
        </button>
      ) : (
        <button type="button" className="title-sm login-switch" onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}>
          {mode === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
        </button>
      )}
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
    case 'auth/network-request-failed':
      return 'No hay conexión con el servidor. Revisa tu internet e inténtalo de nuevo.'
    default:
      return err instanceof Error ? err.message : 'Algo ha ido mal, inténtalo de nuevo.'
  }
}
