import {  Document, Font, Image, Page,  Text, View } from '@react-pdf/renderer'
import React from 'react'
import logoUtez from '../../assets/img/UTEZ_logo_reporte.png'
import logoSga from '../../assets/img/SGA_logo_reporte.png'
import { getFecha, getFechaCorta } from './Formateador'
import Tema from './Tema'
import OpenSans from '../../assets/font/open-sans-v28-latin-regular.ttf'
import OpenSansBold from '../../assets/font/open-sans-v28-latin-700.ttf'
import Lato from '../../assets/font/lato-v23-latin-regular.ttf'
import LatoBold from '../../assets/font/lato-v23-latin-700.ttf'

export default function Documento(props) {
    const {datos: {aspectos, fechaInicio, fechaFin, datos}} = props
    return (
        <Document>
            <Page
                style={{
                    paddingHorizontal: '1.5cm',
                    paddingTop: '0.75cm',
                    paddingBottom: '1.75cm',
                    fontFamily: 'Lato'
                }}
                size='LETTER'
            >
                <View
                    fixed
                    style={{
                        flexDirection: 'row',
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '0.5cm'
                    }}
                >
                    <Image style={{ width: 80, height: 41 }} src={logoUtez} />
                    <Text style={{ fontWeight: 'bold', color: Tema.azulDark, fontSize: 24 }}>REPORTE GENERAL</Text>
                    <Image style={{ width: 91, height: 21 }} src={logoSga} />
                </View>
                <View style={{ fontSize: 12, color: Tema.azulDark, marginBottom: '0.5cm', fontWeight: 'bold' }}>
                    <Text>{`Incidencias del ${getFecha(fechaInicio.replace('-','/'))} al ${getFecha(fechaFin.replace('-','/'))}`}</Text>
                    <View style={{ backgroundColor: Tema.azulDark, height: 1.5, marginVertical: 2 }} />
                    <Text>{`Aspecto${aspectos.length > 1 ? 's:      ' : ': '}${aspectos.length > 1 ? aspectos.map((aspecto) => `•  ${aspecto}`).join('        ') : aspectos[0]}`}</Text>
                    <View style={{ backgroundColor: Tema.azulDark, height: 1.5, marginVertical: 2 }} />
                    <Text>{`Información actualizada al ${getFecha(Date())}`}</Text>
                    <View style={{ backgroundColor: Tema.azulDark, height: 1.5, marginTop: 2 }} />
                </View>
                <Tabla>
                    <Fila header>
                        <Columna header columna={1}>Fecha</Columna>
                        <Columna header columna={2}>Aspecto</Columna>
                        <Columna header columna={3}>Descripción</Columna>
                        <Columna header columna={4}>Estado</Columna>
                    </Fila>
                    {datos.map((fila, index) => (
                        <Fila key={index} indice={index}>
                            <Columna columna={1}>{getFechaCorta(fila.tiempoIncidencia)}</Columna>
                            <Columna columna={2}>{fila.aspecto}</Columna>
                            <Columna columna={3}>{fila.descripcion}</Columna>
                            <Columna columna={4}>{fila.estado.nombre}</Columna>
                        </Fila>
                    ))}
                    {datos.length === 0 ? <Fila indice={0}>
                            <Columna columna={0}>Sin registros</Columna>
                        </Fila> : null}
                </Tabla>
                <Text
                    style={{
                        fontSize: 12,
                        textAlign: 'center',
                        position: 'absolute',
                        bottom: 20,
                        left: 0,
                        right: 0
                    }}
                    fixed
                    render={({ pageNumber, totalPages }) => (
                        `Página ${pageNumber} de ${totalPages}`
                    )}
                />
            </Page>
        </Document>
    )
}


function Tabla(props) {
    const { children } = props
    return (
        <View
            style={{ fontSize: 12 }}
        >
            {children}
        </View>
    )
}
function Fila(props) {
    const { children, header, indice } = props
    return (
        <View
            fixed={header}
            wrap={false}
            style={{
                borderBottomWidth: !header ? 0.75 : null,
                flexDirection: 'row',
                color: header ? '#fff' : null,
                backgroundColor: header ? Tema.azulDark : (indice % 2 === 1 ? '#F1F4F8' : null),
                borderColor: '#BBCADD',
                fontWeight: header ? 800 : 200
            }}
        >
            {children}
        </View>
    )
}
function Columna(props) {
    const { children, columna, header } = props
    return (
        <View
            style={{
                width: ({
                    0: '100%',
                    1: '15%',
                    2: '20%',
                    3: '50%',
                    4: '15%'
                })[columna],
                textAlign: header ? 'center' : ({
                    0: 'center',
                    1: 'center',
                    2: 'center',
                    3: 'left',
                    4: 'center'
                })[columna],
                padding: header ? 8 : 5
            }}
        >
            <Text>
                {children}
            </Text>
        </View>
    )
}

Font.register({
    family: "OpenSans",
    fonts: [
        {
            src: OpenSans,
            fontWeight: 400,
        },
        {
            src: OpenSansBold,
            fontWeight: 700,
        },
    ]
})
Font.register({
    family: "Lato",
    fonts: [
        {
            src: Lato,
            fontWeight: 400,
        },
        {
            src: LatoBold,
            fontWeight: 700,
        },
    ]
})
// function (props) {
//     const {children} = props
//     return(
//         <View>{children}</View>
//     )
// }