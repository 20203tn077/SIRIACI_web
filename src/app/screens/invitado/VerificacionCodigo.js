import React, { useContext, useRef, useState } from 'react'
import { Button, Card, Container, Form } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import AutenticacionContext from '../../components/autenticacion/AutenticacionContext'
import { alertConexion, alertError, alertExito } from '../../utils/Alert'
import { Restablecimiento } from '../../utils/Conexion'
import Input from '../../utils/Input'
import { validarCampoObligatorio } from '../../utils/Validador'
import * as Icon from 'react-feather'

export default function VerificacionCodigo() {
  const { state: { correo } } = useLocation()
  const { dispatch } = useContext(AutenticacionContext)
  const navigate = useNavigate()
  const txtCodigo = useRef()
  const [errorCodigo, setErrorCodigo] = useState(null)

  function verificarCodigo() {
    const codigo = txtCodigo.current.value
    const error = validarCampoObligatorio(codigo)
    if (error) setErrorCodigo(error)
    else {
      Restablecimiento.validarCodigo(dispatch, { correo, codigo }).then((res) => {
        if (!res.error) {
          alertExito(res)
          navigate('/restablecimiento/contrasena', { state: { correo, codigo }, replace: true })
        } else alertError(res, 'Error al validar código de restablecimiento')
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
            Hemos enviado un código de 6 dígitos a <b>{correo}</b>, revisa tu bandeja de entrada. Debes canjear el código durante los siguientes 10 minutos.
          </Card.Text>
          <Form noValidate onSubmit={(event) => {
            event.preventDefault()
            verificarCodigo()
          }}>
            <Form.Group className='mb-3'>
              <Input maxlength='6' referencia={txtCodigo} nombre='Código de restablecimiento' error={errorCodigo} />
            </Form.Group>
            <Button type='submit' variant="azul-light"><Icon.CheckCircle size={20} className='me-2' /><span className='align-middle'>Verificar código</span></Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}
