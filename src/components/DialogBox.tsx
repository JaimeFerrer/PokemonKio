import type { ReactNode } from 'react'
import './DialogBox.css'

export function DialogBox({ children }: { children: ReactNode }) {
  return (
    <div className="dialog-box pixel-border">
      <p className="text-body">{children}</p>
    </div>
  )
}
