import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import L from "leaflet";

// Fix marker icons (important for Vite, React, or CRA)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function MapInputField() {
    // const position: [number, number] = [47.6062, -122.3321];
    type LatLng = [number, number];

    const ClickHandler: React.FC<{ onSelect: (pos: LatLng) => void }> = ({ onSelect }) => {
        useMapEvents({
            click(e) {
                onSelect([e.latlng.lat, e.latlng.lng]);
            },
        });
        return null;
    };


    const [markers, setMarkers] = useState<LatLng[]>([]);

    const handleSelect = (pos: LatLng) => {
        setMarkers((prev) => {
            if (prev.length >= 2) {
                // Reset if already have two
                return [pos];
            }
            return [...prev, pos];
        });
    };

    return (
        <MapContainer
            center={[47.6062, -122.3321]} // Seattle
            zoom={6}
            style={{
                height: "400px",
                width: "100%",
                borderRadius: "1rem",
                touchAction: "none", // helps on mobile
            }}
            scrollWheelZoom={true}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">
              OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ClickHandler onSelect={handleSelect} />

            {markers.map((pos, idx) => (
                <Marker key={idx} position={pos}>
                    <Popup>{idx === 0 ? "Start Point" : "End Point"}</Popup>
                </Marker>
            ))}
        </MapContainer>
    );


}

export default MapInputField