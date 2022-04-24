import React from 'react'
import { Container, Image, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { Link, NavLink } from 'react-router-dom'
import * as Icon from 'react-feather' 
import Logo from '../../assets/img/SGA_hoja.svg'

export default function NavInvitado() {
    return (
        <Navbar bg='azul-dark' expand='lg' variant='dark' className='sticky-top shadow'>
            <Container fluid className='overflow-hidd'>
                <Navbar.Brand as={Link} to={'/'}><Image src={Logo} fluid style={{height: 24}} className='me-2'/><span className='align-middle'>SIRIACI</span><span className='align-middle d-none d-md-inline'> | Sistema de Reporte de Incidencias Ambientales y Cápsulas Informativas</span></Navbar.Brand>
                <Nav className='ms-auto'>
                <Nav.Link active>
                {/* <Icon.Info/> */}
                </Nav.Link>
                    
                </Nav>
            </Container>
        </Navbar >
    )
}
