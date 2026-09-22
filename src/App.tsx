import type { ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Loading } from './components/Loading'
import { AuthProvider, useAuth } from './context/AuthContext'
import { firebaseReady } from './firebase'
import { CaptureDetailPage } from './pages/CaptureDetailPage'
import { CapturePage } from './pages/CapturePage'
import { FirebaseSetupPage } from './pages/FirebaseSetupPage'
import { LoginPage } from './pages/LoginPage'
import { MainMenuPage } from './pages/MainMenuPage'
import { MapPage } from './pages/MapPage'
import { PokedexPage } from './pages/PokedexPage'
import { ProfilePage } from './pages/ProfilePage'
import { RankingPage } from './pages/RankingPage'

function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <Loading label="Cargando entrenador..." />
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <MainMenuPage />
          </RequireAuth>
        }
      />
      <Route
        path="/capturar"
        element={
          <RequireAuth>
            <CapturePage />
          </RequireAuth>
        }
      />
      <Route
        path="/pokedex"
        element={
          <RequireAuth>
            <PokedexPage />
          </RequireAuth>
        }
      />
      <Route
        path="/pokedex/:id"
        element={
          <RequireAuth>
            <CaptureDetailPage />
          </RequireAuth>
        }
      />
      <Route
        path="/mapa"
        element={
          <RequireAuth>
            <MapPage />
          </RequireAuth>
        }
      />
      <Route
        path="/ranking"
        element={
          <RequireAuth>
            <RankingPage />
          </RequireAuth>
        }
      />
      <Route
        path="/perfil"
        element={
          <RequireAuth>
            <ProfilePage />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  if (!firebaseReady) return <FirebaseSetupPage />

  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
