import React, { useEffect } from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'

export default function Mapa(props) {
    const { latitud: lat, longitud: lng } = props
    const posicion = { lat, lng }

    return (
        <LoadScript
            googleMapsApiKey="AIzaSyCtjaWdNex6PeIhqPYVOTjEsJi3GluBpgQ"
        >
            <GoogleMap
                id="marker-example"
                mapContainerStyle={{
                    height: "350px",
                    width: "auto"
                }}
                zoom={20}
                center={{lat, lng}}
            >
                <Marker
                    position={{lat, lng}}
                />
            </GoogleMap>
        </LoadScript>
    )

    // MAPA SIN GOOGLE MAPS
    //
    // useEffect(() => {
    //     let L = window.L
    //     L.mapquest.key = 'bvihSynqZybWgEyzzM75GqIAplxwF5vJ'

    //     var map = L.mapquest.map('map', {
    //         center: [lat, lng],
    //         layers: L.mapquest.tileLayer('map'),
    //         zoom: 20
    //     })

    //     L.marker([lat, lng], {
    //         icon: L.mapquest.icons.marker(),
    //         draggable: false
    //     }).bindPopup('').addTo(map)

    //     map.addControl(L.mapquest.control())
    // }, [])
    // return (<div id='map' style={{ width: '100%', height: 300 }} />)
}