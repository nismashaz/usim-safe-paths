import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap, useMapEvents } from "react-leaflet";
import { CAMPUS_BOUNDS, CAMPUS_POLYGON, CATEGORIES, type Report } from "@/lib/hazards";

const icon = (r: Report) =>
  L.divIcon({
    className: "",
    html: `<div class="hz-pin hz-${r.category}">${CATEGORIES[r.category].icon}</div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -16],
  });

const pickIcon = L.divIcon({ className: "", html: `<div class="hz-pin hz-pick">📍</div>`, iconSize: [34, 34], iconAnchor: [17, 17] });

function Controller({ focus, markers }: { focus: { id: string; n: number } | null; markers: React.MutableRefObject<Record<string, L.Marker>> }) {
  const map = useMap();
  useEffect(() => {
    if (!focus) return;
    const m = markers.current[focus.id];
    if (m) {
      map.flyTo(m.getLatLng(), Math.max(map.getZoom(), 17), { duration: 0.6 });
      setTimeout(() => m.openPopup(), 650);
    }
  }, [focus, map, markers]);
  return null;
}

function Picker({ onPick }: { onPick: ((lat: number, lng: number) => void) | undefined }) {
  useMapEvents({ click: (e) => onPick?.(e.latlng.lat, e.latlng.lng) });
  return null;
}

export default function HazardMap({
  reports, focus, picking, picked, onPick,
}: {
  reports: Report[];
  focus: { id: string; n: number } | null;
  picking: boolean;
  picked: [number, number] | null;
  onPick: (lat: number, lng: number) => void;
}) {
  const markers = useRef<Record<string, L.Marker>>({});
  const b = L.latLngBounds(CAMPUS_BOUNDS);
  return (
    <MapContainer bounds={b} boundsOptions={{ padding: [10, 10] }} minZoom={15} maxZoom={19} maxBounds={b.pad(0.6)} maxBoundsViscosity={1} className={`h-full w-full ${picking ? "cursor-crosshair" : ""}`}>
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" maxZoom={19} />
      <Polygon positions={CAMPUS_POLYGON} interactive={false} pathOptions={{ color: "#1e3a5f", weight: 2, dashArray: "6 6", fillOpacity: 0.03, interactive: false }} />
      {reports.map((r) => (
        <Marker key={r.id} position={[r.lat, r.lng]} icon={icon(r)} ref={(m) => { if (m) markers.current[r.id] = m; }}>
          <Popup>
            <div className="space-y-1 text-sm">
              {r.demo && <span className="demo-tag">Demonstration Data</span>}
              <div className="text-base font-semibold text-foreground">{r.title}</div>
              <div><b>Category:</b> {CATEGORIES[r.category].label}</div>
              <div>{r.description}</div>
              <div><b>Reported:</b> {r.date}</div>
              <div><b>Status:</b> <span className={`status-badge status-${r.status.toLowerCase()}`}>{r.status}</span></div>
              {r.photo && <img src={r.photo} alt="Report" className="mt-1 max-h-28 rounded" />}
            </div>
          </Popup>
        </Marker>
      ))}
      {picked && <Marker position={picked} icon={pickIcon} />}
      <Controller focus={focus} markers={markers} />
      <Picker onPick={picking ? onPick : undefined} />
    </MapContainer>
  );
}
