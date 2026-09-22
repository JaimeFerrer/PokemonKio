import { useNavigate } from 'react-router-dom'
import './TopBar.css'

export function TopBar({ title, back = true }: { title: string; back?: boolean }) {
  const navigate = useNavigate()
  return (
    <div className="top-bar">
      {back && (
        <button className="top-bar__back" onClick={() => navigate(-1)} type="button" aria-label="Volver">
          ◀
        </button>
      )}
      <h1 className="top-bar__title title-sm">{title}</h1>
    </div>
  )
}
