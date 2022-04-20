import { Col, Form, Image, Row } from 'react-bootstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Informacion from './Informacion'
import Tema from './Tema'
import * as Icon from 'react-feather'

const Alert = withReactContent(Swal)
export default Alert

export function mostrarMensaje(titulo, texto, icono) {
    return Alert.fire({
        title: titulo,
        text: texto,
        icon: icono,
        confirmButtonColor: Tema.verde,
    })
}

// 4853BM

export function alertConsulta(datos, showModificar, showEliminar, titulo, subtitulo, botonModificar) {
    return Alert.fire({
        allowEnterKey: false,
        showCancelButton: true,
        showConfirmButton: showModificar,
        showDenyButton: showEliminar,
        cancelButtonText: <><Icon.X/><span className='align-middle'> Cerrar</span></>,
        confirmButtonText: botonModificar ? <>{botonModificar.icono}<span className='align-middle'> {botonModificar.texto}</span></> : <><Icon.Edit/><span className='align-middle'> Modificar</span></>,
        denyButtonText: <><Icon.Trash2/><span className='align-middle'> Eliminar</span></>,
        title: titulo,
        width: 800,
        html: (
            <>
                {subtitulo ?
                    <Row className='text-start w-100 m-0'>
                        <Col xs='12'>
                            <p className='fs-6 text-muted'>{subtitulo}</p>
                        </Col>
                    </Row>
                    :
                    null
                }
                <Row className='text-start w-100 m-0'>
                    <Col><hr className='my-0' /></Col>
                </Row>
                <Row className='text-start w-100 m-0 g-3'>
                    {datos.map((campo, index) => (
                        <Col key={index} xs='12' md={campo.doble ? 12 : 6}>
                            <Informacion nombre={campo.nombre} valor={campo.valor} />
                        </Col>
                    ))}

                </Row>
                <Row className='text-start w-100 mx-0 mt-2 mb-0'>
                    <Col><hr className='my-0' /></Col>
                </Row>
            </>
        ),
        confirmButtonColor: Tema.azul
    })
}

export function alertModificacion(titulo, texto, icono) {
    Alert.fire({
        title: titulo,
        text: texto,
        icon: icono,
        confirmButtonColor: Tema.verde,
    })
}

export function alertConfirmacion(titulo, texto, icono) {
    return Alert.fire({
        title: titulo,
        text: texto,
        icon: icono,
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: Tema.verde,
    })
}

export function alertEliminacion(tipo, elemento) {
    return Alert.fire({
        title: `Eliminar ${tipo}`,
        html: <>¿Estás seguro de eliminar {elemento}? Esta acción no se puede deshacer.</>,
        icon: 'warning',
        allowEnterKey: false,
        confirmButtonColor: '#dc3741',
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar'
    })
}

export function mostrarCapsula(titulo, fechaPublicacion, contenido, imagenesCapsula) {
    Alert.fire({
        title: titulo,
        width: 800,
        html: (
            <Row className='text-start w-100 m-0 g-3'>
                <Col xs='12' className='m-0'>
                    <p className='fs-6 text-muted'>Publicado el {fechaPublicacion}</p>
                    <hr />
                </Col>
                <Col xs='12' className='m-0'>
                    <p className='m-0'>{contenido}</p>
                </Col>
                {imagenesCapsula.map((imagen, index) => (
                    <Col xs={12} key={index}>
                        <Image className='img-fluid rounded' src={`data:image/png;base64,${imagen.imagen}`} />
                    </Col>
                ))}
            </Row>
        ),
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: 'Cerrar'
    })
}

export function mostrarLoader() {
    Alert.fire({
        title: 'Cargando...',
        width: 250,
        allowEscapeKey: false,
        allowOutsideClick: false,
        didOpen: () => {
            Alert.showLoading()
        }
    })
}

export function seleccionarRol(dispatch, navigate, primeraVez) {
    Alert.fire({
        backdrop: true,
        allowEnterKey: false,
        allowEscapeKey: !primeraVez,
        allowOutsideClick: !primeraVez,
        title: 'Selección de rol',
        text: 'Selecciona un rol para mostrar las funciones disponibles:',
        showConfirmButton: true,
        showDenyButton: true,
        confirmButtonColor: Tema.verde,
        denyButtonColor: Tema.verde,
        confirmButtonText: 'Administrador',
        denyButtonText: 'Responsable de aspecto'
    }).then((res) => {
        if (res.isConfirmed) dispatch({
            tipo: 'SELECCIONAR ROL',
            datos: { rolActivo: 'ROLE_ADMINISTRADOR' }
        })
        if (res.isDenied) dispatch({
            tipo: 'SELECCIONAR ROL',
            datos: { rolActivo: 'ROLE_RESPONSABLE' }
        })
        if (navigate) navigate('/')
    })
}