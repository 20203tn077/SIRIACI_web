import './App.css'
import './App.scss'
import AppRouter from './app/navigation/AppRouter'
import AutenticacionContext from './app/components/autenticacion/AutenticacionContext'
import { useEffect, useReducer } from 'react'
import autenticacionReducer from './app/components/autenticacion/AutenticacionReducer'

const init = () => {
  return JSON.parse(localStorage.getItem('sesion')) || { autenticado: false }
}

function App() {
  const [sesion, dispatch] = useReducer(autenticacionReducer, {}, init)

  useEffect(() => {
    if (sesion) localStorage.setItem('sesion', JSON.stringify(sesion))
  }, [sesion])

  return (
    <AutenticacionContext.Provider value={{sesion, dispatch}}>
      <AppRouter/>
    </AutenticacionContext.Provider>
  )
}

export default App
