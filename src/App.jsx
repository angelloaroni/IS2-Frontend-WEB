import  {Routes,Route} from 'react-router-dom'
import Login from './pages/Login'
import GestorPremios from './pages/GestorPremios'
import Telemetria from './pages/Telemetria'
import Usuarios from './pages/Usuarios'

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='/GestorPremios' element={<GestorPremios/>}/>
      <Route path='/Telemetria' element={<Telemetria/>}/>
      <Route path='/Usuarios' element={<Usuarios/>}/>
    </Routes>
  )
}