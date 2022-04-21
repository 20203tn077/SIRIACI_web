import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AutenticacionContext from '../components/autenticacion/AutenticacionContext'

export default function Redirect() {
    const navigate = useNavigate()
    const {sesion: {rolActivo}} = useContext(AutenticacionContext)
    useEffect(() => {
        navigate(
            ({
                'ROLE_ADMINISTRADOR': '/usuarios',
                'ROLE_RESPONSABLE': '/incidencias'
            })[rolActivo]
        )
    })
  return (
    <div></div>
  )
}
