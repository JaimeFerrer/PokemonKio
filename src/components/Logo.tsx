import './Logo.css'

const TOP_TEXT = Array.from('POKÉMON')

export function Logo({ size = 'lg' }: { size?: 'lg' | 'md' }) {
  return (
    <div className={`logo logo--${size}`}>
      
      {/* POKÉMON */}
      <div className="logo__top" aria-label="Pokémon">
        {TOP_TEXT.map((char, i) => (
          <span key={i}>{char}</span>
        ))}
      </div>

      {/* KIO */}
      <div className="logo__bottom" aria-label="KIO">

        {/* K */}
        <span className="logo__go-letter logo__k">
          K
        </span>

        {/* I */}
        <span className="logo__go-letter logo__i">
          I
        </span>

        {/* O / Poké Ball */}
        <span className="logo__o">
          <svg
            viewBox="0 0 100 100"
            className="logo__pokeball"
            aria-hidden="true"
          >
            {/* Outer dark shadow */}
            <circle
              cx="50"
              cy="50"
              r="47"
              fill="#17284d"
            />

            {/* Grey outer border */}
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="#d8d8d8"
            />

            {/* Main blue O */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="#12356d"
            />

            {/* Starry sky */}
            <g fill="#ffffff" opacity="0.9">
              <circle cx="28" cy="22" r="0.9" />
              <circle cx="39" cy="16" r="0.7" />
              <circle cx="58" cy="21" r="0.8" />
              <circle cx="70" cy="30" r="0.6" />
              <circle cx="22" cy="35" r="0.6" />
              <circle cx="77" cy="43" r="0.7" />
              <circle cx="33" cy="30" r="0.5" />
              <circle cx="63" cy="35" r="0.5" />
              <circle cx="47" cy="27" r="0.5" />
              <circle cx="82" cy="24" r="0.5" />
            </g>

            {/* Horizon / landscape */}
            <path
              d="M10 61
                 C25 57 35 59 50 58
                 C65 57 76 60 90 56
                 L90 90
                 L10 90 Z"
              fill="#174f9e"
            />

            <path
              d="M10 61
                 C25 57 35 59 50 58
                 C65 57 76 60 90 56"
              fill="none"
              stroke="#3fa9f5"
              strokeWidth="2"
            />

            {/* Lower landscape */}
            <path
              d="M10 70
                 L27 66
                 L38 71
                 L52 67
                 L63 72
                 L76 67
                 L90 71
                 L90 90
                 L10 90 Z"
              fill="#10458d"
            />

            {/* Poké Ball */}
            <circle
              cx="50"
              cy="51"
              r="19"
              fill="#f4f4f4"
              stroke="#17284d"
              strokeWidth="3"
            />

            <path
              d="M31 51
                 A19 19 0 0 1 69 51
                 L69 51
                 L31 51 Z"
              fill="#ef3340"
            />

            <rect
              x="31"
              y="49"
              width="38"
              height="5"
              fill="#17284d"
            />

            <circle
              cx="50"
              cy="51"
              r="7"
              fill="#17284d"
            />

            <circle
              cx="50"
              cy="51"
              r="4"
              fill="#ffffff"
            />
          </svg>
        </span>
      </div>
    </div>
  )
}
