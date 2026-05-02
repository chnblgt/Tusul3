import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const UB_CENTER = [47.8864, 106.9057];

function fixLeafletIcons() {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}

function makeClubIcon() {
  return L.divIcon({
    className: "",
    html: `<div style="
      width:28px;height:28px;border-radius:50% 50% 50% 0;
      background:linear-gradient(135deg,#7c3aed,#4c1d95);
      border:2.5px solid #fff;
      box-shadow:0 2px 8px rgba(124,58,237,0.5);
      transform:rotate(-45deg);
    "></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -30],
  });
}

function makePickIcon() {
  return L.divIcon({
    className: "",
    html: `<div style="
      width:32px;height:32px;border-radius:50% 50% 50% 0;
      background:linear-gradient(135deg,#ef4444,#b91c1c);
      border:3px solid #fff;
      box-shadow:0 2px 10px rgba(239,68,68,0.6);
      transform:rotate(-45deg);
    "></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -34],
  });
}
function ClickPicker({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function MapComponent({
  pickMode = false,
  onPick,
  pickedLat,
  pickedLng,
  clubs: clubsProp,
  center,
  zoom,
  height = "100%",
}) {
  const [clubs, setClubs] = useState([]);
  const [iconsReady, setIconsReady] = useState(false);

  useEffect(() => {
    fixLeafletIcons();
    setIconsReady(true);
  }, []);

  useEffect(() => {
    if (clubsProp !== undefined) {
      setClubs(clubsProp);
      return;
    }
    fetch(`${API}/clubs`, { headers: { "ngrok-skip-browser-warning": "true" } })
      .then(r => r.json())
      .catch(() => ({ success: false }))
      .then(data => {
        if (data?.success && data.clubs) {
          setClubs(data.clubs.filter(c => c.lat && c.lng));
        }
      });
  }, [clubsProp]);

  if (!iconsReady) return null;

  const mapCenter = center || (
    pickedLat && pickedLng ? [pickedLat, pickedLng] : UB_CENTER
  );
  const mapZoom = zoom || (pickMode ? 13 : 12);

  const clubIcon = makeClubIcon();
  const pickIcon = makePickIcon();

  return (
    <div style={{ width: "100%", height }}>
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
        cursor={pickMode ? "crosshair" : undefined}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {pickMode && onPick && <ClickPicker onPick={onPick} />}
        {pickMode && pickedLat && pickedLng && (
          <Marker position={[pickedLat, pickedLng]} icon={pickIcon}>
            <Popup>
              <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "13px" }}>
                <strong>Selected location</strong><br />
                {pickedLat.toFixed(5)}, {pickedLng.toFixed(5)}
              </div>
            </Popup>
          </Marker>
        )}

        {!pickMode && clubs.map(club => (
          <Marker key={club.id} position={[club.lat, club.lng]} icon={clubIcon}>
            <Popup>
              <div style={{ fontFamily: "DM Sans, sans-serif", minWidth: "140px" }}>
                <p style={{ fontWeight: 700, margin: "0 0 3px", color: "#1a0533", fontSize: "13px" }}>
                  {club.name}
                </p>
                <p style={{ margin: "0 0 3px", color: "#9879d4", fontSize: "12px" }}>
                  {club.category}
                </p>
                {club.address && (
                  <p style={{ margin: 0, color: "#888", fontSize: "11px" }}>{club.address}</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}