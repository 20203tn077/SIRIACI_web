import React, { useContext, useEffect, useRef, useState } from 'react'
import { Badge, Button, Card, Col, Container, Form, FormControl, Image, InputGroup, Nav, Row } from 'react-bootstrap'
import TablaInfinita from '../../utils/TablaInfinita'
import * as Icon from 'react-feather'
import AutenticacionContext from '../autenticacion/AutenticacionContext'
import { getFecha, getFechaYHora, getNombreCompleto } from '../../utils/Formateador'
import Mapa from '../../utils/Mapa'
import Alert, { alertAtender, alertConexion, alertConfirmacion, alertConsulta, alertEliminacion, alertError, alertExito, mostrarMensaje } from '../../utils/Alert'
import { useParams } from 'react-router-dom'
import { IncidenciasAdministrador, Seleccionables } from '../../utils/Conexion'
import { ListaImagenes } from '../../utils/Informacion'
import { ValidacionesIncidencia } from '../../utils/Validador'
import { TextArea } from '../../utils/Input'
import Tema from '../../utils/Tema'

export default function ListaIncidencias() {
  const { dispatch } = useContext(AutenticacionContext)
  const [estados, setEstados] = useState([])
  const [filtro, setFiltro] = useState(null)
  const [incidencias, setIncidencias] = useState([])
  const txtFiltro = useRef()
  const codigo = useParams('codigo')
  const txtComentario = useRef()

  useEffect(() => {
    Seleccionables.obtenerEstados(dispatch).then((res) => {
      if (!res.error) setEstados(res.datos)
    })
    const params = new URLSearchParams(window.location.search)
    const codigo = params.get('codigo')
    if (codigo) consultarIncidencia(null, codigo)
  }, [])

  const columnas = [
    {
      nombre: 'Descripcion',
      valor: (incidencia) => incidencia.descripcion
    },
    {
      nombre: 'Fecha en que se reportó',
      valor: (incidencia) => getFecha(incidencia.tiempoIncidencia)
    },
    {
      nombre: 'Aspecto ambiental',
      valor: (incidencia) => incidencia.aspecto
    },
    {
      nombre: 'Nivel de importancia',
      valor: (incidencia) => (
        <Badge bg={
          ({
            1: 'success',
            2: 'naranja',
            3: 'danger'
          })[incidencia.importancia.id]
        }>{incidencia.importancia.nombre}</Badge>
      )
    },
    {
      nombre: 'Estado de atención',
      valor: (incidencia) => <Badge bg={
        ({
          1: 'verde',
          2: 'warning',
          3: 'secondary'
        })[incidencia.estado.id]
      }>{incidencia.estado.nombre}</Badge>
    },
    {
      nombre: 'Estado',
      valor: (incidencia) => incidencia.activo ? <Badge bg='success'>Activo</Badge> : <Badge bg='secondary'>Inactivo</Badge>
    },
  ]

  function buscar() {
    setFiltro(txtFiltro.current.value)
  }

  function eliminarIncidencia(id) {
    IncidenciasAdministrador.eliminarIncidencia(dispatch, id).then((res) => {
      if (!res.error) {
        const incidenciasActualizado = incidencias.map(incidencia => {
          if (incidencia.id == id) return { ...incidencia, activo: false }
          else return incidencia
        })
        setIncidencias(incidenciasActualizado)
        alertExito(res)
      } else alertError(res)
    }).catch(alertConexion)
  }

  function consultarIncidencia(id, codigo) {
    (codigo ? IncidenciasAdministrador.obtenerIncidenciaPorCodigo : IncidenciasAdministrador.obtenerIncidencia)(dispatch, id ? id : codigo).then((res) => {
      if (!res.error) {
        id = res.datos.id
        const { descripcion, tiempoIncidencia, aspecto: { nombre: aspecto }, importancia, estado, activo, latitud, longitud, comentario, imagenesIncidencia } = res.datos

        let datos = [
          {
            nombre: 'Aspecto ambiental',
            valor: aspecto
          },
          {
            nombre: 'Nivel de importancia',
            valor: (
              <Badge bg={
                ({
                  1: 'success',
                  2: 'naranja',
                  3: 'danger'
                })[importancia.id]
              }>{importancia.nombre}</Badge>
            )
          },
        ]

        if (imagenesIncidencia.length > 0) datos.push({
          nombre: 'Imagenes',
          doble: true,
          valor: <ListaImagenes eventoPostImagen={consulta} imagenes={imagenesIncidencia} />
        })
        datos = [
          ...datos,
          {
            nombre: 'Ubicación',
            doble: true,
            valor: <Mapa latitud={latitud} longitud={longitud} />
          },
          {
            nombre: 'Estado de atención',
            valor: <Badge bg={
              ({
                1: 'verde',
                2: 'warning',
                3: 'secondary'
              })[estado.id]
            }>{estado.nombre}</Badge>
          }
        ]
        if (comentario) datos.push({
          nombre: 'Comentario',
          valor: comentario
        })
        datos = [
          ...datos,
          {
            nombre: 'Estado',
            valor: activo ? <Badge bg='success'>Activo</Badge> : <Badge bg='secondary'>Inactivo</Badge>
          }
        ]

        function consulta() {
          alertConsulta(datos, activo && estado.id != 3, activo, descripcion, `Reportado por ${getNombreCompleto(res.datos.usuario)} el ${getFechaYHora(tiempoIncidencia)}.`, { texto: 'Atender', icono: <Icon.CheckSquare size={20} className='me-2' /> }).then((res) => {
            if (res.isDenied) eliminacion()
            if (res.isConfirmed) formularioAtencion()
          })
        }

        function eliminacion() {
          alertEliminacion('incidencia ambiental', <>la incidencia <b>{descripcion}</b></>).then((res) => {
            if (res.isConfirmed) eliminarIncidencia(id)
            if (res.isDismissed) consulta()
          })
        }

        function formularioAtencion() {
          let datosIncidencia = {comentario}
          let errores = {}

          function guardar() {
            datosIncidencia.comentario = txtComentario.current.value
          }

          function formulario() {
            const nuevoEstado = estados.find(a => a.id == estado.id + 1)
            Alert.fire({
              showCancelButton: true,
              cancelButtonText: <><Icon.X strokeWidth={1.7} className='me-1' /><span className='align-middle'>Cancelar</span></>,
              confirmButtonText: <><Icon.Check size={20} className='me-2' /><span className='align-middle'>Guardar</span></>,
              title: 'Atender incidencia ambiental',
              width: 800,
              html: (
                <>
                  <Row className='text-start w-100 m-0'>
                    <Col><hr className='my-0' /></Col>
                  </Row>
                  <Row className='text-start w-100 m-0 g-3'>
                    <Col xs='12'>
                      <Form.Label className='text-dark w-100'>
                        El estado de la incidencia <b>{descripcion}</b> pasará de <b>{estado.nombre}</b> a <b>{nuevoEstado.nombre}</b>, esta acción es irreversible.
                      </Form.Label>
                    </Col>
                    <Col xs='12'>
                      <TextArea
                        nombre='Comentario'
                        referencia={txtComentario}
                        error={errores.comentario}
                        valorInicial={datosIncidencia.comentario}
                      />
                    </Col>

                  </Row>
                  <Row className='text-start w-100 mx-0 mt-3 mb-0'>
                    <Col><hr className='my-0' /></Col>
                  </Row>
                </>
              ),
              confirmButtonColor: Tema.azulLight
            }).then((res) => {
              if (res.isDismissed) cancelacion()
              if (res.isConfirmed) atencion()
            })
          }

          function atencion() {
            guardar()
            errores = {}
            let numErrores = 0

            let error = ValidacionesIncidencia.validarComentario(datosIncidencia.comentario ? datosIncidencia.comentario : '')
            if (error) {
              errores.comentario = error
              numErrores++
            }
            if (numErrores == 0) {
              IncidenciasAdministrador.antenderIncidencia(dispatch, id, datosIncidencia).then((res) => {
                if (!res.error) {
                  let incidenciasActualizado = incidencias.map((incidencia) => {
                    if (incidencia.id == id) return { ...incidencia, estado: estados.find(estado => estado.id == incidencia.estado.id + 1) }
                    else return incidencia
                  })
                  setIncidencias(incidenciasActualizado)
                  alertExito(res)
                }
                else alertError(res, 'Error al atender la incidencia.')
              }).catch(alertConexion)
            } else formulario()
          }
          function cancelacion() {
            guardar()
            alertConfirmacion('Cancelar', '¿Deseas salir sin atender la incidencia? Se perderá la información ingresada.', 'warning').then((res) => {
              if (res.dismiss) formulario()
              if (res.isConfirmed) consulta()
            })
          }
          formulario()
        }


        consulta()
      } else alertError(res, 'Error al obtener los datos de la incidencia')
    }).catch(alertConexion)
  }

  return (
    <Card className='shadow mx-auto'>
      <Card.Header className='bg-azul-dark text-white'>
        <Row className='gy-2 gy-md-0'>
          <Col>
            <Card.Title style={{ paddingBlock: '0.5rem' }} className='m-0'>Incidencias</Card.Title>
          </Col>
          <Col md='auto'>
            <Form noValidate onSubmit={(event) => {
              event.preventDefault()
              buscar()
            }}>
              <InputGroup>
                <FormControl
                  ref={txtFiltro}
                  placeholder='Descripción'
                />
                <Button type='submit' variant='verde'><Icon.Search /></Button>
              </InputGroup>
            </Form>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        <TablaInfinita onClickElemento={consultarIncidencia} contenido={incidencias} setContenido={setIncidencias} filtro={filtro} numerada columnas={columnas} fuenteContenido={IncidenciasAdministrador.obtenerIncidencias} />
      </Card.Body>
    </Card>

  )
}
