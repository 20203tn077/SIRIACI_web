// Expresiones regulares para validar cadenas
const REGEX_NOMBRE_VALIDO = new RegExp('^[a-zA-Z\\xC0-\\uFFFF][a-zA-Z\\xC0-\\uFFFF-]+( [a-zA-Z\\xC0-\\uFFFF-]+)*$')
const REGEX_TELEFONO_VALIDO = new RegExp('^\\d{10}$')
const REGEX_CADENA_VACIA = new RegExp('^[\\s.\\-_]*$')
const REGEX_CORREO_VALIDO = new RegExp('^[\\w-.]+@[\\w-.]+\\.[\\w.]+$')
const REGEX_CORREO_INSTITUCIONAL = new RegExp('^[\\w-.]+@utez\\.edu\\.mx$')
const REGEX_CORREO_ESTUDIANTE = new RegExp('^i?20\\d{2}3\\w{2}\\d{3}@utez.edu.mx$')

// Límites
const USUARIO_NOMBRE_MAX = 64
const USUARIO_APELLIDO_MAX = 32
const USUARIO_CORREO_MAX = 64
const USUARIO_TELEFONO = 10
const USUARIO_CONTRASENA_MIN = 8
const USUARIO_CONTRASENA_MAX = 64
const USUARIO_CUATRIMESTRE_MAX = 11
const INCIDENCIA_DESCRIPCION_MAX = 255
const INCIDENCIA_COMENTARIO_MAX = 128
const CAPSULA_TITULO_MAX = 128


// Coordenadas de puntos del polígono que abarca a la UTEZ en google maps
const COORDENADAS_UTEZ = [
        [18.848725, -99.202692],
        [18.852224, -99.202421],
        [18.853268, -99.200056],
        [18.852378, -99.199289],
        [18.851659, -99.199841],
        [18.851115, -99.199399],
        [18.850123, -99.199640],
        [18.849607, -99.199961],
        [18.849144, -99.199985],
        [18.849098, -99.200385],
        [18.848439, -99.200481]
]

export const ValidacionesUsuario = {
    validarNombre: (nombre) => {
        if (isEmpty(nombre)) return 'Debes ingresar un nombre.'
        if (nombre.length > USUARIO_NOMBRE_MAX) return `Máximo ${USUARIO_NOMBRE_MAX} caracteres.`
        if (!REGEX_NOMBRE_VALIDO.test(nombre)) return 'Ingresa un nombre válido.'
        return null
    },
    validarApellido1: (apellido) => {
        if (isEmpty(apellido)) return 'Debes ingresar un apellido.'
        if (apellido.length > USUARIO_APELLIDO_MAX) return `Máximo ${USUARIO_APELLIDO_MAX} caracteres.`
        if (!REGEX_NOMBRE_VALIDO.test(apellido)) return 'Ingresa un apellido válido.'
        return null
    },
    validarApellido2: (apellido) => {
        if (!apellido) return 'Debes ingresar un apellido.'
        if (apellido === '') return null
        if (REGEX_CADENA_VACIA.test(apellido)) return 'Debes ingresar un apellido.'
        if (apellido.length > USUARIO_APELLIDO_MAX) return `Máximo ${USUARIO_APELLIDO_MAX} caracteres.`
        if (!REGEX_NOMBRE_VALIDO.test(apellido)) return 'Ingresa un apellido válido.'
        return null
    },
    validarCorreo: (correo) => {
        if (isEmpty(correo)) return 'Debes ingresar un correo electrónico.'
        if (correo.length > USUARIO_CORREO_MAX) return `Máximo ${USUARIO_CORREO_MAX} caracteres.`
        if (!REGEX_CORREO_VALIDO.test(correo)) return 'Ingresa un correo electrónico válido.'
        return null
    },
    validarTelefono: (telefono) => {
        if (isEmpty(telefono)) return 'Debes ingresar un número de teléfono.'
        if (telefono.length != USUARIO_TELEFONO) return `El número de teléfono debe tener ${USUARIO_TELEFONO} dígitos.`
        if (!REGEX_TELEFONO_VALIDO.test(telefono)) return 'Ingresa un número de teléfono válido.'
        return null
    },
    validarContrasena: (contrasena) => {
        if (isEmpty(contrasena)) return 'Debes ingresar una contraseña.'
        if (contrasena.length < USUARIO_CONTRASENA_MIN) return `Mínimo ${USUARIO_CONTRASENA_MIN} caracteres.`
        if (contrasena.length > USUARIO_CONTRASENA_MAX) return `Máximo ${USUARIO_CONTRASENA_MAX} caracteres.`
        return null
    },
    validarCuatrimestre: (cuatrimestre) => {
        if (!cuatrimestre) return 'Debes ingresar un cuatrimestre.'
        if (!(cuatrimestre >= 1 && cuatrimestre <= USUARIO_CUATRIMESTRE_MAX)) return `Ingresa un cuatrimestre válido (1-${USUARIO_CUATRIMESTRE_MAX}).`
        return null
    },
    validarGrupo: (grupo) => {
        if (!grupo) return 'Debes ingresar un grupo.'
        if (!(grupo >= 'A' && grupo <= 'Z')) return 'Ingresa un grupo válido.'
        return null
    },
    validarConfirmacionCorreo : (correo, confirmacion) => {
        return correo == confirmacion ? null : 'Las direcciones de correo no coinciden.'
    },
    validarConfirmacionContrasena : (contrasena, confirmacion) => {
        return contrasena == confirmacion ? null : 'Las contraseñas no coinciden.'
    },
    isCorreoEstudiante : (correo) => {
        return REGEX_CORREO_ESTUDIANTE.test(correo)
    },
    isCorreoInstitucional : (correo) => {
        return REGEX_CORREO_INSTITUCIONAL.test(correo)
    }
}

