import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AutenticacionContext from '../../components/autenticacion/AutenticacionContext'
import NavInvitado from '../../navigation/NavInvitado'
import { mostrarMensaje } from '../../utils/Alert'
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
                if (!res.error) mostrarMensaje('¡Cuenta verificada!', 'Tu cuenta ha sido verificada, ahora puedes iniciar sesión utilizando los datos que registraste.', 'success').then((res) => {
                    navigate('/')
                })
                else mostrarMensaje('Error al verificar la cuenta', res.mensajeGeneral, 'error').then((res) => {
                    navigate('/')
                }).catch((error) => mostrarMensaje('Error de conexión', 'No fue posible establecer conexión con el servidor.', 'error')).then((res) => {
                    navigate('/')
                })
            })
        }
    }, [])
    return (
        <div></div>
    )
}
