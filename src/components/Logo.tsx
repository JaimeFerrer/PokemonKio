import './Logo.css'

export function Logo({ size = 'lg' }: { size?: 'lg' | 'md' }) {
  return (
    <div className={`logo logo--${size}`}>
      <div className="logo__top">POKÉMON</div>
      <div className="logo__bottom">
        <span>KI</span>
        <svg viewBox="0 0 100 100" className="logo__pokeball" aria-hidden="true">
          <circle cx="50" cy="50" r="44" fill="#f4f4f4" stroke="#1b1b1b" strokeWidth="6" />
          <path d="M8 50 A42 42 0 0 1 92 50 Z" fill="#e0483e" stroke="#1b1b1b" strokeWidth="6" />
          <rect x="6" y="46" width="88" height="8" fill="#1b1b1b" />
          <circle cx="50" cy="50" r="16" fill="#1b1b1b" />
          <circle cx="50" cy="50" r="10" fill="#f4f4f4" />
        </svg>
      </div>
    </div>
  )
}
