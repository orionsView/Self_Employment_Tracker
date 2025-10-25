import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
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

type LatLng = [number, number];

function MapInputField(props: any) {
    // const position: [number, number] = [47.6062, -122.3321];

    const ClickHandler: React.FC<{ onSelect: (pos: LatLng) => void }> = ({ onSelect }) => {
        useMapEvents({
            click(e) {
                onSelect([e.latlng.lat, e.latlng.lng]);
            },
        });
        return null;
    };




    // useEffect(() => {
    //     console.log("markers: ", markers);
    // }, [markers]);

    // const [clickCount, setClickCount] = useState(0);

    const handleSelect = (pos: LatLng) => {
        // If both locations are set, reset both to null first
        if (props.location1 && props.location2) {
            props.setLocation1(null);
            props.setLocation2(null);
            return; // exit so next click will be treated as first point
        }

        // Otherwise, set the first empty location
        if (!props.location1) {
            props.setLocation1(pos);
        } else if (!props.location2) {
            props.setLocation2(pos);
        }
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

            {props.location1 &&
                <Marker key={`Location1-${props.location1[0]}-${props.location1[1]}`} position={props.location1}>
                    <Popup>{"Start Point"}</Popup>
                </Marker>
            }

            {props.location2 &&
                <Marker key={`Location2-${props.location2[0]}-${props.location2[1]}`} position={props.location2}>
                    <Popup>{"End Point"}</Popup>
                </Marker>
            }

        </MapContainer>
    );


}

export default MapInputField