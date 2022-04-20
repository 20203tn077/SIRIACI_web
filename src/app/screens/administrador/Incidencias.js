import React from 'react'
import { Container } from 'react-bootstrap'
import ListaIncidencias from '../../components/administrador/ListaIncidencias'

export default function IncidenciasAdministrador() {
    return (
        <Container className='mt-md-4 mt-3'>
            <ListaIncidencias />
        </Container>
    )
}