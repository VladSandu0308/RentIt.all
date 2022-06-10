import React, {useState, useMemo, useEffect} from 'react'

import Map, {Marker, Popup, useMap} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { server } from '../services/axios';
import { format } from 'react-string-format';

const CustomMap = ({coords}) => {

  let center={latitude: 46, longitude: 26, zoom: 5};

  if (coords) {
    center = {longitude: coords[0], latitude:coords[1], zoom: 9}
  }


  const mapboxAccessToken='pk.eyJ1IjoidmxhZHNhbmR1MDMwOCIsImEiOiJjbDM0N2d3MXAwMWQ2M2ttcHAwcGtlN3VrIn0.SCkcnJh088BuTh7CHNpfhw';

  return (
    <Map initialViewState={center} style={{width: '100%', height: '100%'}} mapStyle="mapbox://styles/mapbox/streets-v9"  mapboxAccessToken={mapboxAccessToken}>
      
      {
        coords && (
          <Marker longitude={coords[0]} latitude={coords[1]} color="red" />
        )
      }

      
    </Map>
  )
}

export default CustomMap