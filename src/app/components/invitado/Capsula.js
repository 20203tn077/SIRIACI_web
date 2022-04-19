import React, { useContext } from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap'
import { mostrarCapsula, mostrarMensaje } from '../../utils/Alert'
import { Conexion } from '../../utils/Conexion'
import { getFecha } from '../../utils/Formateador'
import AutenticacionContext from '../autenticacion/AutenticacionContext'

export default function Capsula({ datos: { id, titulo, imagenCapsula, contenido } }) {
    const { dispatch } = useContext(AutenticacionContext)
    function abrirCapsula() {
        Conexion.CapsulasPublico.obtenerCapsula(dispatch, id).then((res) => {
            if (!res.error) {
                const { titulo, fechaPublicacion, contenido, imagenesCapsula } = res.datos
                mostrarCapsula(titulo, getFecha(fechaPublicacion), contenido, imagenesCapsula)
            } else mostrarMensaje('Error al obtener los registros', res.mensajeGeneral, 'error')
        }).catch((error) => mostrarMensaje('Error de conexión', 'No fue posible establecer conexión con el servidor.', 'error'))
    }
    return (
        <Col xs={12}>
            <Card style={{ maxWidth: 640, borderRadius: 15 }} className='shadow mx-auto'>
                <Row className='g-0'>
                    <Col>
                        <Card.Body style={{ textAlign: 'center' }}>
                            <Card.Title>{titulo}</Card.Title>
                            <Card.Text>
                                {contenido}
                            </Card.Text>
                            <Button onClick={abrirCapsula} variant='verde'>Ver más</Button>
                        </Card.Body>
                    </Col>
                    {
                        imagenCapsula ?
                            <Col xs={5}>
                                <Card.Img style={{ height: 250, objectFit: 'cover', borderBottomRightRadius: 15, borderTopRightRadius: 15 }} variant='top' src={`data:image/png;base64,${imagenCapsula}`} />
                            </Col>
                            : null
                    }
                </Row>
            </Card>
        </Col>
    )
}