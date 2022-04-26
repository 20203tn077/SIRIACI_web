import React, { useContext, useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate, HashRouter } from 'react-router-dom'
import AutenticacionContext from '../components/autenticacion/AutenticacionContext'
import Usuarios from '../screens/administrador/Usuarios'
import InicioSesion from '../screens/invitado/InicioSesion'
import NavAutenticado from './NavAutenticado'
import NavInvitado from './NavInvitado'
import IncidenciasAdministrador from '../screens/administrador/Incidencias'
import CapsulasAdministrador from '../screens/administrador/Capsulas'
import IncidenciasResponsable from '../screens/responsable/Incidencias'
import CapsulasResponsable from '../screens/responsable/Capsulas'
import Alert, { seleccionarRol } from '../utils/Alert'
import None from '../screens/None'
import Verificacion from '../screens/invitado/Verificacion'
import Redirect from './Redirect'
import SolicitudRestablecimiento from '../screens/invitado/SolicitudRestablecimiento'
import VerificacionCodigo from '../screens/invitado/VerificacionCodigo'
import RestablecimientoContrasena from '../screens/invitado/RestablecimientoContrasena'

export default function AppRouter() {
    const { sesion: { autenticado, rolActivo, multiRol }, dispatch } = useContext(AutenticacionContext)
    useEffect(() => {
        if (autenticado && !rolActivo) {
            if (multiRol) seleccionarRol(dispatch, null, true)
            else {
                dispatch({ tipo: 'ROL POR DEFECTO' })
                Alert.close()
            }
        }
    })
    return (
        <Router>
            {autenticado ? <>
                {rolActivo ? <>
                    <NavAutenticado />
                </> : <>
                    <NavInvitado />
                </>}
            </> : <>
                <NavInvitado />
            </>}
            <Routes>
                {autenticado ? <>
                    {rolActivo ? <>
                        {({
                            'ROLE_ADMINISTRADOR':
                                <>
                                    <Route path='/' element={<Redirect/>} />
                                    <Route path='/usuarios' element={<Usuarios />} />
                                    <Route path='/incidencias' element={<IncidenciasAdministrador />} />
                                    <Route path='/capsulas' element={<CapsulasAdministrador />} />
                                </>,
                            'ROLE_RESPONSABLE':
                                <>
                                    <Route path='/' element={<Redirect/>} />
                                    <Route path='/incidencias' element={<IncidenciasResponsable/>} />
                                    <Route path='/capsulas' element={<CapsulasResponsable/>} />
                                </>
                        })[rolActivo] || null}
                    </> : <>
                    <Route path='/' element={<div/>} />
                    </>}
                </> : <>
                    <Route path='/' element={<InicioSesion />} />
                    <Route path='/restablecimiento/solicitud' element={<SolicitudRestablecimiento/>} />
                    <Route path='/restablecimiento/verificacion' element={<VerificacionCodigo/>} />
                    <Route path='/restablecimiento/contrasena' element={<RestablecimientoContrasena/>} />
                </>}
                <Route path='/verificacion/' element={<Verificacion />} />
                <Route path='*' element={<None />} />
            </Routes>
        </Router>
    )
}
