export function getFecha(tiempoJava) {
    const tiempo = new Date(tiempoJava)
    let mes
    switch (tiempo.getMonth()) {
        case 0: mes = 'enero'
            break
        case 1: mes = 'febrero'
            break
        case 2: mes = 'marzo'
            break
        case 3: mes = 'abril'
            break
        case 4: mes = 'mayo'
            break
        case 5: mes = 'junio'
            break
        case 6: mes = 'julio'
            break
        case 7: mes = 'agosto'
            break
        case 8: mes = 'septiembre'
            break
        case 9: mes = 'octubre'
            break
        case 10: mes = 'noviembre'
            break
        case 11: mes = 'diciembre'
            break
    }
    return '' + tiempo.getDate() + ' de ' + mes + ' de ' + tiempo.getFullYear()
}
export function getHora(tiempoJava) {
    const tiempo = new Date(tiempoJava)
    return '' + tiempo.getHours() + ':' + tiempo.getMinutes()
}
export function getFechaYHora(tiempoJava) {
    const tiempo = new Date(tiempoJava)
    return getFecha(tiempoJava) + ' a la' + (tiempo.getHours() != 1 ? 's' : '') + ' ' + getHora(tiempoJava)
}
export function getNombreCompleto(persona) {
    const { nombre, apellido1, apellido2 } = persona
    return nombre + ' ' + apellido1 + (apellido2 ? ' ' + apellido2 : '')
}
export function getUsuarioLista(usuario) {
    
}