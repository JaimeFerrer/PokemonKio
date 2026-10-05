import './ImageLightbox.css'

interface ImageLightboxProps {
  photoUrl: string
  alt: string
  onClose: () => void
}

function toDownloadUrl(url: string): string {
  // Cloudinary: fl_attachment fuerza la descarga en vez de abrir la imagen.
  if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
    return url.replace('/upload/', '/upload/fl_attachment/')
  }
  return url
}

export function ImageLightbox({ photoUrl, alt, onClose }: ImageLightboxProps) {
  return (
    <div className="lightbox" onClick={onClose}>
      <button type="button" className="lightbox__close" onClick={onClose} aria-label="Cerrar">
        ✕
      </button>
      <img src={photoUrl} alt={alt} className="lightbox__img" onClick={(e) => e.stopPropagation()} />
      <a
        href={toDownloadUrl(photoUrl)}
        download={`${alt || 'pokemon'}.jpg`}
        target="_blank"
        rel="noopener noreferrer"
        className="lightbox__download"
        onClick={(e) => e.stopPropagation()}
      >
        ⬇️ Descargar
      </a>
    </div>
  )
}
