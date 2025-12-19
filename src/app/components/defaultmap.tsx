"use client";
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState, useRef } from "react";


type Props = { unitcodes?: string[] };

async function fetchGeoJSON(url: string) {
  const res = await fetch(url);
  return res.json();
}

export default function Map({ unitcodes }: Props) {
  const [sitesGeojson, setSitesGeojson] = useState<any>(null);
  const [vcsGeojson, setVCsGeojson] = useState<any>(null);
  const fetchIdRef = useRef(0);
  
console.log(unitcodes);

 useEffect(() => {
    const currentId = ++fetchIdRef.current;
    const controller = new AbortController();
    const signal = controller.signal;
const params =
  unitcodes && unitcodes.length > 0
    ? `?unitcodes=${unitcodes.map(encodeURIComponent).join(",")}`
    : "";

    (async () => {
      try {
        const [sitesRes, vcsRes] = await Promise.all([
          fetch(`/api/map/site-polygons${params}`, { signal, cache: "no-store" }),
          fetch(`/api/map/vc-points${params}`, { signal, cache: "no-store" })
        ]);
        const [sitesData, vcsData] = await Promise.all([sitesRes.json(), vcsRes.json()]);

        if (fetchIdRef.current === currentId) {
          setSitesGeojson(sitesData);
          setVCsGeojson(vcsData);
        }
      } catch (err: any) {
        if (err.name !== "AbortError") console.error("Map fetch error:", err);
      }
    })();

    return () => controller.abort();
  }, [unitcodes]);

  return (
    <MapContainer center={[39, -105]} zoom={6} style={{ height: "100%", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {sitesGeojson &&  (       
        <GeoJSON
          key={unitcodes && unitcodes.length ? unitcodes.join(",") : "all-sites"}
          data={sitesGeojson}
        />
      )}

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