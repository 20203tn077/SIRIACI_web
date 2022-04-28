import React from 'react'
import { Container } from 'react-bootstrap'
import ListaUsuarios from '../../components/administrador/ListaUsuarios'

export default function Usuarios() {
    return (
        <Container className='mt-md-4 mt-3'>
            <ListaUsuarios />
        </Container>
    )
}