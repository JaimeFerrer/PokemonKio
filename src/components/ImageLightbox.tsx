import './ImageLightbox.css'

interface ImageLightboxProps {
  photoUrl: string
  alt: string
  onClose: () => void
}

export function ImageLightbox({ photoUrl, alt, onClose }: ImageLightboxProps) {
  return (
    <div className="lightbox" onClick={onClose}>
      <button type="button" className="lightbox__close" onClick={onClose} aria-label="Cerrar">
        ✕
      </button>
      <img src={photoUrl} alt={alt} className="lightbox__img" onClick={(e) => e.stopPropagation()} />
    </div>
  )
}
