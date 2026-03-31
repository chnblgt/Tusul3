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
  if (typeof window !== "undefined") {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }

  return (
    <div className="w-full h-[500px] border border-gray-400">
      <MapContainer
        center={[47.8864, 106.9057]}
        zoom={12}
        className="h-full w-full"
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((loc, i) => (
          <Marker key={i} position={loc.coords}>
            <Popup>
              <div>
                <p className="font-bold">{loc.name}</p>
                <p>{loc.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}