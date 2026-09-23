import { useEffect, useMemo, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { DialogBox } from '../components/DialogBox'
import { Loading } from '../components/Loading'
import { PokedexGrid } from '../components/PokedexGrid'
import { TopBar } from '../components/TopBar'
import { subscribeToCaptures } from '../services/captures'
import type { Capture } from '../types'

export function TrainerPokedexPage() {
  const { userId } = useParams<{ userId: string }>()
  const location = useLocation()
  const [captures, setCaptures] = useState<Capture[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsub = subscribeToCaptures(setCaptures, (err) => setError(err.message))
    return unsub
  }, [])

  const trainerCaptures = useMemo(
    () => (captures ? captures.filter((c) => c.userId === userId) : []),
    [captures, userId],
  )

  const trainerName =
    (location.state as { userName?: string } | null)?.userName ?? trainerCaptures[0]?.userName ?? 'Entrenador'

  return (
    <div className="screen">
      <TopBar title={`Pokédex de ${trainerName}`} />

      {error && <DialogBox>No se pudieron cargar las capturas: {error}</DialogBox>}

      {!error && captures === null && <Loading label="Cargando capturas..." />}

      {captures !== null && trainerCaptures.length === 0 && (
        <DialogBox>Este entrenador todavía no tiene capturas.</DialogBox>
      )}

      {captures !== null && trainerCaptures.length > 0 && <PokedexGrid captures={trainerCaptures} />}
    </div>
  )
}