export const ValidacionesIncidencia = {
    validarDescripcion: (descripcion) => {
        if (isEmpty(descripcion)) return 'Debes ingresar una descripción.'
        if (descripcion.length > INCIDENCIA_DESCRIPCION_MAX) return  `Máximo ${INCIDENCIA_DESCRIPCION_MAX} caracteres.`
        return null
    },
    validarComentario: (comentario) => {
        if (!comentario) return 'Debes ingresar un comentario.'
        if (comentario === '') return null
        if (REGEX_CADENA_VACIA.test(comentario)) return 'Debes ingresar un comentario.'
        if (comentario.length > INCIDENCIA_COMENTARIO_MAX) return  `Máximo ${INCIDENCIA_COMENTARIO_MAX} caracteres.`
        return null
    },
    validarUbicacion: (latitud, longitud) => {
        if (!latitud || !longitud) return 'Debes seleccionar una ubicación.'
        if (!isUbicacionDentroUtez(latitud, longitud)) return 'Selecciona una ubicación dentro de la UTEZ.'
        return null
    }
}

export const ValidacionesCapsula = {
    validarTitulo: (titulo) => {
        if (isEmpty(titulo)) return 'Debes ingresar un título.'
        if (titulo.length > CAPSULA_TITULO_MAX) return  `Máximo ${CAPSULA_TITULO_MAX} caracteres.`
        return null
    },
    validarContenido: (contenido) => {
        if (isEmpty(contenido)) return 'Debes ingresar algo como contenido.'
        return null
    }
}

function isEmpty(valor) {
    return !valor || valor.match(REGEX_CADENA_VACIA)
}

export const isVacio = isEmpty

export const validarCampoObligatorio = (valor) => {
    return isVacio(valor) ? 'Campo obligatorio.' : null
}

function isUbicacionDentroUtez(latitud, longitud) {
    let interseccionesNorte = 0
    let interseccionesSur = 0
    for (let i = 0; i < COORDENADAS_UTEZ.length; i++) {
        // Obtiene un par de puntos de una recta
        let punto1 = COORDENADAS_UTEZ[i]
        let punto2 = COORDENADAS_UTEZ[i + 1 < COORDENADAS_UTEZ.length ? i + 1 : 0]

        // Establece el rango de longitudes que abarca la recta
        let longitudMenor, longitudMayor
        if (punto1[1] > punto2[1]) {
            longitudMayor = punto1[1]
            longitudMenor = punto2[1]
        } else {
            longitudMayor = punto2[1]
            longitudMenor = punto1[1]
        }

        // Evalúa si las coordenadas ingresadas corresponden a un punto dentro del rango
        if (longitud >= longitudMenor && longitud <= longitudMayor) {
            // Determina la latitud de la intersección
            let latitudInterseccion = ((punto2[0] - punto1[0]) / (punto2[1] - punto1[1])) * (longitud - punto1[1]) + punto1[0]

            // Evalúa si la intersección está al norte o al sur del punto
            if (latitudInterseccion > latitud) interseccionesNorte++
            else if (latitudInterseccion < latitud) interseccionesSur++
        }
    }

    // Determina si las coordenadas corresponden a un punto dentro de la figura a partir del número de intersecciones
    return (interseccionesNorte % 2 == 1 && interseccionesSur % 2 == 1)
}