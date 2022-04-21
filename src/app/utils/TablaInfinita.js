import React, { useContext, useEffect, useState } from 'react'
import { Spinner, Table } from 'react-bootstrap'
import InfiniteScroll from 'react-infinite-scroll-component'
import AutenticacionContext from '../components/autenticacion/AutenticacionContext'
import { alertConexion, alertError, mostrarMensaje } from './Alert'

export default function TablaInfinita(props) {
    const {contenido, setContenido, filtro, numerada, columnas, fuenteContenido, onClickElemento } = props

    const {dispatch} = useContext(AutenticacionContext)
    const [isCargando, setIsCargando] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [pagina, setPagina] = useState(2)

    useEffect(() => {
        setContenido([])
        setIsCargando(true)
        fuenteContenido(dispatch, 1, filtro ? filtro : null).then((res) => {
            const { datos: { content, last, number } } = res
            if (!res.error) {
                setContenido(content)
            } else alertError(res, 'Error al obtener los registros')
            setIsCargando(false)
        }).catch((error) => {
            setIsCargando(false)
            alertConexion()
        })
    }, [filtro])

    function cargarContenido() {
        setIsCargando(true)
        fuenteContenido(dispatch, pagina, filtro ? filtro : null).then((res) => {
            const { datos: { content, last, number } } = res
            if (!res.error) {
                setContenido([...contenido, ...content])
                setHasMore(!last)
                setPagina(pagina + 1)
            } else alertError(res, 'Error al obtener los registros')
            setIsCargando(false)
        }).catch((error) => {
            setIsCargando(false)
            alertConexion()
        })
    }

    return (
        <>
            <InfiniteScroll
                hasMore={hasMore}
                dataLength={contenido.length}
                next={cargarContenido}
            >
                <Table variant='verde' hover size='sm'>
                    <thead>
                        <tr>
                            {numerada ? <th>#</th> : null}
                            {columnas.map((columna, index) => (<th key={index}>{columna.nombre}</th>))}
                        </tr>
                    </thead>
                    <tbody>
                        {contenido.length > 0 ?
                            contenido.map((elemento, index) => (
                                <tr
                                    key={elemento.id} role='button'
                                    onClick={() => {
                                        onClickElemento(elemento.id)
                                    }}
                                >
                                    {numerada ? <td>{index + 1}</td> : null}
                                    {columnas.map((columna, index) => (<td key={index}>{columna.valor(elemento)}</td>))}
                                </tr>
                            ))
                            :
                            !isCargando ?
                                <tr>
                                    <td className='text-center' colSpan={columnas.length + (numerada ? 1 : 0)}>Sin registros</td>
                                </tr>
                                : null
                        }
                    </tbody>
                </Table>
            </InfiniteScroll>
            {isCargando ? <div className='w-100 text-center'><Spinner variant='verde' animation='border' /></div> : null}
        </>

    )
}
