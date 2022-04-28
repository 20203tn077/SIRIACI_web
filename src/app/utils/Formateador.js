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
export function getFechaCorta(tiempoJava) {
    const tiempo = new Date(tiempoJava)
    const dia = tiempo.getDate()
    const mes = tiempo.getMonth() + 1
    const anio = tiempo.getFullYear()

    return '' + (dia > 9 ? '' : '0') + dia + '/' + (mes > 9 ? '' : '0') + mes + '/' + anio
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
    return {
        id: usuario.id,
        nombre: getNombreCompleto(usuario),
        correo: usuario.correo,
        telefono: usuario.telefono,
        activo: true
    }
}

export const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
})

export function getTexto(texto) {
    return <>{texto.replace(' ', '&nbsp;').replace('\n', <br/>)}</>
}