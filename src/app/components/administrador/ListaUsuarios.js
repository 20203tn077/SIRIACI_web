import React, { useContext, useEffect, useRef, useState } from 'react'
import { Badge, Button, Card, Col, Container, FormControl, InputGroup, Nav, Row } from 'react-bootstrap'
import { Conexion } from '../../utils/Conexion'
import TablaInfinita from '../../utils/TablaInfinita'
import * as Icon from 'react-feather'
import AutenticacionContext from '../autenticacion/AutenticacionContext'
import { getNombreCompleto } from '../../utils/Formateador'
import Alert, { alertConsulta, alertEliminacion, alertRegistrar, mostrarMensaje } from '../../utils/Alert'
import Tema from '../../utils/Tema'
import Input, { Pill, Select } from '../../utils/Input'
import { ValidacionesUsuario } from '../../utils/Validador'
import * as ReactDOM from 'react-dom/client'

export default function ListaUsuarios() {
  const { dispatch } = useContext(AutenticacionContext)
  const [filtro, setFiltro] = useState(null)
  const [usuarios, setUsuarios] = useState([])
  const [carreras, setCarreras] = useState([])
  const [aspectos, setAspectos] = useState([])
  const txtFiltro = useRef()
  const btnAgregar = useRef()

  const txtNombre = useRef()
  const txtApellido1 = useRef()
  const txtApellido2 = useRef()
  const txtCorreo = useRef()
  const txtCorreo2 = useRef()
  const txtTelefono = useRef()
  const txtContrasena = useRef()
  const txtContrasena2 = useRef()
  const txtDivision = useRef()
  const txtCarrera = useRef()
  const txtCuatrimestre = useRef()
  const txtGrupo = useRef()
  const txtAspecto = useRef()
  const txtAdministrador = useRef()
  const txtResponsable = useRef()
  const contenedorDivision = useRef()
  const contenedorCarrera = useRef()
  const contenedorCuatrimestre = useRef()
  const contenedorGrupo = useRef()
  const contenedorAspecto = useRef()
  const contenedorUtez = useRef()
  const contenedorExterna = useRef()
  const contenedorEstudiante = useRef()
  const contenedorAdministrador = useRef()
  const contenedorResponsable = useRef()

  useEffect(() => {
    (async () => {
      let res = await Conexion.Seleccionables.obtenerCarreras()
      if (!res.error) setCarreras(res.datos)
      res = await Conexion.Seleccionables.obtenerAspectos()
      if (!res.error) setAspectos(res.datos)
    })()
  }, [])

  const columnas = [
    {
      nombre: 'Nombre',
      valor: (capsula) => capsula.nombre
    },
    {
      nombre: 'Correo electrónico',
      valor: (capsula) => capsula.correo
    },
    {
      nombre: 'Teléfono',
      valor: (capsula) => capsula.telefono
    },
    {
      nombre: 'Estado',
      valor: (capsula) => capsula.activo ? <Badge bg='success'>Activo</Badge> : <Badge bg='secondary'>Inactivo</Badge>
    },
  ]

  function buscar() {
    setFiltro(txtFiltro.current.value)
  }

  function formularioRegistro() {
    let selectCarreras
    const datosUsuario = {}
    let errores = {}
    let carrerasFiltradas = []

    function setAdministrador() {
      if (datosUsuario.administrador) {
        datosUsuario.administrador = false
        txtAdministrador.current.className = 'badge bg-secondary'
      } else {
        datosUsuario.administrador = true
        txtAdministrador.current.className = 'badge bg-verde'
      }
    }

    function setResponsable() {
      if (datosUsuario.responsable) {
        datosUsuario.responsable = false
        txtResponsable.current.className = 'badge bg-secondary'
        contenedorAspecto.current.style.display = 'none'
      } else {
        datosUsuario.responsable = true
        txtResponsable.current.className = 'badge bg-verde'
        contenedorAspecto.current.style.display = 'block'
      }
    }

    function comprobarDivision() {
      guardar()
      carrerasFiltradas = carreras.find((division) => division.id == datosUsuario.division).carreras

      try {
        selectCarreras.unmount()
      } catch (error) { }
      selectCarreras = ReactDOM.createRoot(txtCarrera.current)
      selectCarreras.render(
        <>
          <option>Selecciona una opción...</option>
          {carrerasFiltradas.map((opcion, index) => (
            <option key={index} value={opcion.id} >{opcion.nombre}</option>
          ))}
        </>
      )
    }

    function guardar() {
      datosUsuario.nombre = txtNombre.current.value
      datosUsuario.apellido1 = txtApellido1.current.value
      datosUsuario.apellido2 = txtApellido2.current.value
      datosUsuario.correo = txtCorreo.current.value
      datosUsuario.correo2 = txtCorreo2.current.value
      datosUsuario.telefono = txtTelefono.current.value
      datosUsuario.contrasena = txtContrasena.current.value
      datosUsuario.contrasena2 = txtContrasena2.current.value
      datosUsuario.division = txtDivision.current.value
      datosUsuario.carrera = txtCarrera.current.value
      datosUsuario.cuatrimestre = txtCuatrimestre.current.value
      datosUsuario.grupo = txtGrupo.current.value
      datosUsuario.aspecto = txtAspecto.current.value
    }

    function validar() {
      guardar()
      errores = {
        nombre: ValidacionesUsuario.validarNombre(datosUsuario.nombre),
        apellido1: ValidacionesUsuario.validarApellido1(datosUsuario.apellido1),
        apellido2: ValidacionesUsuario.validarApellido2(datosUsuario.apellido2),
        correo: ValidacionesUsuario.validarCorreo(datosUsuario.correo),
        telefono: ValidacionesUsuario.validarTelefono(datosUsuario.telefono),
        contrasena: ValidacionesUsuario.validarContrasena(datosUsuario.contrasena),
        cuatrimestre: ValidacionesUsuario.validarCuatrimestre(datosUsuario.cuatrimestre),
        grupo: ValidacionesUsuario.validarGrupo(datosUsuario.grupo),
        correo2: ValidacionesUsuario.validarConfirmacionCorreo(datosUsuario.correo, datosUsuario.correo2),
        contrasena2: ValidacionesUsuario.validarConfirmacionContrasena(datosUsuario.contrasena, datosUsuario.contrasena2)
      }
      formulario()
    }

    function comprobarCorreo() {
      const correo = txtCorreo.current.value
      const estudiante = ValidacionesUsuario.isCorreoEstudiante(correo)
      const utez = ValidacionesUsuario.isCorreoInstitucional(correo)
      datosUsuario.utez = utez
      contenedorUtez.current.style.display = utez ? 'block' : 'none'
      contenedorExterna.current.style.display = !utez ? 'block' : 'none'
      contenedorAdministrador.current.style.display = utez ? 'block' : 'none'
      contenedorResponsable.current.style.display = utez ? 'block' : 'none'

      datosUsuario.estudiante = estudiante
      contenedorDivision.current.style.display = estudiante ? 'block' : 'none'
      contenedorCarrera.current.style.display = estudiante ? 'block' : 'none'
      contenedorCuatrimestre.current.style.display = estudiante ? 'block' : 'none'
      contenedorGrupo.current.style.display = estudiante ? 'block' : 'none'
      contenedorEstudiante.current.style.display = estudiante ? 'block' : 'none'
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
                  nombre='Nombre(s)'
                  referencia={txtNombre}
                  error={errores.nombre}
                  valorInicial={datosUsuario.nombre}
                />
              </Col>
              <Col xs='12' md='6'>
                <Input
                  nombre='Apellido1'
                  referencia={txtApellido1}
                  error={errores.apellido1}
                  valorInicial={datosUsuario.apellido1}
                />
              </Col>
              <Col xs='12' md='6'>
                <Input
                  nombre='Apellido2'
                  referencia={txtApellido2}
                  error={errores.apellido2}
                  valorInicial={datosUsuario.apellido2}
                />
              </Col>
              <Col xs='12' md='6'>
                <Input
                  nombre='Telefono'
                  referencia={txtTelefono}
                  error={errores.telefono}
                  valorInicial={datosUsuario.telefono}
                />
              </Col>
              <Col xs='12' md='6'>
                <Input
                  nombre='Correo electrónico'
                  referencia={txtCorreo}
                  error={errores.correo}
                  valorInicial={datosUsuario.correo}
                  eventoInput={comprobarCorreo}
                />
              </Col>
              <Col xs='12' md='6'>
                <Input
                  nombre='Confirmar correo electrónico'
                  referencia={txtCorreo2}
                  error={errores.correo2}
                  valorInicial={datosUsuario.correo2}
                />
              </Col>
              <Col xs='12' md='6'>
                <Input
                  nombre='Contraseña'
                  referencia={txtContrasena}
                  error={errores.contrasena}
                  valorInicial={datosUsuario.contrasena}
                />
              </Col>
              <Col xs='12' md='6'>
                <Input
                  nombre='Confirmar contraseña'
                  referencia={txtContrasena2}
                  error={errores.contrasena2}
                  valorInicial={datosUsuario.contrasena2}
                />
              </Col>
              <Col xs='12' md='6' ref={contenedorDivision} style={{display: datosUsuario.estudiante ? 'block' : 'none'}}>
                <Select
                  nombre='División académica'
                  referencia={txtDivision}
                  error={errores.division}
                  opciones={carreras}
                  valorInicial={datosUsuario.division}
                  eventoChange={comprobarDivision}
                />
              </Col>
              <Col xs='12' md='6' ref={contenedorCarrera} style={{display: datosUsuario.estudiante ? 'block' : 'none'}}>
                <Select
                  nombre='Carrera'
                  referencia={txtCarrera}
                  error={errores.carrera}
                  opciones={carrerasFiltradas}
                  valorInicial={datosUsuario.carrera}
                />
              </Col>
              <Col xs='12' md='6' ref={contenedorCuatrimestre} style={{display: datosUsuario.estudiante ? 'block' : 'none'}}>
                <Input
                  nombre='Cuatrimestre'
                  referencia={txtCuatrimestre}
                  error={errores.cuatrimestre}
                  valorInicial={datosUsuario.cuatrimestre}
                />
              </Col>
              <Col xs='12' md='6' ref={contenedorGrupo} style={{display: datosUsuario.estudiante ? 'block' : 'none'}}>
                <Input
                  nombre='Grupo'
                  referencia={txtGrupo}
                  error={errores.grupo}
                  valorInicial={datosUsuario.grupo}
                />
              </Col>
              <Col xs='12' md='6' ref={contenedorAspecto} style={{display: datosUsuario.responsable ? 'block' : 'none'}}>
                <Select
                  nombre='Aspecto ambiental'
                  referencia={txtAspecto}
                  error={errores.aspecto}
                  opciones={aspectos}
                  valorInicial={datosUsuario.aspecto}
                />
              </Col>
              <Col xs='12' md='6'>
                <Pill
                  referenciaUtez={contenedorUtez}
                  referenciaExterna={contenedorExterna}
                  referenciaEstudiante={contenedorEstudiante}
                  referenciaAdministrador={contenedorAdministrador}
                  referenciaResponsable={contenedorResponsable}
                  referenciaAdministradorB={txtAdministrador}
                  referenciaResponsableB={txtResponsable}
                  errorAdministrador={errores.administrador}
                  errorResponsable={errores.responsable}
                  valorInicial={datosUsuario}
                  eventoAdministrador={setAdministrador}
                  eventoResponsable={setResponsable}
                  modificable
                />
              </Col>
            </Row>
            <Row className='text-start w-100 mx-0 mt-2 mb-0'>
              <Col><hr className='my-0' /></Col>
            </Row>
          </>
        ),
        showCancelButton: true,
        showConfirmButton: true,
        showDenyButton: false,
        cancelButtonText: <><Icon.X /><span className='align-middle'> Cancelar</span></>,
        confirmButtonText: <><Icon.Check /><span className='align-middle'> Registrar</span></>,
        title: 'Nuevo usuario',
        width: 800,
        confirmButtonColor: Tema.azul
      }).then((res) => {
        if (res.isConfirmed) validar()
      })
    }

    formulario()
  }

  function eliminarUsuario(id) {
    Conexion.UsuariosAdministrador.eliminarUsuario(dispatch, id).then((res) => {
      if (!res.error) {
        const usuariosActualizado = usuarios.map(usuario => {
          if (usuario.id == id) return { ...usuario, activo: false }
          else return usuario
        })
        setUsuarios(usuariosActualizado)
        mostrarMensaje('Eliminación realizada', 'El usuario ha sido eliminado exitósamente.', 'success')
      } else mostrarMensaje('Error al eliminar al usuario', res.mensajeGeneral, 'error')
    }).catch((error) => mostrarMensaje('Error de conexión', 'No fue posible establecer conexión con el servidor.', 'error'))
  }

  function consultarUsuario(id) {
    Conexion.UsuariosAdministrador.obtenerUsuario(dispatch, id).then((res) => {
      if (!res.error) {
        const { correo, telefono, activo, comunidadUtez, estudiante, responsable, administrador } = res.datos

        let datos = [
          {
            nombre: 'Correo electrónico',
            valor: correo
          },
          {
            nombre: 'Teléfono',
            valor: telefono
          }
        ]

        let roles = [comunidadUtez ? 'Comunidad UTEZ' : 'Comunidad Externa']
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
            nombre: 'Estado',
            valor: activo ? <Badge bg='success'>Activo</Badge> : <Badge bg='secondary'>Inactivo</Badge>
          },
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

        function consulta() {
          alertConsulta(datos, activo, activo, getNombreCompleto(res.datos)).then((res) => {
            if (res.isDenied) eliminacion()
          })
        }
        function eliminacion() {
          alertEliminacion('usuario', <> a <b>{getNombreCompleto(res.datos)}</b></>).then((res) => {
            if (res.isDismissed) consulta()
            if (res.isConfirmed) eliminarUsuario(id)
          })
        }

        consulta()
      } else mostrarMensaje('Error al obtener los datos del usuario', res.mensajeGeneral, 'error')
    }).catch((error) => mostrarMensaje('Error de conexión', 'No fue posible establecer conexión con el servidor.', 'error'))
  }

  return (
    <Card className='shadow mx-auto'>
      <Card.Header className='bg-azul-dark text-white'>
        <Row className='gy-2 gy-md-0'>
          <Col>
            <Card.Title style={{ paddingBlock: '0.5rem' }} className='m-0'>Usuarios</Card.Title>
          </Col>
          <Col md='auto' className='p-md-0'>
            <InputGroup>
              <FormControl
                ref={txtFiltro}
                placeholder='Nombre o correo electrónico'
              />
              <Button onClick={buscar} variant='verde'><Icon.Search /></Button>
            </InputGroup>
          </Col>
          <Col md='auto'>
            <Button ref={btnAgregar} onClick={formularioRegistro} disabled={aspectos.length == 0} variant='verde' style={{ height: 40, width: 40, padding: 6, aspectRatio: 1 / 1, borderRadius: '50%' }}><Icon.Plus /></Button>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        <TablaInfinita onClickElemento={consultarUsuario} contenido={usuarios} setContenido={setUsuarios} filtro={filtro} numerada columnas={columnas} fuenteContenido={Conexion.UsuariosAdministrador.obtenerUsuarios} />
      </Card.Body>
    </Card>

  )
}
