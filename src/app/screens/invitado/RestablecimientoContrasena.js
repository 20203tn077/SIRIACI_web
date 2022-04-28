import React, { useContext, useRef, useState } from 'react'
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import AutenticacionContext from '../../components/autenticacion/AutenticacionContext'
import { alertConexion, alertError, alertExito } from '../../utils/Alert'
import { Restablecimiento } from '../../utils/Conexion'
import Input from '../../utils/Input'
import { ValidacionesUsuario } from '../../utils/Validador'
import * as Icon from 'react-feather'

export default function RestablecimientoContrasena() {
  const { state: { correo, codigo } } = useLocation()
  const { dispatch } = useContext(AutenticacionContext)
  const navigate = useNavigate()
  const [errores, setErrores] = useState({})
  const txtContrasena = useRef()
  const txtContrasena2 = useRef()

  function restablecerContrasena() {
    const contrasena = txtContrasena.current.value
    const contrasena2 = txtContrasena2.current.value
    const err = {}

    let numErrores = 0
    let error = ValidacionesUsuario.validarContrasena(contrasena)
    if (error) {
      err.contrasena = error
      numErrores++
    }
    error = ValidacionesUsuario.validarConfirmacionContrasena(contrasena, contrasena2)
    if (error) {
      err.contrasena2 = error
      numErrores++
    }

    setErrores(err)
    if (numErrores === 0) {
      Restablecimiento.restablecerContrasena(dispatch, { correo, codigo, contrasena }).then((res) => {
        if (!res.error) {
          alertExito(res)
          navigate('/', { replace: true })
        } else alertError(res, 'Error al actualizar la contraseña')
      }).catch(alertConexion)
    }
  }

  return (
    <Container className='mt-md-4 mt-3'>
      <Card className='shadow mx-auto'>
        <Card.Header className='bg-azul-dark text-white'>
          <Card.Title style={{ paddingBlock: '0.5rem' }} className='m-0'>Restablecer contraseña</Card.Title>
        </Card.Header>
        <Card.Body>
          <Card.Text>
            Ingresa una nueva contraseña. Tienes 10 minutos para realizar el cambio.
          </Card.Text>
          <Form noValidate onSubmit={(event) => {
            event.preventDefault()
            restablecerContrasena()
          }}>
            <Row className='mb-3 mx-0 gx-0 gx-md-3 gy-3'>
              <Col xs='12' md='6' className='ps-0'>
                <Input referencia={txtContrasena} nombre='Contraseña' error={errores.contrasena} tipo='password' />
              </Col>
              <Col xs='12' md='6' className='pe-0'>
                <Input referencia={txtContrasena2} nombre='Confirmar contraseña' error={errores.contrasena2} tipo='password' />
              </Col>
            </Row>
            <Button type='submit' variant="azul-light"><Icon.Check size={20} className='me-2' /><span className='align-middle'>Actualizar contraseña</span></Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}
