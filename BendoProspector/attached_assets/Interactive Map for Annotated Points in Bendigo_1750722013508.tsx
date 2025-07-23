
import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Sample points of interest extracted from the provided image annotations
const pointsOfInterest = [
  { id: 1, name: "Red White & Blue Extended Shaft", position: [-36.7606, 144.2831] },
  { id: 2, name: "Casley's Red White & Blue Syncline", position: [-36.7645, 144.2878] },
  { id: 3, name: "Dead Cat Gully", position: [-36.7734, 144.3012] },
  { id: 4, name: "Coyle & Boyles Shaft", position: [-36.7702, 144.2958] },
  { id: 5, name: "Great Southern Garden Gully", position: [-36.7681, 144.2849] },
  // Add more points based on your annotated image data
];

function InteractiveBendigoMap() {
  const [activePoint, setActivePoint] = useState(null);

  return (
    <div className="h-screen w-full">
      <MapContainer
        center={[-36.7589, 144.2782]} // Center on Bendigo
        zoom={14}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        {/* Google Earth imagery via tile layer */}
        <TileLayer
          url="https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
          subdomains={["mt0", "mt1", "mt2", "mt3"]}
          attribution="&copy; <a href='https://www.google.com/earth/' target='_blank'>Google Earth</a>"
        />

        {/* Annotated Points of Interest */}
        {pointsOfInterest.map((point) => (
          <Marker
            key={point.id}
            position={point.position}
            eventHandlers={{
              click: () => setActivePoint(point),
            }}
          />
        ))}

        {/* Popup for Active Point */}
        {activePoint && (
          <Popup
            position={activePoint.position}
            onClose={() => setActivePoint(null)}
          >
            <div>
              <h3 className="font-bold">{activePoint.name}</h3>
              <p className="text-sm">Latitude: {activePoint.position[0]}</p>
              <p className="text-sm">Longitude: {activePoint.position[1]}</p>
            </div>
          </Popup>
        )}
      </MapContainer>
    </div>
  );
}

export default InteractiveBendigoMap;
