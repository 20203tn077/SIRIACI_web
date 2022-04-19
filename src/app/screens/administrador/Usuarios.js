import React, { useEffect } from 'react'
import { Container } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import ListaUsuarios from '../../components/administrador/ListaUsuarios'

export default function Usuarios() {
    const navigate = useNavigate()
    useEffect(() => {
        navigate('/usuarios')
    }, [])
    return (
        <Container className='mt-5'>
            <ListaUsuarios />
        </Container>
    )
}