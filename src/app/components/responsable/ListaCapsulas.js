import React, { useContext, useRef, useState } from 'react'
import { Badge, Button, Card, Col, Form, FormControl, Image, InputGroup, Nav, Row } from 'react-bootstrap'
import TablaInfinita from '../../utils/TablaInfinita'
import * as Icon from 'react-feather'
import AutenticacionContext from '../autenticacion/AutenticacionContext'
import { getFecha, getFechaYHora, getNombreCompleto, getTexto, toBase64 } from '../../utils/Formateador'
import Alert, { alertConexion, alertConfirmacion, alertConsulta, alertEliminacion, alertError, alertExito, mostrarMensaje } from '../../utils/Alert'
import { CapsulasResponsable } from '../../utils/Conexion'
import Input, { InputImg, TextArea } from '../../utils/Input'
import { ValidacionesCapsula } from '../../utils/Validador'
import Tema from '../../utils/Tema'
import * as ReactDOM from 'react-dom/client'
import { ListaImagenes } from '../../utils/Informacion'

export default function ListaCapsulas() {
    const { dispatch } = useContext(AutenticacionContext)
    const [filtro, setFiltro] = useState(null)
    const [capsulas, setCapsulas] = useState([])
    const [keyLista, setKeyLista] = useState(true)
    const txtFiltro = useRef()
    const btnAgregar = useRef()
    const txtTitulo = useRef()
    const txtContenido = useRef()
    const txtImagenesCapsula = useRef()
    const contenedorImagenes = useRef()

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

    function registrarCapsula(capsula) {
        CapsulasResponsable.registrarCapsula(dispatch, capsula).then((res) => {
            if (!res.error) {
                setKeyLista(!keyLista)
                alertExito(res)
            }
            else alertError(res)
        }).catch(alertConexion)
    }

    function formularioRegistro(datosCapsula, errores) {
        if (!datosCapsula) datosCapsula = { imagenesCapsula: [] }
        if (!errores) errores = {}
        let imagenesDOM

        function eliminarImagen(indice) {
            datosCapsula.imagenesCapsula.splice(indice, 1)
            try {
                imagenesDOM.unmount()
            } catch (error) { }
            imagenesDOM = ReactDOM.createRoot(contenedorImagenes.current)
            imagenesDOM.render(
                <InputImg
                    nombre='Imagenes'
                    multiple
                    referencia={txtImagenesCapsula}
                    eventoSubida={guardarImagenes}
                    error={errores.imagenesCapsula}
                    imagenes={datosCapsula.imagenesCapsula}
                    eventoEliminar={eliminarImagen}
                />
            )
        }

        async function guardarImagenes() {
            let erroresSize = 0
            for (let imagen of txtImagenesCapsula.current.files) {
                if (imagen.size > 10485760) erroresSize++
                else {
                    datosCapsula.imagenesCapsula = [...datosCapsula.imagenesCapsula, { imagen: (await toBase64(imagen)).toString().replace(/^data:(.*,)?/, '') }]
                }
            }
            errores.imagenesCapsula = erroresSize > 0 ? 'Algunas imágenes no pudieron ser subidas (tamaño máximo 10 MB).' : null
            try {
                imagenesDOM.unmount()
            } catch (error) { }
            imagenesDOM = ReactDOM.createRoot(contenedorImagenes.current)
            imagenesDOM.render(
                <InputImg
                    nombre='Imagenes'
                    multiple
                    referencia={txtImagenesCapsula}
                    eventoSubida={guardarImagenes}
                    error={errores.imagenesCapsula}
                    imagenes={datosCapsula.imagenesCapsula}
                    eventoEliminar={eliminarImagen}
                />
            )
            errores.imagenesCapsula = null
        }

        function guardar() {
            datosCapsula.titulo = txtTitulo.current.value
            datosCapsula.contenido = txtContenido.current.value
        }

        function registro() {
            errores = {}
            let numErrores = 0
            let error
            guardar()

            error = ValidacionesCapsula.validarTitulo(datosCapsula.titulo)
            if (error) {
                errores.titulo = error
                numErrores++
            }
            error = ValidacionesCapsula.validarContenido(datosCapsula.contenido)
            if (error) {
                errores.contenido = error
                numErrores++
            }
            if (numErrores == 0) registrarCapsula(datosCapsula)
            else formulario()
        }

        function cancelacion() {
            guardar()
            alertConfirmacion('Cancelar registro', '¿Deseas salir? Se perderá la información ingresada.', 'warning').then((res) => {
                if (res.isDismissed) formulario()
            })
        }

        function formulario() {
            Alert.fire({
                html: (
                    <>
                        <Row className='text-start w-100 m-0'>
                            <Col><hr className='my-0' /></Col>
                        </Row>
                        <Row className='text-start w-100 m-0 g-3'>
                            <Col xs='12' md='6'>
                                <Input
                                    nombre='Título'
                                    obligatorio
                                    referencia={txtTitulo}
                                    error={errores.titulo}
                                    valorInicial={datosCapsula.titulo}
                                />
                            </Col>
                            <Col xs='12'>
                                <TextArea
                                    nombre='Contenido'
                                    rows='6'
                                    obligatorio
                                    referencia={txtContenido}
                                    error={errores.contenido}
                                    valorInicial={datosCapsula.contenido}
                                />
                            </Col>
                            <Col xs='12' ref={contenedorImagenes}>
                                <InputImg
                                    nombre='Imagenes'
                                    multiple
                                    referencia={txtImagenesCapsula}
                                    eventoSubida={guardarImagenes}
                                    error={errores.imagenesCapsula}
                                    imagenes={datosCapsula.imagenesCapsula}
                                    eventoEliminar={eliminarImagen}
                                />
                            </Col>
                        </Row>
                        <Row className='text-start w-100 mx-0 mt-2 mb-0'>
                            <Col><hr className='my-0' /></Col>
                        </Row>
                    </>
                ),
                allowEnterKey: true,
                showCancelButton: true,
                showConfirmButton: true,
                showDenyButton: false,
                cancelButtonText: <><Icon.X strokeWidth={1.7} className='me-1' /><span className='align-middle'>Cancelar</span></>,
                confirmButtonText: <><Icon.Check size={20} className='me-2' /><span className='align-middle'>Registrar</span></>,
                title: 'Nueva cápsula informativa',
                width: 800,
                confirmButtonColor: Tema.azul
            }).then((res) => {
                if (res.isConfirmed) registro()
                if (res.isDismissed) cancelacion()
            })
        }
        formulario()
    }

    function eliminarCapsula(id) {
        CapsulasResponsable.eliminarCapsula(dispatch, id).then((res) => {
            if (!res.error) {
                const capsulasActualizado = capsulas.map((capsula) => {
                    if (capsula.id === id) return { ...capsula, activo: false }
                    else return capsula
                })
                setCapsulas(capsulasActualizado)
                alertExito(res)
            } else alertError(res)
        }).catch(alertConexion)
    }

    function consultarCapsula(id) {
        CapsulasResponsable.obtenerCapsula(dispatch, id).then((res) => {
            if (!res.error) {
                const { titulo, fechaPublicacion, contenido, activo, imagenesCapsula } = res.datos
                let datos = [
                    {
                        nombre: 'Contenido',
                        doble: true,
                        valor: <span className='textoSalto'>{contenido}</span>
                    }                    
                ]
                if (imagenesCapsula.length > 0) datos.push({
                    nombre: 'Imagenes',
                    doble: true,
                    valor: <ListaImagenes eventoPostImagen={consulta} imagenes={imagenesCapsula} />
                })
                datos = [
                    ...datos,
                    {
                        nombre: 'Estado',
                        valor: activo ? <Badge bg='success'>Activo</Badge> : <Badge bg='secondary'>Inactivo</Badge>
                    }
                ]
                function consulta() {
                    alertConsulta(datos, activo, activo, titulo, `Publicado por ${getNombreCompleto(res.datos.usuario)} el ${getFechaYHora(fechaPublicacion)}.`).then((res) => {
                        if (res.isDenied) eliminacion()
                        if (res.isConfirmed) modificarCapsula()
                    })
                }
                function eliminacion() {
                    alertEliminacion('cápsula informativa', <>la cápsula <b>{titulo}</b></>).then((res) => {
                        if (res.isConfirmed) eliminarCapsula(id)
                        if (res.isDismissed) consulta()
                    })
                }
                consulta()

                function modificarCapsula() {
                    const datosOriginales = { imagenesCapsula: [], ...res.datos}
                    const datosCapsula = {...datosOriginales}
                    const imagenesEliminar = []
                    let errores = {}
                    let imagenesDOM
        
                    function eliminarImagen(indice) {
                        let imgEliminar = imagenesCapsula[indice]
                        if (imgEliminar.id) imagenesEliminar.push({id: imgEliminar.id})
                        datosCapsula.imagenesCapsula.splice(indice, 1)
                        try {
                            imagenesDOM.unmount()
                        } catch (error) { }
                        imagenesDOM = ReactDOM.createRoot(contenedorImagenes.current)
                        imagenesDOM.render(
                            <InputImg
                                nombre='Imagenes'
                                multiple
                                referencia={txtImagenesCapsula}
                                eventoSubida={guardarImagenes}
                                error={errores.imagenesCapsula}
                                imagenes={datosCapsula.imagenesCapsula}
                                eventoEliminar={eliminarImagen}
                            />
                        )
                    }
        
                    async function guardarImagenes() {
                        let erroresSize = 0
                        for (let imagen of txtImagenesCapsula.current.files) {
                            if (imagen.size > 10485760) erroresSize++
                            else {
                                datosCapsula.imagenesCapsula = [...datosCapsula.imagenesCapsula, { imagen: (await toBase64(imagen)).toString().replace(/^data:(.*,)?/, '') }]
                            }
                        }
                        errores.imagenesCapsula = erroresSize > 0 ? 'Algunas imágenes no pudieron ser subidas (tamaño máximo 10 MB).' : null
                        try {
                            imagenesDOM.unmount()
                        } catch (error) { }
                        imagenesDOM = ReactDOM.createRoot(contenedorImagenes.current)
                        imagenesDOM.render(
                            <InputImg
                                nombre='Imagenes'
                                multiple
                                referencia={txtImagenesCapsula}
                                eventoSubida={guardarImagenes}
                                error={errores.imagenesCapsula}
                                imagenes={datosCapsula.imagenesCapsula}
                                eventoEliminar={eliminarImagen}
                            />
                        )
                        errores.imagenesCapsula = null
                    }
        
                    function guardar() {
                        datosCapsula.titulo = txtTitulo.current.value
                        datosCapsula.contenido = txtContenido.current.value
                    }
        
                    function registro() {
                        errores = {}
                        let numErrores = 0
                        let error
                        guardar()
        
                        error = ValidacionesCapsula.validarTitulo(datosCapsula.titulo)
                        if (error) {
                            errores.titulo = error
                            numErrores++
                        }
                        error = ValidacionesCapsula.validarContenido(datosCapsula.contenido)
                        if (error) {
                            errores.contenido = error
                            numErrores++
                        }
                        if (numErrores == 0) {
                            const nuevosDatos = {}
                            if (datosCapsula.titulo != datosOriginales.titulo) nuevosDatos.titulo = datosCapsula.titulo
                            if (datosCapsula.contenido != datosOriginales.contenido) nuevosDatos.contenido = datosCapsula.contenido
                            nuevosDatos.imagenesCapsula = [...datosCapsula.imagenesCapsula.filter((imagen => !imagen.id)), ...imagenesEliminar]

                            CapsulasResponsable.modificarCapsula(dispatch, id, nuevosDatos).then((res) => {
                                if (!res.error) {
                                    if (nuevosDatos.titulo) {
                                        const capsulasActualizado = capsulas.map((capsula) => {
                                            if (capsula.id == id) return {...capsula, titulo: nuevosDatos.titulo}
                                            else return capsula
                                        })
                                        setCapsulas(capsulasActualizado)
                                    }
                                    alertExito(res)
                                } else alertError(res, 'Error al modificar los datos de la cápsula.')
                            }).catch(alertConexion)
                        }
                        else formulario()
                    }
        
                    function cancelacion() {
                        guardar()
                        alertConfirmacion('Cancelar modificación', '¿Deseas salir? Se perderán los cambios realizados.', 'warning').then((res) => {
                            if (res.isDismissed) formulario()
                            if (res.isConfirmed) consulta()
                        })
                    }
        
                    function formulario() {
                        Alert.fire({
                            html: (
                                <>
                                    <Row className='text-start w-100 m-0'>
                                        <Col><hr className='my-0' /></Col>
                                    </Row>
                                    <Row className='text-start w-100 m-0 g-3'>
                                        <Col xs='12' md='6'>
                                            <Input
                                                nombre='Título'
                                                obligatorio
                                                referencia={txtTitulo}
                                                error={errores.titulo}
                                                valorInicial={datosCapsula.titulo}
                                            />
                                        </Col>
                                        <Col xs='12'>
                                            <TextArea
                                                nombre='Contenido'
                                                rows='6'
                                                obligatorio
                                                referencia={txtContenido}
                                                error={errores.contenido}
                                                valorInicial={datosCapsula.contenido}
                                            />
                                        </Col>
                                        <Col xs='12' ref={contenedorImagenes}>
                                            <InputImg
                                                nombre='Imagenes'
                                                multiple
                                                referencia={txtImagenesCapsula}
                                                eventoSubida={guardarImagenes}
                                                error={errores.imagenesCapsula}
                                                imagenes={datosCapsula.imagenesCapsula}
                                                eventoEliminar={eliminarImagen}
                                            />
                                        </Col>
                                    </Row>
                                    <Row className='text-start w-100 mx-0 mt-2 mb-0'>
                                        <Col><hr className='my-0' /></Col>
                                    </Row>
                                </>
                            ),
                            allowEnterKey: true,
                            showCancelButton: true,
                            showConfirmButton: true,
                            showDenyButton: false,
                            cancelButtonText: <><Icon.X strokeWidth={1.7} className='me-1' /><span className='align-middle'>Cancelar</span></>,
                            confirmButtonText: <><Icon.Check size={20} className='me-2' /><span className='align-middle'>Registrar</span></>,
                            title: 'Modificar cápsula informativa',
                            width: 800,
                            confirmButtonColor: Tema.azul
                        }).then((res) => {
                            if (res.isConfirmed) registro()
                            if (res.isDismissed) cancelacion()
                        })
                    }
                    formulario()
                }
            } else alertError(res, 'Error al obtener los datos de la cápsula')
        }).catch(alertConexion)
    }

    return (
        <Card className='shadow mx-auto'>
            <Card.Header className='bg-azul-dark text-white'>
                <Row className='gy-2 gy-md-0'>
                    <Col>
                        <Card.Title style={{ paddingBlock: '0.5rem' }} className='m-0'>Cápsulas informativas</Card.Title>
                    </Col>
                    <Col md='auto' className='p-md-0'>
                        <Form noValidate onSubmit={(event) => {
                            event.preventDefault()
                            buscar()
                        }}>
                            <InputGroup>
                                <FormControl
                                    ref={txtFiltro}
                                    placeholder='Título'
                                />
                                <Button onClick={buscar} variant='verde'><Icon.Search /></Button>
                            </InputGroup>
                        </Form>
                    </Col>
                    <Col md='auto'>
                        <Button onClick={() => { formularioRegistro() }} ref={btnAgregar} variant='verde' style={{ height: 40, width: 40, padding: 6, aspectRatio: 1 / 1, borderRadius: '50%' }}><Icon.Plus /></Button>
                    </Col>
                </Row>
            </Card.Header>
            <Card.Body>
                <TablaInfinita key={keyLista} onClickElemento={consultarCapsula} contenido={capsulas} setContenido={setCapsulas} filtro={filtro} numerada columnas={columnas} fuenteContenido={CapsulasResponsable.obtenerCapsulas} />
            </Card.Body>
        </Card>

    )
}
