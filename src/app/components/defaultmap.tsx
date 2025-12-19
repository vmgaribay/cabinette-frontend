"use client";
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";


type Props = { unitcode?: string };

export default function Map({ unitcode }: Props) {
  const [sitesGeojson, setSitesGeojson] = useState<any>(null);
  const [vcsGeojson, setVCsGeojson] = useState<any>(null);

  useEffect(() => {
    const q = unitcode ? `?unitcode=${encodeURIComponent(unitcode)}` : "";
    fetch(`/api/map/site-polygons${q}`).then(r => r.json()).then(setSitesGeojson);
    fetch(`/api/map/vc-points${q}`).then(r => r.json()).then(setVCsGeojson);
  }, [unitcode]);

  return (
    <MapContainer center={[39, -105]} zoom={6} style={{ height: "100%", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {sitesGeojson && <GeoJSON data={sitesGeojson} />}

      {vcsGeojson && vcsGeojson.features?.map((f: any) => {
        const [lon, lat] = f.geometry.coordinates;
        return (
          <CircleMarker
            key={f.properties.id}
            center={[lat, lon]}
            pathOptions={{ color: "red", fillColor: "red" }}
            radius={4}
          >
            <Popup>
              <strong>{f.properties.name ?? f.properties.id}</strong>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}