import { Navigate, Route, Routes } from 'react-router-dom'
import { getSesion, getToken } from './api'
import Login from './pages/Login'
import GestorPremios from './pages/GestorPremios'
import Telemetria from './pages/Telemetria'
import Usuarios from './pages/Usuarios'

function RutaAdmin({ children }) {
  const sesion = getSesion()
  const esAdmin = String(sesion?.tipo || '').toLowerCase() === 'admin'
  if (!getToken() || !esAdmin) {
    return <Navigate to="/" replace />
  }
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/GestorPremios" element={<RutaAdmin><GestorPremios /></RutaAdmin>} />
      <Route path="/premios" element={<RutaAdmin><GestorPremios /></RutaAdmin>} />
      <Route path="/Telemetria" element={<RutaAdmin><Telemetria /></RutaAdmin>} />
      <Route path="/telemetria" element={<RutaAdmin><Telemetria /></RutaAdmin>} />
      <Route path="/Usuarios" element={<RutaAdmin><Usuarios /></RutaAdmin>} />
      <Route path="/usuarios" element={<RutaAdmin><Usuarios /></RutaAdmin>} />
    </Routes>
  )
}
