import React from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import Imagen from './Imagen'

export default function Informacion(props) {
    const { nombre, valor } = props
    return (
        <>
            {nombre ? <Form.Label>{nombre}:</Form.Label> : null}
            <br />
            <Form.Label className='text-dark w-100'>{valor}</Form.Label>
        </>
    )
}

export function ListaImagenes(props) {
    const { imagenes, eventoPreImagen, eventoPostImagen } = props
    return (
        <Row className='g-3'>
            {imagenes.map((imagen, index) => (
                <Col xs={12} sm={6} md={4} key={index}>
                    <Imagen source={imagen.imagen} eventoPreImagen={eventoPreImagen} eventoPostImagen={eventoPostImagen}/>
                </Col>
            ))}
        </Row>
    )
}
