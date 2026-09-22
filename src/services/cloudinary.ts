const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export const cloudinaryReady = Boolean(CLOUD_NAME && UPLOAD_PRESET)

export async function uploadPhoto(file: Blob): Promise<{ url: string; publicId: string }> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', 'pokemonkio')

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    throw new Error('No se pudo subir la foto. Revisa tu configuración de Cloudinary.')
  }

  const data = await res.json()
  return { url: data.secure_url as string, publicId: data.public_id as string }
}
