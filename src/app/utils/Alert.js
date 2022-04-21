import { Col, Form, Image as ImageB, Row } from 'react-bootstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Informacion from './Informacion'
import Tema from './Tema'
import * as Icon from 'react-feather'
import { TextArea } from './Input'

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
        cancelButtonText: <><Icon.X /><span className='align-middle'> Cerrar</span></>,
        confirmButtonText: botonModificar ? <>{botonModificar.icono}<span className='align-middle'> {botonModificar.texto}</span></> : <><Icon.Edit /><span className='align-middle'> Modificar</span></>,
        denyButtonText: <><Icon.EyeOff /><span className='align-middle'> Desactivar</span></>,
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
        confirmButtonColor: Tema.azulLight
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
        title: `Desactivar ${tipo}`,
        html: <>¿Estás seguro de desactivar {elemento}? Esta acción <b>no se puede deshacer</b>.</>,
        icon: 'warning',
        allowEnterKey: false,
        confirmButtonColor: '#dc3741',
        showCancelButton: true,
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
                    <Form.Label className='text-dark w-100 textoSalto'>{contenido}</Form.Label>
                </Col>
                {imagenesCapsula.map((imagen, index) => (
                    <Col xs={12} key={index}>
                        <ImageB className='img-fluid rounded' src={`data:image/png;base64,${imagen.imagen}`} />
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

export function alertExito(res, texto) {
    return mostrarMensaje(res.mensajeGeneral, texto, 'success')
}
export function alertError(res, texto) {
    return mostrarMensaje(texto ? texto : 'No se pudo completar la acción', res.mensajeGeneral, 'error')
}
export function alertConexion() {
    return mostrarMensaje('Error de conexión', 'No fue posible establecer conexión con el servidor.', 'error')
}
export function alertImagen(imagen, post, pre) {
    const objImagen = new Image()
    objImagen.src = imagen
    objImagen.onload = () => {
        if (pre) pre()
        withReactContent(Swal).fire({
            width: objImagen.width + 64,
            html: <ImageB src={imagen} fluid />,
            cancelButtonText: <><Icon.X /><span className='align-middle'> Cerrar</span></>,
            showCancelButton: true,
            showConfirmButton: false,
            allowEnterKey: true
        }).then((res) => {
            if ((res.isConfirmed || res.isDismissed) && post) post()
        })
    }
}