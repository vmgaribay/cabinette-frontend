"use client";
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState, useRef ,useCallback} from "react";
import { FeatureSelection } from "../types";


type Props = { unitcodes?: string[] };

async function fetchGeoJSON(url: string) {
  const res = await fetch(url);
  return res.json();
}

function FitVisible({ geojson, points }: { geojson?: any; points?: any[] }) {
  const map = useMap();
    useEffect(() => {
    if (!map) return;
    if (!geojson || !geojson.features || geojson.features.length === 0) return;

    let bounds: L.LatLngBoundsExpression | null = null;

    if (geojson && geojson.features && geojson.features.length > 0) {
      const coords: [number, number][] = [];
      geojson.features.forEach((feature: any) => {
        const geom = feature.geometry;
        if (geom.type === "Polygon") {
          geom.coordinates[0].forEach(([lng, lat]: [number, number]) => coords.push([lat, lng]));
        } else if (geom.type === "MultiPolygon") {
          geom.coordinates.forEach((poly: any) =>
            poly[0].forEach(([lng, lat]: [number, number]) => coords.push([lat, lng]))
          );
        }
      });
      if (coords.length > 0) bounds = L.latLngBounds(coords);
    }

    if ((!bounds || bounds.isValid() === false) && points && points.length > 0) {
      bounds = L.latLngBounds(points.map(([lng, lat]) => [lat, lng]));
    }

    if (bounds && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [30, 30] });
    }
  }, [geojson, points, map]);

  return null;
}

export default function Map({ unitcodes, sitesVisible, selectedFeature, setSelectedFeature }: Props & { sitesVisible?: (ids: string[]) => void, selectedFeature?: FeatureSelection | null, setSelectedFeature?: (feature: FeatureSelection | null) => void }) {
  const [sitesGeojson, setSitesGeojson] = useState<any>(null);
  const [vcsGeojson, setVCsGeojson] = useState<any>(null);
  const [selected, setSelected] = useState<FeatureSelection | null>(null);
  const fetchIdRef = useRef(0);

useEffect(() => {
    if (sitesGeojson && sitesGeojson.features) {
      const ids = sitesGeojson.features.map((f: any) => f.properties.id);
      if (sitesVisible) sitesVisible(ids);
    }
  }, [sitesGeojson, sitesVisible]);

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

  const vcPoints = vcsGeojson?.features?.map((f: any) => f.geometry.coordinates) ?? [];

  const geoJsonStyle = useCallback(
    (feature: any) => ({
      color:
      selectedFeature?.type === "site" && selectedFeature.id === feature.properties.id
        ? "orange"
        : "#3388ff",
    weight: selectedFeature?.type === "site" && selectedFeature.id === feature.properties.id ? 4 : 2,
    fillOpacity: 0.3,
  }),
  [selectedFeature]
  );
  
const onEachFeature = useCallback(
  (feature: any, layer: L.Layer) => {
    layer.on({
      click: () => setSelectedFeature({ type: "site", id: feature.properties.id }),
    });
  },
  [setSelectedFeature]
);


  return (
    <MapContainer center={[39, -105]} zoom={6} style={{ height: "100%", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FitVisible geojson={sitesGeojson} points={vcPoints} />

      {sitesGeojson &&  (       
        <GeoJSON
          key={unitcodes && unitcodes.length ? unitcodes.join(",") : "all-sites"}
          data={sitesGeojson}
          style={geoJsonStyle}
          onEachFeature={onEachFeature}
        />
      )}
      {vcsGeojson && vcsGeojson.features?.map((f: any) => {
        const [lon, lat] = f.geometry.coordinates;
        const isSelected = selected && selected.type === "vc" && selected.id === f.properties.id;

        return (
          <CircleMarker
            key={f.properties.id}
            center={[lat, lon]}
            pathOptions={{
                color: isSelected ? "orange" : "red",
                fillColor: isSelected ? "orange" : "red",
              }}
            radius={isSelected ? 6 : 4}
            eventHandlers={{
              click: () => setSelectedFeature({ type: "vc", id: f.properties.id }),
            }}
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