import { Icon } from 'leaflet'

const pokeballSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="34" height="34">
  <circle cx="20" cy="20" r="17" fill="#f4f4f4" stroke="#20223a" stroke-width="3"/>
  <path d="M3 20 A17 17 0 0 1 37 20 Z" fill="#e0483e" stroke="#20223a" stroke-width="3"/>
  <rect x="3" y="18.5" width="34" height="3" fill="#20223a"/>
  <circle cx="20" cy="20" r="6" fill="#f4f4f4" stroke="#20223a" stroke-width="3"/>
</svg>`.trim()

export const pokemonMarkerIcon = new Icon({
  iconUrl: `data:image/svg+xml;base64,${btoa(pokeballSvg)}`,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
  popupAnchor: [0, -17],
})
