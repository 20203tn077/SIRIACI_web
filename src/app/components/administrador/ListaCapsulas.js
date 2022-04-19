import React, { useContext, useRef, useState } from 'react'
import { Badge, Button, Card, Col, Container, FormControl, Image, InputGroup, Nav, Row } from 'react-bootstrap'
import { Conexion } from '../../utils/Conexion'
import TablaInfinita from '../../utils/TablaInfinita'
import * as Icon from 'react-feather'
import AutenticacionContext from '../autenticacion/AutenticacionContext'
import { getFecha, getFechaYHora, getNombreCompleto } from '../../utils/Formateador'
import { alertConsulta, alertEliminacion, mostrarMensaje } from '../../utils/Alert'

export default function ListaCapsulas() {
    const { dispatch } = useContext(AutenticacionContext)
    const [filtro, setFiltro] = useState(null)
    const [capsulas, setCapsulas] = useState([])
    const txtFiltro = useRef()

    const columnas = [
        {
            nombre: 'Titulo',
            valor: (capsula) => capsula.titulo
        },
        {
            nombre: 'Fecha de publicación',
            valor: (capsula) => getFecha(capsula.fechaPublicacion)
        },
        {
            nombre: 'Estado',
            valor: (capsula) => capsula.activo ? <Badge bg='success'>Activo</Badge> : <Badge bg='secondary'>Inactivo</Badge>
        }
    ]

    function buscar() {
        setFiltro(txtFiltro.current.value)
    }

    function eliminarCapsula(id) {
        Conexion.CapsulasAdministrador.eliminarCapsula(dispatch, id).then((res) => {
            if (!res.error) {
                const capsulasActualizado = capsulas.map((capsula) => {
                    if (capsula.id === id) return { ...capsula, activo: false }
                    else return capsula
                })
                setCapsulas(capsulasActualizado)
                mostrarMensaje('Eliminación realizada', 'La cápsula ha sido eliminada exitósamente.', 'success')
            } else mostrarMensaje('Error al eliminar cápsula', res.mensajeGeneral, 'error')
        }).catch((error) => mostrarMensaje('Error de conexión', 'No fue posible establecer conexión con el servidor.', 'error'))
    }

    function consultarCapsula(id) {
        Conexion.CapsulasAdministrador.obtenerCapsula(dispatch, id).then((res) => {
            if (!res.error) {
                const { titulo, fechaPublicacion, contenido, activo, imagenesCapsula } = res.datos
                const datos = [
                    {
                        nombre: 'Contenido',
                        doble: true,
                        valor: contenido
                    },
                    {
                        nombre: 'Imagenes',
                        doble: true,
                        valor: (
                            <Row className='g-3'>
                                {imagenesCapsula.map((imagen, index) => (
                                    <Col xs={12} sm={6} md={4} key={index}>
                                        <Image className='img-thumbnail' style={{ height: 150, width: '100%', objectFit: 'cover' }} src={`data:image/png;base64,${imagen.imagen}`} />
                                    </Col>
                                ))}
                            </Row>
                        )
                    },
                    {
                        nombre: 'Estado',
                        valor: activo ? <Badge bg='success'>Activo</Badge> : <Badge bg='secondary'>Inactivo</Badge>
                    }
                ]
                function consulta() {
                    alertConsulta(datos, activo, activo, titulo, `Publicado por ${getNombreCompleto(res.datos.usuario)} el ${getFechaYHora(fechaPublicacion)}.`).then((res) => {
                        if (res.isDenied) eliminacion()
                    })
                }
                function eliminacion() {
                    alertEliminacion('cápsula informativa', <>la cápsula <b>{titulo}</b></>).then((res) => {
                        if (res.isConfirmed) eliminarCapsula(id)
                        if (res.isDismissed) consulta()
                    })
                }
                consulta()
            } else mostrarMensaje('Error al obtener los datos de la cápsula', res.mensajeGeneral, 'error')
        }).catch((error) => mostrarMensaje('Error de conexión', 'No fue posible establecer conexión con el servidor.', 'error'))
    }

    return (
        <Card className='shadow mx-auto'>
            <Card.Header className='bg-azul-dark text-white'>
                <Row className='gy-2 gy-md-0'>
                    <Col>
                        <Card.Title style={{ paddingBlock: '0.5rem' }} className='m-0'>Cápsulas informativas</Card.Title>
                    </Col>
                    <Col md='auto'>
                        <InputGroup>
                            <FormControl
                                ref={txtFiltro}
                                placeholder='Título'
                            />
                            <Button onClick={buscar} variant='verde'><Icon.Search /></Button>
                        </InputGroup>
                    </Col>
                </Row>
            </Card.Header>
            <Card.Body>
                <TablaInfinita onClickElemento={consultarCapsula} contenido={capsulas} setContenido={setCapsulas} filtro={filtro} numerada columnas={columnas} fuenteContenido={Conexion.CapsulasAdministrador.obtenerCapsulas} />
            </Card.Body>
        </Card>

    )
}
