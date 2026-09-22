import './MenuList.css'

export interface MenuOption {
  key: string
  label: string
  onSelect: () => void
  disabled?: boolean
}

export function MenuList({ options }: { options: MenuOption[] }) {
  return (
    <ul className="menu-list">
      {options.map((opt) => (
        <li key={opt.key}>
          <button
            className="menu-list__item"
            onClick={opt.onSelect}
            disabled={opt.disabled}
            type="button"
          >
            <span className="menu-list__cursor">▶</span>
            <span>{opt.label}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}
