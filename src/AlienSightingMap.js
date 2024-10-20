import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';

// Leaflet marker icon fix (Leaflet doesn't auto-load the default icon properly in React apps)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const AlienSightingMap = ({ latitude, longitude, onMarkerDragEnd }) => {
    const [position, setPosition] = useState([latitude, longitude]);

    useEffect(() => {
        if (latitude && longitude) {
            setPosition([latitude, longitude]);
        }
    }, [latitude, longitude]);

    const handleMarkerDragEnd = (event) => {
        const { lat, lng } = event.target.getLatLng();
        setPosition([lat, lng]); // Update local state
        onMarkerDragEnd({ latitude: lat, longitude: lng }); // Call the parent function with the new coordinates
    };

    return (
        <MapContainer
            center={position}
            zoom={15}
            style={{ height: '200px', width: '100%', marginTop: '20px' }}
        >
            {/* TileLayer: Fetches tiles from OpenStreetMap */}
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {/* Draggable Marker for the user's location */}
            <Marker
                position={position}
                draggable={true}
                eventHandlers={{
                    dragend: handleMarkerDragEnd,
                }}
            />
        </MapContainer>
    );
};

export default AlienSightingMap;
