import React, { useContext, useEffect, useRef, useState } from 'react'
import { Badge, Button, Card, Col, Container, FormControl, Image, InputGroup, Nav, Row } from 'react-bootstrap'
import { Conexion } from '../../utils/Conexion'
import TablaInfinita from '../../utils/TablaInfinita'
import * as Icon from 'react-feather'
import AutenticacionContext from '../autenticacion/AutenticacionContext'
import { getFecha, getFechaYHora, getNombreCompleto } from '../../utils/Formateador'
import Mapa from '../../utils/Mapa'
import { alertConsulta, alertEliminacion, mostrarMensaje } from '../../utils/Alert'
import { useParams } from 'react-router-dom'

export default function ListaIncidencias() {
  const { dispatch } = useContext(AutenticacionContext)
  const [filtro, setFiltro] = useState(null)
  const [incidencias, setIncidencias] = useState([])
  const txtFiltro = useRef()
  const codigo = useParams('codigo')

  useEffect(() => {
    if (codigo.codigo) consultarIncidencia(codigo.codigo)
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
    Conexion.IncidenciasAdministrador.eliminarIncidencia(dispatch, id).then((res) => {
      if (!res.error) {
        const incidenciasActualizado = incidencias.map(incidencia => {
          if (incidencia.id == id) return { ...incidencia, activo: false }
          else return incidencia
        })
        setIncidencias(incidenciasActualizado)
        mostrarMensaje('Eliminación realizada', 'La incidencia ha sido eliminada exitósamente.', 'success')
      } else mostrarMensaje('Error al eliminar la incidencia', res.mensajeGeneral, 'error')
    }).catch((error) => mostrarMensaje('Error de conexión', 'No fue posible establecer conexión con el servidor.', 'error'))
  }

  function consultarIncidencia(id) {
    Conexion.IncidenciasAdministrador.obtenerIncidencia(dispatch, id).then((res) => {
      if (!res.error) {
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
          valor: (
            <Row className='g-3'>
              {imagenesIncidencia.map((imagen, index) => (
                <Col xs={12} sm={6} md={4} key={index}>
                  <Image className='img-thumbnail' style={{ height: 150, width: '100%', objectFit: 'cover' }} src={`data:image/png;base64,${imagen.imagen}`} />
                </Col>
              ))}
            </Row>
          )
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
          alertConsulta(datos, activo && estado.id != 3, activo, descripcion, `Reportado por ${getNombreCompleto(res.datos.usuario)} el ${getFechaYHora(tiempoIncidencia)}.`, { texto: 'Atender', icono: <Icon.CheckCircle /> }).then((res) => {
            if (res.isDenied) eliminacion()
          })
        }

        function eliminacion() {
          alertEliminacion('incidencia ambiental', <>la incidencia <b>{descripcion}</b></>).then((res) => {
            if (res.isConfirmed) eliminarIncidencia(id)
            if (res.isDismissed) consulta()
          })
        }

        consulta()
      } else mostrarMensaje('Error al obtener los datos de la incidencia', res.mensajeGeneral, 'error')
    }).catch((error) => mostrarMensaje('Error de conexión', 'No fue posible establecer conexión con el servidor.', 'error'))
  }

  return (
    <Card className='shadow mx-auto'>
      <Card.Header className='bg-azul-dark text-white'>
        <Row className='gy-2 gy-md-0'>
          <Col>
            <Card.Title style={{ paddingBlock: '0.5rem' }} className='m-0'>Incidencias</Card.Title>
          </Col>
          <Col md='auto'>
            <InputGroup>
              <FormControl
                ref={txtFiltro}
                placeholder='Descripción'
              />
              <Button onClick={buscar} variant='verde'><Icon.Search /></Button>
            </InputGroup>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        <TablaInfinita onClickElemento={consultarIncidencia} contenido={incidencias} setContenido={setIncidencias} filtro={filtro} numerada columnas={columnas} fuenteContenido={Conexion.IncidenciasAdministrador.obtenerIncidencias} />
      </Card.Body>
    </Card>

  )
}
