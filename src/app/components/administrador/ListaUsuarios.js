import React, { useContext, useEffect, useRef, useState } from 'react'
import { Badge, Button, Card, Col, Container, Form, FormControl, InputGroup, Nav, Row } from 'react-bootstrap'
import TablaInfinita from '../../utils/TablaInfinita'
import * as Icon from 'react-feather'
import AutenticacionContext from '../autenticacion/AutenticacionContext'
import { getNombreCompleto, getUsuarioLista } from '../../utils/Formateador'
import Alert, { alertConexion, alertConfirmacion, alertConsulta, alertEliminacion, alertError, alertExito, alertRegistrar, mostrarMensaje } from '../../utils/Alert'
import Tema from '../../utils/Tema'
import Input, { Pill, Select } from '../../utils/Input'
import { ValidacionesUsuario } from '../../utils/Validador'
import * as ReactDOM from 'react-dom/client'
import { Seleccionables, UsuariosAdministrador } from '../../utils/Conexion'

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
      let res = await Seleccionables.obtenerCarreras()
      if (!res.error) setCarreras(res.datos)
      res = await Seleccionables.obtenerAspectos()
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

  function registrarUsuario(usuario) {
    UsuariosAdministrador.registrarUsuario(dispatch, usuario).then((res) => {
      if (!res.error) {
        alertExito(res, 'Es necesario verificar la dirección de correo electrónico para dar de alta la cuenta.')
      } else {
        const errores = res.errores
        alertError(res).then((res) => {
          if (res.isConfirmed) formularioRegistro(usuario, errores)
        })
      }
    }).catch(alertConexion)
  }

  function formularioRegistro(datosUsuario, errores) {
    if (!datosUsuario) datosUsuario = {}
    if (!errores) errores = {}
    let selectCarreras
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
      const objetos = carreras.find((division) => division.id == datosUsuario.division)
      carrerasFiltradas = objetos ? objetos.carreras : []

      try {
        selectCarreras.unmount()
      } catch (error) { }
      selectCarreras = ReactDOM.createRoot(txtCarrera.current)
      selectCarreras.render(
        <>
          <option value='' >Selecciona una opción...</option>
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
      datosUsuario.grupo = txtGrupo.current.value.toUpperCase()
      datosUsuario.aspecto = txtAspecto.current.value
    }

    function registro() {
      errores = {}
      let numErrores = 0
      let numErroresEstudiante = 0
      let numErroresResponsable = 0
      let error
      guardar()

      error = ValidacionesUsuario.validarNombre(datosUsuario.nombre)
      if (error) {
        errores.nombre = error
        numErrores++
      }
      error = ValidacionesUsuario.validarApellido1(datosUsuario.apellido1)
      if (error) {
        errores.apellido1 = error
        numErrores++
      }
      error = ValidacionesUsuario.validarApellido2(datosUsuario.apellido2)
      if (error) {
        errores.apellido2 = error
        numErrores++
      }
      error = ValidacionesUsuario.validarTelefono(datosUsuario.telefono)
      if (error) {
        errores.telefono = error
        numErrores++
      }
      error = ValidacionesUsuario.validarCorreo(datosUsuario.correo)
      if (error) {
        errores.correo = error
        numErrores++
      }
      error = ValidacionesUsuario.validarConfirmacionCorreo(datosUsuario.correo, datosUsuario.correo2)
      if (error) {
        errores.correo2 = error
        numErrores++
      }
      error = ValidacionesUsuario.validarContrasena(datosUsuario.contrasena)
      if (error) {
        errores.contrasena = error
        numErrores++
      }
      error = ValidacionesUsuario.validarConfirmacionContrasena(datosUsuario.contrasena, datosUsuario.contrasena2)
      if (error) {
        errores.contrasena2 = error
        numErrores++
      }
      error = !datosUsuario.carrera ? 'Debes seleccionar una carrera.' : null
      if (error) {
        errores.carrera = error
        numErroresEstudiante++
      }
      error = ValidacionesUsuario.validarCuatrimestre(datosUsuario.cuatrimestre)
      if (error) {
        errores.cuatrimestre = error
        numErroresEstudiante++
      }
      error = ValidacionesUsuario.validarGrupo(datosUsuario.grupo)
      if (error) {
        errores.grupo = error
        numErroresEstudiante++
      }
      error = !datosUsuario.aspecto ? 'Debes seleccionar un aspecto ambiental.' : null
      if (error) {
        errores.aspecto = error
        numErroresResponsable++
      }

      if (numErrores == 0 && (!datosUsuario.estudiante || numErroresEstudiante == 0) && (!datosUsuario.responsable || numErroresResponsable == 0)) registrarUsuario(datosUsuario)
      else formulario()
    }

    function cancelacion() {
      guardar()
      alertConfirmacion('Cancelar registro', '¿Deseas salir? Se perderá la información ingresada.', 'warning').then((res) => {
        if (res.isDismissed) formulario()
      })
    }

    function comprobarCorreo() {
      const correo = txtCorreo.current.value
      const estudiante = ValidacionesUsuario.isCorreoEstudiante(correo)
      const utez = ValidacionesUsuario.isCorreoInstitucional(correo)
      datosUsuario.utez = utez
      if (!utez) {
        datosUsuario.administrador = false
        datosUsuario.responsable = false
      }
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
                  nombre='Correo electrónico'
                  obligatorio
                  referencia={txtCorreo}
                  error={errores.correo}
                  valorInicial={datosUsuario.correo}
                  eventoInput={comprobarCorreo}
                  tipo='email'
                />
              </Col>
              <Col xs='12' md='6'>
                <Input
                  nombre='Confirmar correo electrónico'
                  obligatorio
                  referencia={txtCorreo2}
                  error={errores.correo2}
                  valorInicial={datosUsuario.correo2}
                  tipo='email'
                />
              </Col>
              <Col xs='12' md='6'>
                <Input
                  nombre='Contraseña'
                  obligatorio
                  referencia={txtContrasena}
                  error={errores.contrasena}
                  valorInicial={datosUsuario.contrasena}
                  tipo='password'
                />
              </Col>
              <Col xs='12' md='6'>
                <Input
                  nombre='Confirmar contraseña'
                  obligatorio
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
              <Col xs='12' md='6' ref={contenedorAspecto} style={{ display: datosUsuario.responsable ? 'block' : 'none' }}>
                <Select
                  nombre='Aspecto ambiental'
                  obligatorio
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
            <Row className='text-start w-100 mx-0 mt-3 mb-0'>
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
        title: 'Nuevo usuario',
        width: 800,
        confirmButtonColor: Tema.azul
      }).then((res) => {
        if (res.isConfirmed) registro()
        if (res.isDismissed) cancelacion()
      })
    }
    formulario()
  }

  function eliminarUsuario(id) {
    UsuariosAdministrador.eliminarUsuario(dispatch, id).then((res) => {
      if (!res.error) {
        const usuariosActualizado = usuarios.map(usuario => {
          if (usuario.id == id) return { ...usuario, activo: false }
          else return usuario
        })
        setUsuarios(usuariosActualizado)
        alertExito(res)
      } else alertError(res)
    }).catch(alertConexion)
  }

  function consultarUsuario(id) {
    UsuariosAdministrador.obtenerUsuario(dispatch, id).then((res) => {
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

        function modificarUsuario() {
          const {id: temp_id, correo: temp_correo, nombre: temp_nombre, apellido1: temp_apellido1, apellido2: temp_apellido2, telefono: temp_telefono, estudiante: temp_estudiante, administrador: temp_administrador, responsable: temp_responsable } = res.datos
          let datosOriginales = {
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
            datosOriginales = {
              ...datosOriginales,
              carrera: temp_carrera,
              cuatrimestre: temp_cuatrimestre,
              grupo: temp_grupo,
            }
          }

          if (temp_responsable) {
            const { responsable: { aspecto: { id: temp_aspecto } } } = res.datos
            datosOriginales = {
              ...datosOriginales,
              aspecto: temp_aspecto
            }
          }

          let datosUsuario = { ...datosOriginales }
          let errores = {}
          let selectCarreras
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
            const objetos = carreras.find((division) => division.id == datosUsuario.division)
            carrerasFiltradas = objetos ? objetos.carreras : []

            try {
              selectCarreras.unmount()
            } catch (error) { }
            selectCarreras = ReactDOM.createRoot(txtCarrera.current)
            selectCarreras.render(
              <>
                <option value='' >Selecciona una opción...</option>
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
            datosUsuario.telefono = txtTelefono.current.value
            datosUsuario.contrasena = txtContrasena.current.value
            datosUsuario.contrasena2 = txtContrasena2.current.value
            datosUsuario.division = txtDivision.current.value
            datosUsuario.carrera = txtCarrera.current.value ? txtCarrera.current.value : datosOriginales.carrera
            datosUsuario.cuatrimestre = txtCuatrimestre.current.value
            datosUsuario.grupo = txtGrupo.current.value.toUpperCase()
            datosUsuario.aspecto = txtAspecto.current.value
          }

          function registro() {
            errores = {}
            let numErrores = 0
            let numErroresEstudiante = 0
            let numErroresResponsable = 0
            let error
            guardar()

            error = ValidacionesUsuario.validarNombre(datosUsuario.nombre)
            if (error) {
              errores.nombre = error
              numErrores++
            }
            error = ValidacionesUsuario.validarApellido1(datosUsuario.apellido1)
            if (error) {
              errores.apellido1 = error
              numErrores++
            }
            error = ValidacionesUsuario.validarApellido2(datosUsuario.apellido2)
            if (error) {
              errores.apellido2 = error
              numErrores++
            }
            error = ValidacionesUsuario.validarTelefono(datosUsuario.telefono)
            if (error) {
              errores.telefono = error
              numErrores++
            }
            if (datosUsuario.contrasena) {
              error = ValidacionesUsuario.validarContrasena(datosUsuario.contrasena)
              if (error) {
                errores.contrasena = error
                numErrores++
              }
              error = ValidacionesUsuario.validarConfirmacionContrasena(datosUsuario.contrasena, datosUsuario.contrasena2)
              if (error) {
                errores.contrasena2 = error
                numErrores++
              }
            }
            error = !datosUsuario.carrera ? 'Debes seleccionar una carrera.' : null
            if (error) {
              errores.carrera = error
              numErroresEstudiante++
            }
            error = ValidacionesUsuario.validarCuatrimestre(datosUsuario.cuatrimestre)
            if (error) {
              errores.cuatrimestre = error
              numErroresEstudiante++
            }
            error = ValidacionesUsuario.validarGrupo(datosUsuario.grupo)
            if (error) {
              errores.grupo = error
              numErroresEstudiante++
            }
            error = !datosUsuario.aspecto ? 'Debes seleccionar un aspecto ambiental.' : null
            if (error) {
              errores.aspecto = error
              numErroresResponsable++
            }

            if (numErrores == 0 && (!datosUsuario.estudiante || numErroresEstudiante == 0) && (!datosUsuario.responsable || numErroresResponsable == 0)) {
              const nuevosDatos = {}
              if (datosUsuario.nombre != datosOriginales.nombre) nuevosDatos.nombre = datosUsuario.nombre
              if (datosUsuario.apellido1 != datosOriginales.apellido1) nuevosDatos.apellido1 = datosUsuario.apellido1
              if (datosUsuario.apellido2 != datosOriginales.apellido2) nuevosDatos.apellido2 = datosUsuario.apellido2
              if (datosUsuario.telefono != datosOriginales.telefono) nuevosDatos.telefono = datosUsuario.telefono
              if (datosUsuario.contrasena) {
                if (datosUsuario.contrasena != datosOriginales.contrasena) nuevosDatos.contrasena = datosUsuario.contrasena
              }
              if (datosUsuario.estudiante) {
                if (datosUsuario.carrera != datosOriginales.carrera) nuevosDatos.carrera = datosUsuario.carrera
                if (datosUsuario.cuatrimestre != datosOriginales.cuatrimestre) nuevosDatos.cuatrimestre = datosUsuario.cuatrimestre
                if (datosUsuario.grupo != datosOriginales.grupo) nuevosDatos.grupo = datosUsuario.grupo
              }
              if (datosUsuario.responsable) {
                if (datosUsuario.aspecto != datosOriginales.aspecto) nuevosDatos.aspecto = datosUsuario.aspecto
              }
              if (datosUsuario.responsable != datosOriginales.responsable) nuevosDatos.responsable = datosUsuario.responsable
              if (datosUsuario.administrador != datosOriginales.administrador) nuevosDatos.administrador = datosUsuario.administrador

              UsuariosAdministrador.modificarUsuario(dispatch, id, nuevosDatos).then((res) => {
                if (!res.error) {
                  let usuariosActualizado = usuarios.map((usuario) => {
                    if (usuario.id == id) return getUsuarioLista({ ...datosOriginales, ...nuevosDatos })
                    else return usuario
                  })
                  setUsuarios(usuariosActualizado)
                  alertExito(res)
                } else alertError(res, 'Error al modificar los datos del usuario.')
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
                        obligatorio
                        referencia={txtContrasena}
                        error={errores.contrasena}
                        valorInicial={datosUsuario.contrasena}
                        tipo='password'
                      />
                    </Col>
                    <Col xs='12' md='6'>
                      <Input
                        nombre='Confirmar contraseña'
                        obligatorio
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
                    <Col xs='12' md='6' ref={contenedorAspecto} style={{ display: datosUsuario.responsable ? 'block' : 'none' }}>
                      <Select
                        nombre='Aspecto ambiental'
                        obligatorio
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
                  <Row className='text-start w-100 mx-0 mt-3 mb-0'>
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
              title: 'Modificar usuario',
              width: 800,
              confirmButtonColor: Tema.azul
            }).then((res) => {
              if (res.isConfirmed) registro()
              if (res.isDismissed) cancelacion()
            })
          }
          formulario()
        }

        function consulta() {
          alertConsulta(datos, activo, activo, getNombreCompleto(res.datos)).then((res) => {
            if (res.isDenied) eliminacion()
            if (res.isConfirmed) modificarUsuario()
          })
        }
        function eliminacion() {
          alertEliminacion('usuario', <> a <b>{getNombreCompleto(res.datos)}</b></>).then((res) => {
            if (res.isDismissed) consulta()
            if (res.isConfirmed) eliminarUsuario(id)
          })
        }

        consulta()
      } else alertError(res, 'Error al obtener los datos del usuario')
    }).catch(alertConexion)
  }

  return (
    <Card className='shadow mx-auto'>
      <Card.Header className='bg-azul-dark text-white'>
        <Row className='gy-2 gy-md-0'>
          <Col>
            <Card.Title style={{ paddingBlock: '0.5rem' }} className='m-0'>Usuarios</Card.Title>
          </Col>
          <Col md='auto' className='p-md-0'>
            <Form noValidate onSubmit={(event) => {
              event.preventDefault()
              buscar()
            }}>
              <InputGroup>
                <FormControl
                  ref={txtFiltro}
                  placeholder='Nombre o correo electrónico'
                />
                <Button type='submit' variant='verde'><Icon.Search /></Button>
              </InputGroup>
            </Form>
          </Col>
          <Col md='auto'>
            <Button ref={btnAgregar} onClick={() => formularioRegistro()} disabled={aspectos.length == 0} variant='verde' style={{ height: 40, width: 40, padding: 6, aspectRatio: 1 / 1, borderRadius: '50%' }}><Icon.Plus /></Button>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        <TablaInfinita onClickElemento={consultarUsuario} contenido={usuarios} setContenido={setUsuarios} filtro={filtro} numerada columnas={columnas} fuenteContenido={UsuariosAdministrador.obtenerUsuarios} />
      </Card.Body>
    </Card>

  )
}
