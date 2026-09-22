import type { ReactNode } from 'react'
import './RetroPanel.css'

export function RetroPanel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={`retro-panel pixel-border ${className ?? ''}`}>{children}</div>
}
