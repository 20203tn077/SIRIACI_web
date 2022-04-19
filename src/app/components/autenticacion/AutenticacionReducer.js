import React from 'react'

export default function autenticacionReducer(estado = {}, accion) {
    switch (accion.tipo) {
        case 'INICIAR SESION':
            return {
                ...accion.datos,
                autenticado: true,
                multiRol: accion.datos.roles.length > 2
            }
        case 'CERRAR SESION':
            return {
                autenticado: false
            }
        case 'SELECCIONAR ROL':
            return {
                ...estado,
                rolActivo: accion.datos.rolActivo
            }
        case 'ROL POR DEFECTO':
            return {
                ...estado,
                rolActivo : estado.roles.filter((rol) => rol.authority !== 'ROLE_USUARIO')[0].authority
            }
        default:
            throw new Error('Acción inválida')
    }
}
