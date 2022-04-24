import React, { useContext } from 'react'
import { Container, Image, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import * as Icon from 'react-feather'
import Logo from '../../assets/img/SGA_hoja.svg'
import AutenticacionContext from '../components/autenticacion/AutenticacionContext'
import { seleccionarRol } from '../utils/Alert'

export default function NavAutenticado() {
    const navigate = useNavigate()
    const { dispatch, sesion: { rolActivo, multiRol, correo } } = useContext(AutenticacionContext)

    return (
        <Navbar bg='azul-dark' expand='lg' variant='dark' className='sticky-top shadow'>
            <Container fluid>
                <Navbar.Brand as={Link} to='/'><Image src={Logo} fluid style={{ height: 24 }} className='me-2' /><span style={{ verticalAlign: 'middle' }}>SIRIACI</span></Navbar.Brand>
                <Navbar.Toggle aria-controls='basic-navbar-nav' />
                <Navbar.Collapse id='basic-navbar-nav'>
                    <Nav className='me-auto'>
                        {rolActivo === 'ROLE_ADMINISTRADOR' ? <Nav.Link as={NavLink} to={'/usuarios'}>Usuarios</Nav.Link> : null}
                        <Nav.Link as={NavLink} to={'/incidencias'}>Incidencias ambientales</Nav.Link>
                        <Nav.Link as={NavLink} to={'/capsulas'}>Cápsulas informativas</Nav.Link>
                    </Nav>
                    <Nav className='d-flex'>
                        <NavDropdown title={correo} active>
                            {/* <NavDropdown.Item to={'/perfil'} as={Link}><Icon.User size={18} className='me-2' /><span style={{ verticalAlign: 'middle' }}>Perfíl</span></NavDropdown.Item> */}
                            {multiRol ? <NavDropdown.Item onClick={() => { seleccionarRol(dispatch, navigate) }}><Icon.ToggleLeft size={18} className='me-2' /><span style={{ verticalAlign: 'middle' }}>Cambiar rol</span></NavDropdown.Item> : null}
                            <NavDropdown.Item onClick={() => {
                                dispatch({ tipo: 'CERRAR SESION' })
                                navigate('/')
                            }}><Icon.LogOut size={18} className='me-2' /><span style={{ verticalAlign: 'middle' }}>Salir</span></NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar >
    )
}
