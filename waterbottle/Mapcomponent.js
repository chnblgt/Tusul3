import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const locations = [
  {
    name: "School A",
    description: "Football & Basketball clubs",
    coords: [47.9057, 106.8832],
  },
  {
    name: "School B",
    description: "Music & Art clubs",
    coords: [47.8750, 106.9200],
  },
  {
    name: "Nest IT school",
    description: "IT, science clubs",
    coords: [47.923601929349694, 106.9203479470609],
  },
];

export default function MapComponent() {
  useEffect(() => {
    // Must run on client only, inside useEffect — not just guarded by typeof window
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  return (
    <div style={{ width: "100%", height: "500px", border: "1px solid #ccc" }}>
      <MapContainer
        center={[47.8864, 106.9057]}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {locations.map((loc, i) => (
          <Marker key={i} position={loc.coords}>
            <Popup>
              <div>
                <p style={{ fontWeight: "bold", margin: "0 0 4px" }}>{loc.name}</p>
                <p style={{ margin: 0 }}>{loc.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}