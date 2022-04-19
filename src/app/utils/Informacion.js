import React from 'react'
import { Form } from 'react-bootstrap'

export default function Informacion(props) {
    const {nombre, valor} = props
    return (
        <>
            {nombre ? <Form.Label>{nombre}:</Form.Label> : null}
            <br/>
            <Form.Label className='text-dark w-100'>{valor}</Form.Label>
        </>
    )
}
