import React, { useContext, useEffect, useState } from 'react'
import { Badge, Button, Card, Col, Container, Image, Row } from 'react-bootstrap'
import AutenticacionContext from '../components/autenticacion/AutenticacionContext'
import Alert, { alertConexion, alertError } from '../utils/Alert'
import { UsuariosGeneral } from '../utils/Conexion'
import Informacion from '../utils/Informacion'
import fotoPerfil from '../../assets/img/perfil.png'
import { getNombreCompleto } from '../utils/Formateador'
import { useNavigate } from 'react-router-dom'
import * as Icon from 'react-feather'

export default function Perfil() {
    const navigate = useNavigate()
    const { dispatch } = useContext(AutenticacionContext)
    const [datosUsuario, setDatosUsuario] = useState([])
    useEffect(() => {
        UsuariosGeneral.obtenerPerfil(dispatch).then((res) => {
            if (!res.error) {
                const { correo, telefono, comunidadUtez, estudiante, responsable, administrador } = res.datos

                let datos = [
                    {
                        nombre: 'Nombre',
                        valor: getNombreCompleto(res.datos)
                    },
                    {
                        nombre: 'Correo electrónico',
                        valor: correo
                    },
                    {
                        nombre: 'Teléfono',
                        valor: telefono
                    }
                ]

                let roles = [comunidadUtez ? 'Comunidad UTEZ' : 'Comunidad externa']
                if (estudiante) {
                    roles.push('Estudiante')
                    const { cuatrimestre, grupo, carrera: { nombre: carrera } } = estudiante
                    datos = [
                        ...datos,
                        {
                            nombre: 'Grupo',
                            valor: `${cuatrimestre}º ${grupo}`
                        },
                        {
                            nombre: 'Carrera',
                            valor: carrera
                        }
                    ]
                }
                if (responsable) {
                    roles.push('Responsable de aspecto')
                    const { aspecto: { nombre: aspecto } } = responsable
                    datos = [
                        ...datos,
                        {
                            nombre: 'Aspecto ambiental',
                            valor: aspecto
                        }
                    ]
                }
                if (administrador) roles.push('Administrador')
                datos = [
                    ...datos,
                    {
                        nombre: 'Roles',
                        valor: (
                            <Row className='g-2'>
                                {roles.map((rol, index) => (
                                    <Col xs='auto' key={index}>
                                        <Badge bg='verde'>{rol}</Badge>
                                    </Col>
                                ))}
                            </Row>
                        )
                    }
                ]
                setDatosUsuario(datos)
                Alert.close()
            } else alertError(res, 'Error al obtener los datos del usuario')
        }).catch(alertConexion)
    }, [])
    return (
        <Container className='mt-md-4 mt-3'>
            <Card className='shadow mx-auto'>
                <Card.Header className='bg-azul-dark text-white'>
                    <Card.Title style={{ paddingBlock: '0.5rem' }} className='m-0'>Mi perfil</Card.Title>
                </Card.Header>
                <Card.Body>
                    <Row className='text-start w-100 m-0 g-3' style={{ color: '#545454', fontSize: 18 }}>
                        <Col xs='12' md='6'>
                            <Image thumbnail src={fotoPerfil} width={200} height={200} />
                        </Col>
                        {datosUsuario.map((campo, index) => (
                            <Col key={index} xs='12' md={campo.doble ? 12 : 6}>
                                <Informacion nombre={campo.nombre} valor={campo.valor} />
                            </Col>
                        ))}

                    </Row>
                </Card.Body>
                <Card.Footer className='pb-3'>
                    <Button onClick={() => navigate('/perfil/modificar')} variant='azul-light' type='button'><Icon.Edit size={20} className='me-2' /><span className='align-middle'>Modificar</span></Button>
                </Card.Footer>
            </Card>

        </Container>
    )
}
