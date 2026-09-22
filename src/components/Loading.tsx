export function Loading({ label = 'Cargando...' }: { label?: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '32px 0' }}>
      <div className="spinner" />
      <p className="text-body text-muted">{label}</p>
    </div>
  )
}
