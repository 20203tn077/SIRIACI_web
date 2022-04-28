import React, { useContext, useEffect, useRef, useState } from 'react'
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import AutenticacionContext from '../components/autenticacion/AutenticacionContext'
import { Seleccionables, UsuariosGeneral } from '../utils/Conexion'
import Input, {  Select } from '../utils/Input'
import { ValidacionesUsuario } from '../utils/Validador'
import * as Icon from 'react-feather'
import Alert, { alertConexion, alertConfirmacion, alertError, alertExito } from '../utils/Alert'
import { useNavigate } from 'react-router-dom'

export default function ModificarDatos() {
    const navigate = useNavigate()
    const [errores, setErrores] = useState({})
    const [carreras, setCarreras] = useState([])
    const { dispatch } = useContext(AutenticacionContext)
    const [datosUsuario, setDatosUsuario] = useState({})
    const [datosOriginales, setDatosOriginales] = useState({})
    const [carrerasFiltradas, setCarrerasFiltradas] = useState([])
    const txtNombre = useRef()
    const txtApellido1 = useRef()
    const txtApellido2 = useRef()
    const txtTelefono = useRef()
    const txtContrasena = useRef()
    const txtContrasena2 = useRef()
    const txtDivision = useRef()
    const txtCarrera = useRef()
    const txtCuatrimestre = useRef()
    const txtGrupo = useRef()
    const contenedorDivision = useRef()
    const contenedorCarrera = useRef()
    const contenedorCuatrimestre = useRef()
    const contenedorGrupo = useRef()
    useEffect(() => {
        (async () => {
            let res = await Seleccionables.obtenerCarreras(dispatch)
            if (!res.error) setCarreras(res.datos)
        })()
        UsuariosGeneral.obtenerPerfil(dispatch).then((res) => {
            if (!res.error) {
                const { id: temp_id, correo: temp_correo, nombre: temp_nombre, apellido1: temp_apellido1, apellido2: temp_apellido2, telefono: temp_telefono, estudiante: temp_estudiante, administrador: temp_administrador, responsable: temp_responsable } = res.datos
                let datosTemp = {
                    id: temp_id,
                    correo: temp_correo,
                    utez: ValidacionesUsuario.isCorreoInstitucional(temp_correo),
                    nombre: temp_nombre,
                    apellido1: temp_apellido1,
                    apellido2: temp_apellido2,
                    telefono: temp_telefono,
                    estudiante: temp_estudiante,
                    administrador: temp_administrador,
                    responsable: temp_responsable,
                }
                if (temp_estudiante) {
                    const { estudiante: { carrera: { id: temp_carrera, }, cuatrimestre: temp_cuatrimestre, grupo: temp_grupo } } = res.datos
                    datosTemp = {
                        ...datosTemp,
                        carrera: temp_carrera,
                        cuatrimestre: temp_cuatrimestre,
                        grupo: temp_grupo,
                    }
                }
                if (temp_responsable) {
                    const { responsable: { aspecto: { id: temp_aspecto } } } = res.datos
                    datosTemp = {
                        ...datosTemp,
                        aspecto: temp_aspecto
                    }
                }
                setDatosOriginales(datosTemp)
                setDatosUsuario({...datosTemp})
                Alert.close()

            } else alertError(res, 'Error al obtener los datos del usuario')
        }).catch(alertConexion)
    }, [])

    function comprobarDivision() {
        guardar()
        const objetos = carreras.find((division) => division.id === datosUsuario.division)
        setCarrerasFiltradas(objetos ? objetos.carreras : [])
        txtCarrera.current.value = ''
    }

    function guardar() {
        datosUsuario.nombre = txtNombre.current.value
        datosUsuario.apellido1 = txtApellido1.current.value
        datosUsuario.apellido2 = txtApellido2.current.value
        datosUsuario.telefono = txtTelefono.current.value
        datosUsuario.contrasena = txtContrasena.current.value
        datosUsuario.contrasena2 = txtContrasena2.current.value
        datosUsuario.division = txtDivision.current.value
        datosUsuario.carrera = txtCarrera.current.value ? txtCarrera.current.value : datosOriginales.carrera
        datosUsuario.cuatrimestre = txtCuatrimestre.current.value
        datosUsuario.grupo = txtGrupo.current.value.toUpperCase()
    }

    function registro() {
        let erroresTemp = {}
        let numErrores = 0
        let numErroresEstudiante = 0
        let numErroresResponsable = 0
        let error
        guardar()

        error = ValidacionesUsuario.validarNombre(datosUsuario.nombre)
        if (error) {
            erroresTemp.nombre = error
            numErrores++
        }
        error = ValidacionesUsuario.validarApellido1(datosUsuario.apellido1)
        if (error) {
            erroresTemp.apellido1 = error
            numErrores++
        }
        error = ValidacionesUsuario.validarApellido2(datosUsuario.apellido2)
        if (error) {
            erroresTemp.apellido2 = error
            numErrores++
        }
        error = ValidacionesUsuario.validarTelefono(datosUsuario.telefono)
        if (error) {
            erroresTemp.telefono = error
            numErrores++
        }
        if (datosUsuario.contrasena) {
            error = ValidacionesUsuario.validarContrasena(datosUsuario.contrasena)
            if (error) {
                erroresTemp.contrasena = error
                numErrores++
            }
            error = ValidacionesUsuario.validarConfirmacionContrasena(datosUsuario.contrasena, datosUsuario.contrasena2)
            if (error) {
                erroresTemp.contrasena2 = error
                numErrores++
            }
        }
        error = !datosUsuario.carrera ? 'Debes seleccionar una carrera.' : null
        if (error) {
            erroresTemp.carrera = error
            numErroresEstudiante++
        }
        error = ValidacionesUsuario.validarCuatrimestre(datosUsuario.cuatrimestre)
        if (error) {
            erroresTemp.cuatrimestre = error
            numErroresEstudiante++
        }
        error = ValidacionesUsuario.validarGrupo(datosUsuario.grupo)
        if (error) {
            erroresTemp.grupo = error
            numErroresEstudiante++
        }
        error = !datosUsuario.aspecto ? 'Debes seleccionar un aspecto ambiental.' : null
        if (error) {
            erroresTemp.aspecto = error
            numErroresResponsable++
        }

        setErrores(erroresTemp)

        if (numErrores === 0 && (!datosUsuario.estudiante || numErroresEstudiante === 0) && (!datosUsuario.responsable || numErroresResponsable === 0)) {
            const nuevosDatos = {}
            if (datosUsuario.nombre !== datosOriginales.nombre) nuevosDatos.nombre = datosUsuario.nombre
            if (datosUsuario.apellido1 !== datosOriginales.apellido1) nuevosDatos.apellido1 = datosUsuario.apellido1
            if (datosUsuario.apellido2 !== datosOriginales.apellido2) nuevosDatos.apellido2 = datosUsuario.apellido2
            if (datosUsuario.telefono !== datosOriginales.telefono) nuevosDatos.telefono = datosUsuario.telefono
            if (datosUsuario.contrasena) {
                if (datosUsuario.contrasena !== datosOriginales.contrasena) nuevosDatos.contrasena = datosUsuario.contrasena
            }
            if (datosUsuario.estudiante) {
                if (datosUsuario.carrera !== datosOriginales.carrera) nuevosDatos.carrera = datosUsuario.carrera
                if (datosUsuario.cuatrimestre !== datosOriginales.cuatrimestre) nuevosDatos.cuatrimestre = datosUsuario.cuatrimestre
                if (datosUsuario.grupo !== datosOriginales.grupo) nuevosDatos.grupo = datosUsuario.grupo
            }
            if (datosUsuario.responsable) {
                if (datosUsuario.aspecto !== datosOriginales.aspecto) nuevosDatos.aspecto = datosUsuario.aspecto
            }
            if (datosUsuario.responsable !== datosOriginales.responsable) nuevosDatos.responsable = datosUsuario.responsable
            if (datosUsuario.administrador !== datosOriginales.administrador) nuevosDatos.administrador = datosUsuario.administrador
            UsuariosGeneral.automodificacion(dispatch, nuevosDatos).then((res) => {
                if (!res.error) {
                    alertExito(res).then((res) => {
                        if (res.isConfirmed) navigate('/perfil')
                    })
                } else alertError(res, 'Error al modificar los datos del usuario.')
            }).catch(alertConexion)
        }
    }

    function cancelacion() {
        alertConfirmacion('Cancelar modificación', '¿Deseas salir? Se perderán los cambios realizados.', 'warning').then((res) => {
            if (res.isConfirmed) navigate('/perfil')
        })
    }

    return (
        <Container className='mt-md-4 mt-3'>
            <Card className='shadow mx-auto'>
                <Card.Header className='bg-azul-dark text-white'>
                    <Card.Title style={{ paddingBlock: '0.5rem' }} className='m-0'>Modificar datos personales</Card.Title>
                </Card.Header>
                <Form noValidate onSubmit={(event) => {
                    event.preventDefault()
                    registro()
                }}>
                    <Card.Body>
                        <Row className='text-start w-100 m-0 g-3' style={{ color: '#545454', fontSize: 18 }}>
                            <Col xs='12' md='6'>
                                <Input
                                    nombre='Nombre(s)'
                                    obligatorio
                                    referencia={txtNombre}
                                    error={errores.nombre}
                                    valorInicial={datosUsuario.nombre}
                                />
                            </Col>
                            <Col xs='12' md='6'>
                                <Input
                                    nombre='Primer apellido'
                                    obligatorio
                                    referencia={txtApellido1}
                                    error={errores.apellido1}
                                    valorInicial={datosUsuario.apellido1}
                                />
                            </Col>
                            <Col xs='12' md='6'>
                                <Input
                                    nombre='Segundo apellido'
                                    referencia={txtApellido2}
                                    error={errores.apellido2}
                                    valorInicial={datosUsuario.apellido2}
                                />
                            </Col>
                            <Col xs='12' md='6'>
                                <Input
                                    nombre='Telefono'
                                    obligatorio
                                    referencia={txtTelefono}
                                    error={errores.telefono}
                                    valorInicial={datosUsuario.telefono}
                                    tipo='tel'
                                />
                            </Col>
                            <Col xs='12' md='6'>
                                <Input
                                    nombre='Contraseña'
                                    referencia={txtContrasena}
                                    error={errores.contrasena}
                                    valorInicial={datosUsuario.contrasena}
                                    tipo='password'
                                />
                            </Col>
                            <Col xs='12' md='6'>
                                <Input
                                    nombre='Confirmar contraseña'
                                    referencia={txtContrasena2}
                                    error={errores.contrasena2}
                                    valorInicial={datosUsuario.contrasena2}
                                    tipo='password'
                                />
                            </Col>
                            <Col xs='12' md='6' ref={contenedorDivision} style={{ display: datosUsuario.estudiante ? 'block' : 'none' }}>
                                <Select
                                    nombre='División académica'
                                    obligatorio
                                    referencia={txtDivision}
                                    error={errores.division}
                                    opciones={carreras}
                                    valorInicial={datosUsuario.division}
                                    eventoChange={comprobarDivision}
                                />
                            </Col>
                            <Col xs='12' md='6' ref={contenedorCarrera} style={{ display: datosUsuario.estudiante ? 'block' : 'none' }}>
                                <Select
                                    nombre='Carrera'
                                    obligatorio
                                    referencia={txtCarrera}
                                    error={errores.carrera}
                                    opciones={carrerasFiltradas}
                                    valorInicial={datosUsuario.carrera}
                                />
                            </Col>
                            <Col xs='12' md='6' ref={contenedorCuatrimestre} style={{ display: datosUsuario.estudiante ? 'block' : 'none' }}>
                                <Input
                                    nombre='Cuatrimestre'
                                    obligatorio
                                    referencia={txtCuatrimestre}
                                    error={errores.cuatrimestre}
                                    valorInicial={datosUsuario.cuatrimestre}
                                    tipo='number'
                                    min='1'
                                    max='11'
                                />
                            </Col>
                            <Col xs='12' md='6' ref={contenedorGrupo} style={{ display: datosUsuario.estudiante ? 'block' : 'none' }}>
                                <Input
                                    nombre='Grupo'
                                    obligatorio
                                    referencia={txtGrupo}
                                    error={errores.grupo}
                                    valorInicial={datosUsuario.grupo}
                                    maxlength='1'
                                />
                            </Col>
                        </Row>
                    </Card.Body>
                    <Card.Footer className='pb-3'>
                        <Row className='text-start w-100 m-0 g-3'>
                            <Col xs='auto' >
                                <Button variant='azul-light' type='submit'><Icon.Check size={20} className='me-2' /><span className='align-middle'>Guardar</span></Button>
                            </Col>
                            <Col xs='auto' >
                                <Button onClick={cancelacion} variant='secondary' type='button'><Icon.X strokeWidth={1.7} className='me-1' /><span className='align-middle'>Cancelar</span></Button>
                            </Col>
                        </Row>
                    </Card.Footer>
                </Form>
            </Card>

        </Container>
    )
}
