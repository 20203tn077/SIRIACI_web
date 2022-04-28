import React, { useContext, useRef, useState } from 'react'
import { Button, Card, Container, Form} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import AutenticacionContext from '../../components/autenticacion/AutenticacionContext'
import { alertConexion, alertError, alertExito } from '../../utils/Alert'
import { Restablecimiento } from '../../utils/Conexion'
import Input from '../../utils/Input'
import {validarCampoObligatorio } from '../../utils/Validador'
import * as Icon from 'react-feather'

export default function SolicitudRestablecimiento() {
    const { dispatch } = useContext(AutenticacionContext)
    const navigate = useNavigate()
    const [errorCorreo, setErrorCorreo] = useState(null)
    const txtCorreo = useRef()

    function enviarSolicitud() {
        const correo = txtCorreo.current.value
        const error = validarCampoObligatorio(correo)
        if (error) setErrorCorreo(error)
        else {
            Restablecimiento.registrarSolicitud(dispatch, { correo }).then((res) => {
                if (!res.error) {
                    alertExito(res)
                    navigate('/restablecimiento/verificacion', { state: { correo } })
                } else alertError(res, 'Error al solicitar código de restablecimiento')
            }).catch(alertConexion)
        }
    }

    return (
        <Container className='mt-md-4 mt-3'>
            <Card.Header className='bg-azul-dark text-white'>
                <Card.Title style={{ paddingBlock: '0.5rem'}} className='m-0'>Restablecer contraseña</Card.Title>
            </Card.Header>
            <Card className='shadow mx-auto'>
                <Card.Body>
                    <Card.Text>
                        Ingresa la dirección de correo electrónico con la que registraste tu cuenta, recibirás un correo con un código para restablecer tu contraseña.
                    </Card.Text>
                    <Form noValidate onSubmit={(event) => {
                        event.preventDefault()
                        enviarSolicitud()
                    }}>
                        <Form.Group className='mb-3'>
                            <Input referencia={txtCorreo} nombre='Correo electrónico' error={errorCorreo} tipo='email' valorName='email' />
                        </Form.Group>
                        <Button type='submit' variant="azul-light"><Icon.Mail size={20} className='me-2' /><span className='align-middle'>Enviar código</span></Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    )
}
