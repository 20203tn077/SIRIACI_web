import React from 'react'
import { Container } from 'react-bootstrap'
import ListaCapsulas from '../../components/responsable/ListaCapsulas'

export default function CapsulasAdministrador() {
    return (
        <Container className='mt-md-4 mt-3'>
            <ListaCapsulas />
        </Container>
    )
}