# PokemonKio

App web (PWA) para capturar a la gente más graciosa de vuestras fiestas y viajes ("Pokémon"), subir la foto al momento con vuestro nombre, ubicación y un comentario, y competir con vuestros amigos por ver quién consigue la mejor captura. Interfaz con estética retro estilo Pokémon (menús, Pokédex, cuadros de diálogo).

## Funcionalidades

- **Login/registro** de entrenador (Firebase Auth, email + contraseña).
- **Capturar Pokémon**: haces una foto (cámara del móvil), le pones nombre gracioso y comentario, y se sube con tu ubicación GPS.
- **Pokédex**: galería con todas las capturas del grupo.
- **Mapa**: todos los puntos donde se ha "capturado" algún Pokémon, con marcador tipo Pokéball.
- **Ranking**: mejores capturas (por "me gusta") y mejores entrenadores (por número de capturas).
- **Perfil**: tus capturas y estadísticas, cerrar sesión.
- Instalable como app en el móvil (PWA) y funciona con caché offline para las fotos ya vistas.

## Stack

- React + TypeScript + Vite
- Firebase: Auth, Firestore (base de datos), Storage (fotos)
- React Router
- Leaflet / React-Leaflet (mapa, tiles de OpenStreetMap, sin necesitar API key)
- vite-plugin-pwa (instalable + service worker)

## Puesta en marcha

### 1. Crear el proyecto de Firebase

1. Ve a [console.firebase.google.com](https://console.firebase.google.com) y crea un proyecto nuevo.
2. **Authentication** → Sign-in method → activa **Correo electrónico/contraseña**.
3. **Firestore Database** → créala (modo producción).
4. **Storage** → créalo (modo producción).
5. En "Configuración del proyecto" → "Tus apps" → añade una app web y copia las credenciales (`apiKey`, `authDomain`, etc.).

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Rellena `.env` con las credenciales del paso anterior.

### 3. Instalar dependencias y arrancar en local

```bash
npm install
npm run dev
```

Abre la URL que te indique Vite. Para probar cámara/GPS desde el móvil en tu red local, usa `npm run dev -- --host` y entra desde el móvil a la IP que te muestre (algunos navegadores exigen HTTPS para cámara/GPS fuera de `localhost`).

### 4. Desplegar reglas de seguridad de Firestore y Storage

Las reglas (`firestore.rules`, `storage.rules`) ya están incluidas: cada foto solo la puede subir/editar su propio entrenador, y los "me gusta" son el único campo que cualquier usuario autenticado puede tocar de una captura ajena.

```bash
npm install -g firebase-tools   # si no lo tienes
firebase login
firebase init                  # selecciona el proyecto creado, usa los ficheros ya existentes
firebase deploy --only firestore:rules,storage:rules
```

### 5. Build y despliegue de la app

Puedes desplegar en Firebase Hosting, Vercel o Netlify. Con Firebase Hosting:

```bash
npm run build
firebase deploy --only hosting
```

## Estructura del proyecto

```
src/
  components/     Componentes de UI reutilizables (estilo retro)
  context/        AuthContext (sesión del entrenador)
  hooks/          useGeolocation
  pages/          Pantallas: Login, Menú, Capturar, Pokédex, Detalle, Mapa, Ranking, Perfil
  services/       Acceso a Firestore/Storage (captures.ts)
  firebase.ts     Inicialización del SDK de Firebase
  types.ts        Tipos compartidos (Capture, AppUser)
```

## Próximos pasos posibles

- Subir varias fotos por captura.
- Notificaciones cuando un amigo sube una captura cerca de ti.
- Agrupar marcadores del mapa por "viaje" o "salida".
- Comentarios de otros usuarios en cada captura (no solo likes).
