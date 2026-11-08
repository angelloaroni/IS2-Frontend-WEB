import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { getSesion, getToken } from './api'
import AvisosLlenado from './components/AvisosLlenado'
import Login from './pages/Login'
import GestorPremios from './pages/GestorPremios'
import Telemetria from './pages/Telemetria'
import Usuarios from './pages/Usuarios'
import Alertas from './pages/Alertas'
import Participacion from './pages/Participacion'

function RutaAdmin() {
  const sesion = getSesion()
  const esAdmin = String(sesion?.tipo || '').toLowerCase() === 'admin'
  if (!getToken() || !esAdmin) {
    return <Navigate to="/" replace />
  }
  return (
    <AvisosLlenado>
      <Outlet />
    </AvisosLlenado>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<RutaAdmin />}>
        <Route path="/GestorPremios" element={<GestorPremios />} />
        <Route path="/premios" element={<GestorPremios />} />
        <Route path="/Telemetria" element={<Telemetria />} />
        <Route path="/telemetria" element={<Telemetria />} />
        <Route path="/Usuarios" element={<Usuarios />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/Participacion" element={<Participacion />} />
        <Route path="/participacion" element={<Participacion />} />
        <Route path="/alertas" element={<Alertas />} />
      </Route>
    </Routes>
  )
}
