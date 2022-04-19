import React, { useContext, useEffect, useRef, useState } from 'react'
import { Row, Spinner } from 'react-bootstrap' 
import InfiniteScroll from 'react-infinite-scroll-component'
import { mostrarMensaje } from '../../utils/Alert'
import { Conexion } from '../../utils/Conexion' 
import AutenticacionContext from '../autenticacion/AutenticacionContext' 
import Capsula from './Capsula' 

export default function ListaCapsulas({ parent }) {
    const {dispatch} = useContext(AutenticacionContext)
    const [isCargando, setIsCargando] = useState(false)
    const [capsulas, setCapsulas] = useState([])
    const [hasMore, setHasMore] = useState(true)
    const [pagina, setPagina] = useState(2)

    useEffect(() => {
        setIsCargando(true)
        Conexion.CapsulasPublico.obtenerCapsulas(dispatch, 1).then((res) => {
            const { datos: { content} } = res
            if (!res.error) {
                setCapsulas(content)
            } else mostrarMensaje('Error al obtener las cápsulas', res.mensajeGeneral, 'error')
            setIsCargando(false)
        }).catch((error) => {
            setIsCargando(false)
            .catch((error) => mostrarMensaje('Error de conexión', 'No fue posible establecer conexión con el servidor.', 'error'))
        })
    }, [])

    function cargarCapsulas() {
        setIsCargando(true)
        Conexion.CapsulasPublico.obtenerCapsulas(dispatch, pagina).then((res) => {
            const { datos: { content, last } } = res
            if (!res.error) {
                setCapsulas([...capsulas, ...content])
                setHasMore(!last)
                setPagina(pagina + 1)
            } else mostrarMensaje('Error al obtener las cápsulas', res.mensajeGeneral, 'error')
            setIsCargando(false)
        }).catch((error) => {
            setIsCargando(false)
            .catch((error) => mostrarMensaje('Error de conexión', 'No fue posible establecer conexión con el servidor.', 'error'))
        })
    }

    return (
        <>
            <Row as={InfiniteScroll}
                className='g-3 w-100 py-3 m-0'
                hasMore={hasMore}
                dataLength={capsulas.length}
                next={cargarCapsulas}
            >
                <h4 className='text-white mb-0 text-center'>Cápsulas informativas</h4>
                {capsulas.map((capsula, index) => (
                    <Capsula key={index} datos={capsula} />
                ))}
            </Row>
            {isCargando ? <div className='w-100 text-center mb-4'><Spinner variant='white' animation='border' /></div> : null}
        </>

    )
}
