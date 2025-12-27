import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

function ChangeView({ center }) {
    const map = useMap();
    map.setView(center, map.getZoom());
    return null;
}

const MapComponent = ({ trashCans, onSelectTrashCan, selectedTrashCan, onAddTrashCan, isAddingMode, addingLocation, onAddingLocationChange }) => {
    const [userLocation, setUserLocation] = React.useState(null);
    const [mapCenter, setMapCenter] = React.useState([37.5665, 126.9780]); // Default to Seoul City Hall
    const [showRadius, setShowRadius] = React.useState(true);

    const draggableMarkerRef = React.useRef(null);

    React.useEffect(() => {
        if (selectedTrashCan) {
            setMapCenter([selectedTrashCan.lat, selectedTrashCan.lng]);
        }
    }, [selectedTrashCan]);

    const handleFindMe = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation([latitude, longitude]);
                setMapCenter([latitude, longitude]);
                setShowRadius(true);
            },
            () => {
                alert("Unable to retrieve your location");
            }
        );
        console.log("User location:", userLocation);
    };

    const eventHandlers = React.useMemo(
        () => ({
            dragend() {
                const marker = draggableMarkerRef.current;
                if (marker != null) {
                    onAddingLocationChange(marker.getLatLng());
                }
            },
        }),
        [onAddingLocationChange],
    );

    const UserIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    const filteredTrashCans = React.useMemo(() => {
        if (!userLocation || !showRadius) return trashCans;

        return trashCans.filter(can => {
            const userLatLng = L.latLng(userLocation[0], userLocation[1]);
            const canLatLng = L.latLng(can.lat, can.lng);
            return userLatLng.distanceTo(canLatLng) <= 500;
        });
    }, [userLocation, trashCans, showRadius]);

    const MapControls = () => {
        const map = useMap();

        useMapEvents({
            click: () => {
                setShowRadius(false);
            },
        });

        const handleAddClick = () => {
            const center = map.getCenter();
            onAddTrashCan(center);
        };

        if (isAddingMode) return null;

        return (
            <div
                style={{
                    position: 'absolute',
                    bottom: '20px',
                    right: '20px',
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                }}
            >
                <button
                    onClick={handleAddClick}
                    style={{
                        padding: '10px 15px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                >
                    + Add Trash Can
                </button>
                <button
                    onClick={handleFindMe}
                    style={{
                        padding: '10px 15px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                >
                    My Location
                </button>
            </div>
        );
    };

    return (
        <div style={{ position: 'relative', height: '100%', width: '100%' }}>
            <MapContainer center={mapCenter} zoom={15} style={{ height: '100%', width: '100%' }}>
                <ChangeView center={mapCenter} />
                <MapControls />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {userLocation && (
                    <>
                        <Marker position={userLocation} icon={UserIcon}>
                            <Popup>You</Popup>
                        </Marker>
                        {/* Circle to visualize 500m radius */}
                        {showRadius && (
                            <Circle
                                center={userLocation}
                                radius={500}
                                pathOptions={{ fillColor: 'blue', fillOpacity: 0.1, color: 'blue', weight: 1 }}
                            />
                        )}
                    </>
                )}
                {!isAddingMode && filteredTrashCans.map((can) => (
                    <Marker
                        key={can.id}
                        position={[can.lat, can.lng]}
                        eventHandlers={{
                            click: () => onSelectTrashCan(can),
                        }}
                    >
                        <Popup>
                            <strong>{can.type} Trash Can</strong><br />
                            {can.description}
                        </Popup>
                    </Marker>
                ))}
                {isAddingMode && addingLocation && (
                    <Marker
                        position={addingLocation}
                        draggable={true}
                        eventHandlers={eventHandlers}
                        ref={draggableMarkerRef}
                    >
                        <Popup>Drag to adjust location</Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
};

export default MapComponent;
