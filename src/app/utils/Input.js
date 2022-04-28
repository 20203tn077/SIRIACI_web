import React from 'react'
import { Badge, Col, Form, Row } from 'react-bootstrap'
import Imagen from './Imagen'

export default function Input(props) {
    const { nombre, referencia, error, placeholder, tipo, valorName, eventoInput, valorInicial, min, max, maxlength, obligatorio, accept, multiple } = props
    return (
        <>
            {nombre ? <Form.Label>{nombre}:{obligatorio ? ' *' : null}</Form.Label> : null}
            <Form.Control onInput={eventoInput} name={valorName} ref={referencia} type={tipo} placeholder={placeholder} defaultValue={valorInicial} min={min} max={max} maxLength={maxlength} multiple={multiple} accept={accept} />
            {error ? <span className='error'>{error}</span> : null}
        </>
    )
}

export function InputImg(props) {
    const { nombre, referencia, error, valorName, imagenes, obligatorio, multiple, eventoSubida, eventoEliminar } = props
    return (
        <>
            {nombre ? <Form.Label>{nombre}:{obligatorio ? ' *' : null}</Form.Label> : null}
            {imagenes && imagenes.length > 0 ? (
                <Row className='g-3 mb-2'>
                    {imagenes.map((imagen, index) => (
                        <Col xs={12} sm={6} md={4} key={index}>
                            <Imagen eventoEliminar={() => { eventoEliminar(index) }} source={imagen.imagen} />
                        </Col>
                    ))}
                </Row>
            ) : null}
            <Form.Control type='file' onChange={eventoSubida} name={valorName} ref={referencia} multiple={multiple} accept='image/*' />
            {error ? <span className='error'>{error}</span> : null}
        </>
    )
}
export function CheckSet(props) {
    const { nombre, datos, error, obligatorio } = props
    return (
        <>
            {nombre ? <Form.Label>{nombre}:{obligatorio ? ' *' : null}</Form.Label> : null}
            {datos.map(({opcion, id}, index) => (
                    <Form.Check
                        key={index}
                        type='checkbox'
                        label={opcion}
                        id={id}
                    />
            ))}
            {error ? <span className='error'>{error}</span> : null}
        </>
    )
}

export function TextArea(props) {
    const { nombre, referencia, error, valorName, eventoInput, valorInicial, obligatorio, rows } = props
    return (
        <>
            {nombre ? <Form.Label>{nombre}:{obligatorio ? ' *' : null}</Form.Label> : null}
            <Form.Control as='textarea' onInput={eventoInput} name={valorName} ref={referencia} defaultValue={valorInicial} rows={rows} />
            {error ? <span className='error'>{error}</span> : null}
        </>
    )
}

export function Select(props) {
    const { nombre, referencia, error, opciones, valorInicial, eventoChange, obligatorio } = props
    return (
        <>
            {nombre ? <Form.Label>{nombre}:{obligatorio ? ' *' : null}</Form.Label> : null}
            <Form.Select onChange={eventoChange} ref={referencia} defaultValue={valorInicial}>
                <option value=''>Selecciona una opción...</option>
                {opciones.map((opcion, index) => (
                    <option key={index} value={opcion.id} >{opcion.nombre}</option>
                ))}
            </Form.Select>
            {error ? <span className='error'>{error}</span> : null}
        </>
    )
}

export function Pill(props) {
    const { referenciaUtez, referenciaExterna, referenciaEstudiante, referenciaAdministrador, referenciaResponsable, referenciaAdministradorB, referenciaResponsableB, errorAdministrador, errorResponsable, valorInicial, eventoAdministrador, eventoResponsable, modificable } = props
    return (
        <>
            <Form.Label>Roles:</Form.Label>
            <Row className='g-2'>
                <Col xs='auto' ref={referenciaUtez} style={{ display: valorInicial ? (valorInicial.utez ? 'block' : 'none') : 'none' }}>
                    <Badge bg='verde'>Comunidad UTEZ</Badge>
                </Col>
                <Col xs='auto' ref={referenciaExterna} style={{ display: valorInicial ? (valorInicial.utez ? 'none' : 'block') : 'none' }}>
                    <Badge bg='verde'>Comunidad Externa</Badge>
                </Col>
                <Col xs='auto' ref={referenciaEstudiante} style={{ display: valorInicial ? (valorInicial.estudiante ? 'block' : 'none') : 'none' }}>
                    <Badge bg='verde'>Estudiante</Badge>
                </Col>
                <Col xs='auto' ref={referenciaAdministrador} style={{ display: valorInicial ? (valorInicial.utez ? 'block' : 'none') : 'none' }}>
                    <Badge onClick={eventoAdministrador} ref={referenciaAdministradorB} bg={valorInicial.administrador ? 'verde' : 'secondary'} role={modificable ? 'button' : null} >Administrador</Badge>
                </Col>
                <Col xs='auto' ref={referenciaResponsable} style={{ display: valorInicial ? (valorInicial.utez ? 'block' : 'none') : 'none' }}>
                    <Badge onClick={eventoResponsable} ref={referenciaResponsableB} bg={valorInicial.responsable ? 'verde' : 'secondary'} role={modificable ? 'button' : null} >Responsable de aspecto</Badge>
                </Col>
            </Row>
            {errorAdministrador ? <span className='error'>{errorAdministrador}</span> : null}
            {errorAdministrador && errorResponsable ? <br /> : null}
            {errorResponsable ? <span className='error'>{errorResponsable}</span> : null}
        </>
    )
}