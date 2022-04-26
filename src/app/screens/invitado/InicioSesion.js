import React, { useContext, useEffect, useRef, useState } from 'react'
import { Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import AutenticacionContext from '../../components/autenticacion/AutenticacionContext'
import ListaCapsulas from '../../components/invitado/ListaCapsulas'
import { alertConexion, alertError, mostrarMensaje } from '../../utils/Alert'
import { Acceso } from '../../utils/Conexion'
import Input from '../../utils/Input'
import * as Icon from 'react-feather'
import { validarCampoObligatorio } from '../../utils/Validador'

export default function InicioSesion() {
    const { dispatch } = useContext(AutenticacionContext)

    const txtCorreo = useRef()
    const txtContrasena = useRef()

    const [errorCorreo, setErrorCorreo] = useState(null)
    const [errorContrasena, setErrorContrasena] = useState(null)

    useEffect(() => {
        document.body.classList.add('gradient')
        return () => document.body.classList.remove('gradient')
    }, [])

    function iniciarSesion() {
        const correo = txtCorreo.current.value
        const contrasena = txtContrasena.current.value

        let errores = 0
        let error

        error = validarCampoObligatorio(correo)
        setErrorCorreo(error)
        if (error) errores++

        error = validarCampoObligatorio(contrasena)
        setErrorContrasena(error)
        if (error) errores++

        if (errores == 0) {
            Acceso.iniciarSesion(dispatch, { correo, contrasena }).then((res) => {
                if (!res.error) {
                    dispatch({
                        tipo: 'INICIAR SESION',
                        datos: res.datos
                    })
                } else {
                    alertError(res, 'Inicio de sesión fallido')
                }
            }).catch(alertConexion)
        }
    }

    return (
        <Row className='gx-0'>
            <Col xs={12} md={6} xl={4} className='bg-light shadow-lg' style={{ minHeight: '120vh' }}>
                <div style={{ maxWidth: 640, position: 'sticky', top: '30%' }} className='mx-auto p-5'>
                    <h4 className='text-center'>Inicio de sesión</h4>
                    <Form noValidate onSubmit={(event) => {
                        event.preventDefault()
                        iniciarSesion()
                    }}>
                        <Form.Group className='mb-3'>
                            <Input valorName='email' referencia={txtCorreo} nombre='Correo electrónico' error={errorCorreo} tipo='email' />
                        </Form.Group>

                        <Form.Group className='mb-3'>
                            <Input referencia={txtContrasena} nombre='Contraseña' error={errorContrasena} tipo='password' />
                        </Form.Group>
                        <Form.Group className='mb-2'>
                            <Button className='w-100' variant='azul-light' type='submit'><Icon.LogIn size={20} className='me-2' /><span className='align-middle'>Iniciar sesión</span></Button>
                        </Form.Group>
                        <Form.Group >
                            <Form.Text><Link className='text-muted' to={'/restablecimiento/solicitud'}>¿Olvidaste tu contraseña?</Link></Form.Text>
                        </Form.Group>
                    </Form>
                </div>
            </Col>
            <Col xs={12} md={6} xl={8}>
                <ListaCapsulas />
            </Col>
        </Row>
    )
}
