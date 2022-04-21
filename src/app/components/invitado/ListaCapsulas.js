import React, { useContext, useEffect, useRef, useState } from 'react'
import { Row, Spinner } from 'react-bootstrap' 
import InfiniteScroll from 'react-infinite-scroll-component'
import { alertConexion, alertError, mostrarMensaje } from '../../utils/Alert'
import { CapsulasPublico } from '../../utils/Conexion'
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
        CapsulasPublico.obtenerCapsulas(dispatch, 1).then((res) => {
            const { datos: { content} } = res
            if (!res.error) {
                setCapsulas(content)
            } else alertError(res, 'Error al obtener las cápsulas')
            setIsCargando(false)
        }).catch((error) => {
            setIsCargando(false)
            .catch(alertConexion)
        })
    }, [])

    function cargarCapsulas() {
        setIsCargando(true)
        CapsulasPublico.obtenerCapsulas(dispatch, pagina).then((res) => {
            const { datos: { content, last } } = res
            if (!res.error) {
                setCapsulas([...capsulas, ...content])
                setHasMore(!last)
                setPagina(pagina + 1)
            } else alertError(res, 'Error al obtener las cápsulas')
            setIsCargando(false)
        }).catch((error) => {
            setIsCargando(false)
            .catch(alertConexion)
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
