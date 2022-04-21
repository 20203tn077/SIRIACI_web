import React, { useEffect } from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'

export default function Mapa(props) {
    const { latitud: lat, longitud: lng } = props
    const posicion = { lat, lng }
    // return (
    //     <LoadScript
    //         googleMapsApiKey='placeholder'
    //     >
    //         <GoogleMap
    //             center={posicion}
    //             zoom={10}
    //         >
    //             <Marker
    //                 position={posicion}
    //             />
    //         </GoogleMap>
    //     </LoadScript>
    // )

    useEffect(() => {
        let L = window.L
        L.mapquest.key = 'bvihSynqZybWgEyzzM75GqIAplxwF5vJ'

        var map = L.mapquest.map('map', {
            center: [lat, lng],
            layers: L.mapquest.tileLayer('map'),
            zoom: 20
        })

        L.marker([lat, lng], {
            icon: L.mapquest.icons.marker(),
            draggable: false
        }).bindPopup('').addTo(map)

        map.addControl(L.mapquest.control())
    }, [])
    return (<div id='map' style={{ width: '100%', height: 300 }} />)
}