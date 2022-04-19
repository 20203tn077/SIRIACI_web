import { mostrarLoader, mostrarMensaje } from "./Alert"

const baseUrl = 'http://192.168.100.25:8080'

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
    if (respuesta.status == 200 || respuesta.status == 400) {
        return respuesta.json()
    } else if (respuesta.status == 403 || respuesta.status == 401) {
        dispatch({ tipo: 'CERRAR SESION' })
        mostrarMensaje('Sesión caducada', 'La sesión ha caducado, vuelve a iniciar sesión.', 'info')
    } else {
        mostrarMensaje('Error de servidor', 'Ha ocurrido un error desconocido, vuelve a intentarlo más tarde.', 'error')
    }
}

export const Conexion = {
    InicioSesion: {
        iniciarSesion: (dispatch, datos) => {
            mostrarLoader()
            let url = new URL(`/api/iniciosesion/`, baseUrl)
            return fetch(url, getInit('POST', datos)).then((res) => validarPeticion(dispatch, res))
        }
    },
    UsuariosAdministrador: {
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
        eliminarUsuario: (dispatch, id) => {
            mostrarLoader()
            let url = new URL(`/api/administrador/usuarios/${id}`, baseUrl)
            return fetch(url, getInit('DELETE')).then((res) => validarPeticion(dispatch, res))
        }
    },
    IncidenciasAdministrador: {
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
        eliminarIncidencia: (dispatch, id) => {
            mostrarLoader()
            let url = new URL(`/api/administrador/incidencias/${id}`, baseUrl)
            return fetch(url, getInit('DELETE')).then((res) => validarPeticion(dispatch, res))
        }
    },
    CapsulasAdministrador: {
        obtenerCapsulas: (dispatch, pagina, filtro) => {
            let url = new URL(`/api/administrador/capsulas/`, baseUrl)
            if (pagina) url.searchParams.set('pagina', pagina)
            if (filtro) url.searchParams.set('filtro', filtro)
            return fetch(url, getInit('GET')).then((res) => validarPeticion(dispatch, res))
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
    },
    CapsulasResponsable: {
    },
    CapsulasPublico: {
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
    },
    Seleccionables: {
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
}



/*
export const  = {

}
export const  = {

}
export const  = {

}
export const  = {

}
export const  = {

}
export const  = {

}
export const  = {

}
export const  = {

}
export const  = {

}
export const  = {

}
export const  = {

}


: () => {
    return fetch(`${baseUrl}/api/`, getInit('')).then(res => res.json())
}
*/