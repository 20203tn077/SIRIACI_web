import React from 'react'
import { Container } from 'react-bootstrap'
import ListaCapsulas from '../../components/administrador/ListaCapsulas'

export default function CapsulasAdministrador() {
    return (
        <Container className='mt-5'>
            <ListaCapsulas />
        </Container>
    )
}