import { mostrarLoader, mostrarMensaje } from "./Alert"

const baseUrl = 'https://siriaci-service.azurewebsites.net'
// const baseUrl = 'http://localhost:8080'

function getInit(metodo, datos) {
    const sesion = JSON.parse(localStorage.getItem('sesion')) || null
    return {
        method: metodo,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': sesion ? `Bearer ${sesion.token}` : null
        },
        body: datos ? JSON.stringify(datos) : null
    }
}

function validarPeticion(dispatch, respuesta) {
    if (respuesta.status === 200 || respuesta.status === 400) {
        return respuesta.json()
    } else if (respuesta.status === 403 || respuesta.status === 401) {
        dispatch({ tipo: 'CERRAR SESION' })
        mostrarMensaje('Sesión caducada', 'La sesión ha caducado, vuelve a iniciar sesión.', 'info')
        return respuesta.json()
    } else {
        mostrarMensaje('Error de servidor', 'Ha ocurrido un error desconocido, vuelve a intentarlo más tarde.', 'error')
    }
}

export const ReportesAdministrador = {
    obtenerReporte: (dispatch, datos) => {
        mostrarLoader()
        let url = new URL(`/api/administrador/reportes/`, baseUrl)
        return fetch(url, getInit('POST', datos)).then((res) => validarPeticion(dispatch, res))
    }
}
export const ReportesResponsable = {
    obtenerReporte: (dispatch, datos) => {
        mostrarLoader()
        let url = new URL(`/api/responsable/reportes/`, baseUrl)
        return fetch(url, getInit('POST', datos)).then((res) => validarPeticion(dispatch, res))
    }
}
export const Verificacion = {
    verificarUsuario(dispatch, datos) {
        mostrarLoader()
        let url = new URL(`/api/verificacion/`, baseUrl)
        return fetch(url, getInit('POST', datos)).then((res) => validarPeticion(dispatch, res))
    }
}
export const Acceso = {
    iniciarSesion: (dispatch, datos) => {
        mostrarLoader()
        let url = new URL(`/api/iniciosesion/`, baseUrl)
        return fetch(url, getInit('POST', datos)).then((res) => validarPeticion(dispatch, res))
    }
}
export const UsuariosGeneral = {
    obtenerPerfil: (dispatch) => {
        mostrarLoader()
        let url = new URL(`/api/usuarios/`, baseUrl)
        return fetch(url, getInit('GET')).then((res) => validarPeticion(dispatch, res))
    },
    automodificacion: (dispatch, usuario) => {
        mostrarLoader()
        let url = new URL(`/api/usuarios/`, baseUrl)
        return fetch(url, getInit('PATCH', usuario)).then((res) => validarPeticion(dispatch, res))
    }
}
export const UsuariosAdministrador = {
    obtenerUsuarios: (dispatch, pagina, filtro) => {
        let url = new URL(`/api/administrador/usuarios/`, baseUrl)
        if (pagina) url.searchParams.set('pagina', pagina)
        if (filtro) url.searchParams.set('filtro', filtro)
        return fetch(url, getInit('GET')).then((res) => validarPeticion(dispatch, res))
    },
    obtenerUsuario: (dispatch, id) => {
        mostrarLoader()
        let url = new URL(`/api/administrador/usuarios/${id}`, baseUrl)
        return fetch(url, getInit('GET')).then((res) => validarPeticion(dispatch, res))
    },
    registrarUsuario: (dispatch, usuario) => {
        mostrarLoader()
        let url = new URL(`/api/administrador/usuarios/`, baseUrl)
        return fetch(url, getInit('POST', usuario)).then((res) => validarPeticion(dispatch, res))
    },
    modificarUsuario: (dispatch, id, usuario) => {
        mostrarLoader()
        let url = new URL(`/api/administrador/usuarios/${id}`, baseUrl)
        return fetch(url, getInit('PATCH', usuario)).then((res) => validarPeticion(dispatch, res))
    },
    eliminarUsuario: (dispatch, id) => {
        mostrarLoader()
        let url = new URL(`/api/administrador/usuarios/${id}`, baseUrl)
        return fetch(url, getInit('DELETE')).then((res) => validarPeticion(dispatch, res))
    }
}
export const IncidenciasAdministrador = {
    obtenerIncidencias: (dispatch, pagina, filtro) => {
        let url = new URL(`/api/administrador/incidencias/`, baseUrl)
        if (pagina) url.searchParams.set('pagina', pagina)
        if (filtro) url.searchParams.set('filtro', filtro)
        return fetch(url, getInit('GET')).then((res) => validarPeticion(dispatch, res))
    },
    obtenerIncidencia: (dispatch, id) => {
        mostrarLoader()
        let url = new URL(`/api/administrador/incidencias/${id}`, baseUrl)
        return fetch(url, getInit('GET')).then((res) => validarPeticion(dispatch, res))
    },
    obtenerIncidenciaPorCodigo: (dispatch, codigo) => {
        mostrarLoader()
        let url = new URL(`/api/administrador/incidencias/codigo/`, baseUrl)
        url.searchParams.set('codigo', codigo)
        return fetch(url, getInit('GET')).then((res) => validarPeticion(dispatch, res))
    },
    antenderIncidencia: (dispatch, id, datos) => {
        mostrarLoader()
        let url = new URL(`/api/administrador/incidencias/${id}`, baseUrl)
        return fetch(url, getInit('PATCH', datos)).then((res) => validarPeticion(dispatch, res))
    },
    eliminarIncidencia: (dispatch, id) => {
        mostrarLoader()
        let url = new URL(`/api/administrador/incidencias/${id}`, baseUrl)
        return fetch(url, getInit('DELETE')).then((res) => validarPeticion(dispatch, res))
    }
}
export const IncidenciasResponsable = {
    obtenerIncidencias: (dispatch, pagina, filtro) => {
        let url = new URL(`/api/responsable/incidencias/`, baseUrl)
        if (pagina) url.searchParams.set('pagina', pagina)
        if (filtro) url.searchParams.set('filtro', filtro)
        return fetch(url, getInit('GET')).then((res) => validarPeticion(dispatch, res))
    },
    obtenerIncidencia: (dispatch, id) => {
        mostrarLoader()
        let url = new URL(`/api/responsable/incidencias/${id}`, baseUrl)
        return fetch(url, getInit('GET')).then((res) => validarPeticion(dispatch, res))
    },
    obtenerIncidenciaPorCodigo: (dispatch, codigo) => {
        mostrarLoader()
        let url = new URL(`/api/responsable/incidencias/codigo/`, baseUrl)
        url.searchParams.set('codigo', codigo)
        return fetch(url, getInit('GET')).then((res) => validarPeticion(dispatch, res))
    },
    antenderIncidencia: (dispatch, id, datos) => {
        mostrarLoader()
        let url = new URL(`/api/responsable/incidencias/${id}`, baseUrl)
        return fetch(url, getInit('PATCH', datos)).then((res) => validarPeticion(dispatch, res))
    },
}
export const CapsulasAdministrador = {
    obtenerCapsulas: (dispatch, pagina, filtro) => {
        let url = new URL(`/api/administrador/capsulas/`, baseUrl)
        if (pagina) url.searchParams.set('pagina', pagina)
        if (filtro) url.searchParams.set('filtro', filtro)
        return fetch(url, getInit('GET')).then((res) => validarPeticion(dispatch, res))
    },
    registrarCapsula: (dispatch, capsula) => {
        mostrarLoader()
        let url = new URL(`/api/administrador/capsulas/`, baseUrl)
        return fetch(url, getInit('POST', capsula)).then((res) => validarPeticion(dispatch, res))
    },
    modificarCapsula: (dispatch, id, capsula) => {
        mostrarLoader()
        let url = new URL(`/api/administrador/capsulas/${id}`, baseUrl)
        return fetch(url, getInit('PATCH', capsula)).then((res) => validarPeticion(dispatch, res))
    },
    obtenerCapsula: (dispatch, id) => {
        mostrarLoader()
        let url = new URL(`/api/administrador/capsulas/${id}`, baseUrl)
        return fetch(url, getInit('GET')).then((res) => validarPeticion(dispatch, res))
    },
    eliminarCapsula: (dispatch, id) => {
        mostrarLoader()
        let url = new URL(`/api/administrador/capsulas/${id}`, baseUrl)
        return fetch(url, getInit('DELETE')).then((res) => validarPeticion(dispatch, res))
    }
}
export const CapsulasResponsable = {
    obtenerCapsulas: (dispatch, pagina, filtro) => {
        let url = new URL(`/api/responsable/capsulas/`, baseUrl)
        if (pagina) url.searchParams.set('pagina', pagina)
        if (filtro) url.searchParams.set('filtro', filtro)
        return fetch(url, getInit('GET')).then((res) => validarPeticion(dispatch, res))
    },
    obtenerCapsula: (dispatch, id) => {
        mostrarLoader()
        let url = new URL(`/api/responsable/capsulas/${id}`, baseUrl)
        return fetch(url, getInit('GET')).then((res) => validarPeticion(dispatch, res))
    },
    registrarCapsula: (dispatch, capsula) => {
        mostrarLoader()
        let url = new URL(`/api/responsable/capsulas/`, baseUrl)
        return fetch(url, getInit('POST', capsula)).then((res) => validarPeticion(dispatch, res))
    },
    modificarCapsula: (dispatch, id, capsula) => {
        mostrarLoader()
        let url = new URL(`/api/responsable/capsulas/${id}`, baseUrl)
        return fetch(url, getInit('PATCH', capsula)).then((res) => validarPeticion(dispatch, res))
    },
    eliminarCapsula: (dispatch, id) => {
        mostrarLoader()
        let url = new URL(`/api/responsable/capsulas/${id}`, baseUrl)
        return fetch(url, getInit('DELETE')).then((res) => validarPeticion(dispatch, res))
    }
}
export const CapsulasPublico = {
    obtenerCapsulas: (dispatch, pagina) => {
        let url = new URL(`/api/publico/capsulas/`, baseUrl)
        if (pagina) url.searchParams.set('pagina', pagina)
        return fetch(url, getInit('GET')).then((res) => validarPeticion(dispatch, res))
    },
    obtenerCapsula: (dispatch, id) => {
        mostrarLoader()
        let url = new URL(`/api/publico/capsulas/${id}`, baseUrl)
        return fetch(url, getInit('GET')).then((res) => validarPeticion(dispatch, res))
    },
    obtenerCapsulaByCodigo: (dispatch, codigo) => {
        mostrarLoader()
        let url = new URL(`/api/publico/capsulas/codigo/${codigo}`, baseUrl)
        return fetch(url, getInit('GET')).then((res) => validarPeticion(dispatch, res))
    }
}
export const Seleccionables = {
    obtenerImportancias: (dispatch) => {
        let url = new URL(`/api/seleccionables/importancias/`, baseUrl)
        return fetch(url, getInit('GET')).then((res) => validarPeticion(dispatch, res))
    },
    obtenerEstados: (dispatch) => {
        let url = new URL(`/api/seleccionables/estados/`, baseUrl)
        return fetch(url, getInit('GET')).then((res) => validarPeticion(dispatch, res))
    },
    obtenerAspectos: (dispatch) => {
        let url = new URL(`/api/seleccionables/aspectos/`, baseUrl)
        return fetch(url, getInit('GET')).then((res) => validarPeticion(dispatch, res))
    },
    obtenerCarreras: (dispatch) => {
        let url = new URL(`/api/seleccionables/carreras/`, baseUrl)
        return fetch(url, getInit('GET')).then((res) => validarPeticion(dispatch, res))
    }
}
export const Restablecimiento = {
    registrarSolicitud: (dispatch, datos) => {
        mostrarLoader()
        let url = new URL(`/api/restablecimiento/`, baseUrl)
        return fetch(url, getInit('POST', datos)).then((res) => validarPeticion(dispatch, res))
    },
    validarCodigo: (dispatch, datos) => {
        mostrarLoader()
        let url = new URL(`/api/restablecimiento/`, baseUrl)
        return fetch(url, getInit('PATCH', datos)).then((res) => validarPeticion(dispatch, res))
    },
    restablecerContrasena: (dispatch, datos) => {
        mostrarLoader()
        let url = new URL(`/api/restablecimiento/`, baseUrl)
        return fetch(url, getInit('PATCH', datos)).then((res) => validarPeticion(dispatch, res))
    },
}