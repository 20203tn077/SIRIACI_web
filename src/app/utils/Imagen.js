import React from 'react'
import { Button, Image } from 'react-bootstrap'
import * as Icon from 'react-feather'
import { alertImagen } from './Alert'

export default function Imagen(props) {
    const { source, eventoEliminar, eventoPreImagen, eventoPostImagen } = props
    return (
        <div className="position-relative overlay-container" role='button' onClick={eventoEliminar ? () => {eventoEliminar(source)} : () => {alertImagen(`data:image/png;base64,${source}`, eventoPostImagen, eventoPreImagen)}}>
            <Image className='img-thumbnail' style={{ width: '100%', height: 150, objectFit: 'cover' }} src={`data:image/png;base64,${source}`} />
            <div className='overlay img-thumbnail position-absolute top-50 start-50 translate-middle' style={{ width: '100%', height: 150 }}>
                <div className='bg-dark w-100, h-100' />
            </div>
            {eventoEliminar ?
                <Icon.Trash2 className='overlay-icon position-absolute top-50 start-50 translate-middle fw-bold text-white' size={30} />
                :
                <Icon.Maximize2 className='overlay-icon position-absolute top-50 start-50 translate-middle fw-bold text-white' size={30} />
            }
        </div >
    )
}
