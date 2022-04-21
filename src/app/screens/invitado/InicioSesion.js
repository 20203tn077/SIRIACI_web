import React, { useContext, useEffect, useRef, useState } from 'react'
import { Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap'
import AutenticacionContext from '../../components/autenticacion/AutenticacionContext'
import ListaCapsulas from '../../components/invitado/ListaCapsulas'
import { alertConexion, alertError, mostrarMensaje } from '../../utils/Alert'
import { Acceso } from '../../utils/Conexion'
import Input from '../../utils/Input'
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
        <div className='w-100'>
            <Row className='g-4 g-md-0 w-100 m-0'>
                <Col xs={12} md={6}>
                    <Card style={{ maxWidth: 640, borderRadius: 15 }} className='shadow-lg mx-auto'>
                        <Card.Body>
                            <Card.Title><h4 className='text-center'>Inicio de sesión</h4></Card.Title>
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
                                <Button variant='azul-light' type='submit'>Iniciar sesión</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} md={6}>
                    <ListaCapsulas />
                </Col>
            </Row>
        </div>

    )
}
