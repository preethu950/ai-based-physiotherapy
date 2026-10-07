import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import MainLayout from './layouts/MainLayout'
import { Landing } from './pages/Landing'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { ForgotPassword } from './pages/ForgotPassword'
import { Dashboard } from './pages/Dashboard'
import { Exercises } from './pages/Exercises'
import { ExerciseDetail } from './pages/ExerciseDetail'
import { Session } from './pages/Session'
import { SessionSummary } from './pages/SessionSummary'
import { History } from './pages/History'
import { SessionDetail } from './pages/SessionDetail'
import { Progress } from './pages/Progress'
import { Assistant } from './pages/Assistant'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal"></div>
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />

      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/exercises" element={<Exercises />} />
        <Route path="/exercises/:id" element={<ExerciseDetail />} />
        <Route path="/history" element={<History />} />
        <Route path="/history/:id" element={<SessionDetail />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/assistant" element={<Assistant />} />
      </Route>

      <Route path="/session/:exerciseId" element={<ProtectedRoute><Session /></ProtectedRoute>} />
      <Route path="/session/:exerciseId/summary" element={<ProtectedRoute><SessionSummary /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
