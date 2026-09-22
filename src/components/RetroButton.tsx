import type { ButtonHTMLAttributes } from 'react'
import './RetroButton.css'

type Variant = 'primary' | 'secondary' | 'danger'

interface RetroButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

export function RetroButton({ variant = 'primary', className, children, ...rest }: RetroButtonProps) {
  return (
    <button className={`retro-btn retro-btn--${variant} ${className ?? ''}`} {...rest}>
      {children}
    </button>
  )
}
