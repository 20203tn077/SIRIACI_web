import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AutenticacionContext from '../../components/autenticacion/AutenticacionContext'
import NavInvitado from '../../navigation/NavInvitado'
import { alertConexion, alertError, alertExito, mostrarMensaje } from '../../utils/Alert'
import { Verificacion as Conexion } from '../../utils/Conexion'

export default function Verificacion() {
    const navigate = useNavigate()
    const { dispatch } = useContext(AutenticacionContext)
    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const correo = params.get('correo')
        const codigo = params.get('codigo')
        if (!correo || !codigo) {
            mostrarMensaje('Error', '', 'error').then((res) => {
                navigate('/')
            })
        } else {
            Conexion.verificarUsuario(dispatch, { correo, codigo }).then((res) => {
                if (!res.error) alertExito(res, 'Puedes iniciar sesión utilizando el correo y contraseña que registraste.').then((res) => {
                    navigate('/')
                })
                else alertError(res, 'Error al verificar la cuenta').then((res) => {
                    navigate('/')
                }).catch(() => alertConexion).then((res) => {
                    navigate('/')
                })
            })
        }
    }, [])
    return (
        <div></div>
    )
}
