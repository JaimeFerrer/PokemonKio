import { DialogBox } from '../components/DialogBox'
import { RetroPanel } from '../components/RetroPanel'

export function FirebaseSetupPage() {
  return (
    <div className="screen">
      <h1 className="title-lg" style={{ textAlign: 'center' }}>
        Pokemon<span style={{ color: 'var(--accent-red)' }}>Kio</span>
      </h1>
      <DialogBox>Falta configurar Firebase antes de poder cazar Pokémon.</DialogBox>
      <RetroPanel>
        <p className="text-body">
          1. Copia <code>.env.example</code> como <code>.env</code>.
        </p>
        <p className="text-body">2. Rellénalo con las credenciales de tu proyecto Firebase.</p>
        <p className="text-body">3. Reinicia el servidor (<code>npm run dev</code>).</p>
        <p className="text-body text-muted">Instrucciones detalladas en el README del proyecto.</p>
      </RetroPanel>
    </div>
  )
}
