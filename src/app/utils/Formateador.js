export function getFecha(tiempoJava) {
    const tiempo = new Date(tiempoJava)
    return '' + tiempo.getDate() + ' de ' + ({
        0: 'enero',
        1: 'febrero',
        2: 'marzo',
        3: 'abril',
        4: 'mayo',
        5: 'junio',
        6: 'julio',
        7: 'agosto',
        8: 'septiembre',
        9: 'octubre',
        10: 'noviembre',
        11: 'diciembre'
    })[tiempo.getMonth()] + ' de ' + tiempo.getFullYear()
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
    return getFecha(tiempoJava) + ' a la' + (tiempo.getHours() !== 1 ? 's' : '') + ' ' + getHora(tiempoJava)
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