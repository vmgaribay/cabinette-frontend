"use client";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import type {
  FeatureCollection,
  Feature,
  Point,
  GeoJsonProperties,
} from "geojson";
import { useEffect, useState, useRef, useCallback } from "react";
import { FeatureSelection } from "../types";

type Props = { unitcodes?: string[] };

function FitVisible({
  siteGeojson,
  vcPoints,
}: {
  siteGeojson?: FeatureCollection;
  vcPoints?: [number, number][];
}) {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    if (
      !siteGeojson ||
      !siteGeojson.features ||
      siteGeojson.features.length === 0
    )
      return;
    let bounds: L.LatLngBoundsExpression | null = null;

    if (
      siteGeojson &&
      siteGeojson.features &&
      siteGeojson.features.length > 0
    ) {
      const coords: [number, number][] = [];
      siteGeojson.features.forEach((feature: Feature) => {
        const geom = feature.geometry;
        if (geom.type === "Polygon") {
          geom.coordinates[0].forEach((coord) => {
            if (Array.isArray(coord) && coord.length >= 2) {
              const [lng, lat] = coord;
              coords.push([lat, lng]);
            }
          });
        } else if (geom.type === "MultiPolygon") {
          geom.coordinates.forEach((polygon) => {
            polygon[0].forEach((coord) => {
              if (Array.isArray(coord) && coord.length >= 2) {
                const [lng, lat] = coord;
                coords.push([lat, lng]);
              }
            });
          });
        }
      });
      if (coords.length > 0) bounds = L.latLngBounds(coords);
    }

    if (
      (!bounds || bounds.isValid() === false) &&
      vcPoints &&
      vcPoints.length > 0
    ) {
      bounds = L.latLngBounds(vcPoints.map((coord) => [coord[1], coord[0]]));
    }

    if (bounds && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [30, 30] });
    }
  }, [siteGeojson, vcPoints, map]);

  return null;
}

export default function Map({
  unitcodes,
  sitesVisible,
  selectedFeature,
  setSelectedFeature,
}: Props & {
  sitesVisible?: (ids: string[]) => void;
  selectedFeature?: FeatureSelection | null;
  setSelectedFeature?: (feature: FeatureSelection | null) => void;
}) {
  const [sitesGeojson, setSitesGeojson] = useState<
    FeatureCollection | undefined
  >(undefined);
  const [vcsGeojson, setVCsGeojson] = useState<
    FeatureCollection<Point> | undefined
  >(undefined);
  const fetchIdRef = useRef(0);

  useEffect(() => {
    if (sitesGeojson && sitesGeojson.features) {
      const ids = sitesGeojson.features.map(
        (feature: Feature) => feature.properties?.id,
      );
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
          fetch(`/api/map/site-polygons${params}`, {
            signal,
            cache: "no-store",
          }),
          fetch(`/api/map/vc-points${params}`, { signal, cache: "no-store" }),
        ]);
        const [sitesData, vcsData] = await Promise.all([
          sitesRes.json(),
          vcsRes.json(),
        ]);

        if (fetchIdRef.current === currentId) {
          setSitesGeojson(sitesData);
          setVCsGeojson(vcsData);
        }
      } catch (err: unknown) {
        if ((err as Error).name !== "AbortError")
          console.error("Map fetch error:", err);
      }
    })();

    return () => controller.abort();
  }, [unitcodes]);

  const vcPoints =
    vcsGeojson?.features?.map(
      (feature: Feature<Point, GeoJsonProperties>) =>
        feature.geometry.coordinates as [number, number],
    ) ?? [];

  const geoJsonStyle = useCallback(
    (feature?: Feature) => ({
      color:
        selectedFeature?.type === "site" &&
        selectedFeature.id === feature?.properties?.id
          ? "orange"
          : "#3388ff",
      weight:
        selectedFeature?.type === "site" &&
        selectedFeature.id === feature?.properties?.id
          ? 4
          : 2,
      fillOpacity: 0.3,
    }),
    [selectedFeature],
  );

  const onEachFeature = useCallback(
    (feature: Feature, layer: L.Layer) => {
      layer.on({
        click: () => {
          if (setSelectedFeature) {
            setSelectedFeature({ type: "site", id: feature.properties?.id });
          }
        },
      });
    },
    [setSelectedFeature],
  );

  return (
    <MapContainer
      center={[39, -105]}
      zoom={6}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FitVisible siteGeojson={sitesGeojson} vcPoints={vcPoints} />

      {sitesGeojson && (
        <GeoJSON
          key={
            unitcodes && unitcodes.length ? unitcodes.join(",") : "all-sites"
          }
          data={sitesGeojson}
          style={geoJsonStyle}
          onEachFeature={onEachFeature}
        />
      )}
      {vcsGeojson &&
        vcsGeojson.features?.map(
          (feature: Feature<Point, GeoJsonProperties>) => {
            const [lon, lat] = feature.geometry.coordinates;
            const isSelected =
              selectedFeature &&
              selectedFeature.type === "vc" &&
              selectedFeature.id === feature.properties?.id;

            return (
              <CircleMarker
                key={feature.properties?.id}
                center={[lat, lon]}
                pathOptions={{
                  color: isSelected ? "orange" : "red",
                  fillColor: isSelected ? "orange" : "red",
                }}
                radius={isSelected ? 6 : 4}
                eventHandlers={{
                  click: () => {
                    if (setSelectedFeature) {
                      setSelectedFeature({
                        type: "vc",
                        id: feature.properties?.id,
                      });
                    }
                  },
                }}
              >
                <Popup>
                  <strong>
                    {feature.properties?.name ?? feature.properties?.id}
                  </strong>
                </Popup>
              </CircleMarker>
            );
          },
        )}
    </MapContainer>
  );
}
