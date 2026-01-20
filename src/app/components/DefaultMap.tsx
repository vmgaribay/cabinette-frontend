/**
 * DefaultMap.tsx
 *
 * React component for interactive Leaflet map.
 * - Fetches GeoJSON data for sites and visitor centers.
 * - Displays polygons and points with color-coding based on scores.
 * - Supports zooming to feature selection.
 * - Handles filtering.
 *
 * Props:
 * - scoreID: Mapping from site IDs to scores for color-coding.
 * - selectedFeature: Currently selected feature.
 * - setSelectedFeature: Callback to update selected feature.
 */
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
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { FeatureSelection } from "../types";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
// import { selectVisibleSiteIDs } from "../store/selector";

/**
 * Zooms map to fit visible features.
 * @param {Object} props
 * @param {FeatureCollection} [props.siteGeojson] - GeoJSON FeatureCollection of sites.
 * @param {Array.<[number, number]>} [props.vcPoints] - Array of [longitude, latitude] for visitor centers.
 * @returns {null}
 */
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

/**
 * Zooms map to selected feature.
 * @param {Object} props
 * @param {FeatureSelection|null} [props.selectedFeature] - Selected feature object.
 * @param {FeatureCollection} [props.sitesGeojson] - GeoJSON FeatureCollection of sites.
 * @param {FeatureCollection<Point>} [props.vcsGeojson] - GeoJSON FeatureCollection of visitor centers.
 * @returns {null}
 */
function ZoomToSelection({
  selectedFeature,
  sitesGeojson,
  vcsGeojson,
}: {
  selectedFeature?: FeatureSelection | null;
  sitesGeojson?: FeatureCollection;
  vcsGeojson?: FeatureCollection<Point>;
}) {
  const map = useMap();

  useEffect(() => {
    if (!selectedFeature) return;

    if (selectedFeature.type === "site" && sitesGeojson) {
      map.closePopup();

      const feature = sitesGeojson.features.find(
        (f) => f.properties?.id === selectedFeature.id,
      );
      if (feature) {
        let coords: [number, number][] = [];
        if (feature.geometry.type === "Polygon") {
          coords = feature.geometry.coordinates[0].map(([lng, lat]) => [
            lat,
            lng,
          ]);
        } else if (feature.geometry.type === "MultiPolygon") {
          coords = feature.geometry.coordinates.flatMap((polygon) =>
            polygon.flatMap((ring) =>
              ring
                .filter(
                  (c): c is [number, number] =>
                    Array.isArray(c) &&
                    c.length === 2 &&
                    typeof c[0] === "number" &&
                    typeof c[1] === "number",
                )
                .map(([lng, lat]) => [lat, lng] as [number, number]),
            ),
          );
        }

        if (coords.length > 0) {
          map.fitBounds(coords, { maxZoom: 10, padding: [30, 30] });
        }
      }
    } else if (selectedFeature.type === "vc" && vcsGeojson) {
      const feature = vcsGeojson.features.find(
        (f) => f.properties?.id === selectedFeature.id,
      );
      if (feature) {
        const [lng, lat] = feature.geometry.coordinates;
        map.flyTo([lat, lng], 8, { duration: 1 });
      }
    }
  }, [selectedFeature, sitesGeojson, vcsGeojson, map]);

  return null;
}
/**
 * Map component displaying sites and visitor centers.
 * @param {Object} props
 * @param {FeatureSelection|null} [props.selectedFeature] - Currently selected feature.
 * @param {(feature: FeatureSelection|null) => void} [props.setSelectedFeature] - Callback to update selected feature.
 * @returns {JSX.Element}
 */
export default function Map({
  scoreID,
  visibleSiteIDs,
  selectedFeature,
  setSelectedFeature,
}: {
  scoreID: Record<string, number>;
  visibleSiteIDs: string[];
  selectedFeature?: FeatureSelection | null;
  setSelectedFeature?: (feature: FeatureSelection | null) => void;
}) {
  const [allSitesData, setAllSitesData] = useState<
    FeatureCollection | undefined
  >(undefined);
  const [vcsGeojson, setVCsGeojson] = useState<
    FeatureCollection<Point> | undefined
  >(undefined);
  const fetchIdRef = useRef(0);

  const sitesGeojson = useMemo(() => {
    if (!allSitesData) return undefined;
    //if (!visibleSiteIDs || visibleSiteIDs.length === 0) return allSitesData;
    return {
      ...allSitesData,
      features: allSitesData.features.filter((feature: Feature) =>
        visibleSiteIDs.includes(feature.properties?.id),
      ),
    };
  }, [allSitesData, visibleSiteIDs]);

  const filteredUnitcodes = useSelector(
    (state: RootState) => state.filter.filterUnitcodes,
  );

  const { minScore, maxScore } = useMemo(() => {
    if (!scoreID) return { minScore: undefined, maxScore: undefined };
    const min = Math.min(...Object.values(scoreID));
    const max = Math.max(...Object.values(scoreID));
    return { minScore: min, maxScore: max };
  }, [scoreID]);

  useEffect(() => {
    const currentId = ++fetchIdRef.current;
    const controller = new AbortController();
    const signal = controller.signal;

    (async () => {
      try {
        const [sitesRes, vcsRes] = await Promise.all([
          fetch(`/api/map/site-polygons`, {
            signal,
            cache: "no-store",
          }),
          fetch(`/api/map/vc-points`, { signal, cache: "no-store" }),
        ]);
        const [sitesData, vcsData] = await Promise.all([
          sitesRes.json(),
          vcsRes.json(),
        ]);

        if (fetchIdRef.current === currentId) {
          setAllSitesData(sitesData);
          setVCsGeojson(vcsData);
        }
      } catch (err: unknown) {
        if ((err as Error).name !== "AbortError")
          console.error("Map fetch error:", err);
      }
    })();

    return () => controller.abort();
  }, [visibleSiteIDs]);

  useEffect(() => {
    if (!selectedFeature) return;

    if (
      selectedFeature.type === "site" &&
      sitesGeojson &&
      !sitesGeojson.features.some(
        (f) => f.properties?.id === selectedFeature.id,
      )
    ) {
      if (setSelectedFeature) {
        setSelectedFeature(null);
      }
    }

    if (
      selectedFeature.type === "vc" &&
      vcsGeojson &&
      !vcsGeojson.features.some((f) => f.properties?.id === selectedFeature.id)
    ) {
      if (setSelectedFeature) {
        setSelectedFeature(null);
      }
    }
  }, [selectedFeature, sitesGeojson, vcsGeojson, setSelectedFeature]);

  const vcPoints =
    vcsGeojson?.features
      ?.filter(
        (feature: Feature<Point, GeoJsonProperties>) =>
          !filteredUnitcodes ||
          filteredUnitcodes.length === 0 ||
          filteredUnitcodes.includes(feature.properties?.unitcode),
      )
      .map(
        (feature: Feature<Point, GeoJsonProperties>) =>
          feature.geometry.coordinates as [number, number],
      ) ?? [];

  const scoreColormap = useCallback(
    (score: number) => {
      if (
        maxScore === minScore ||
        minScore === undefined ||
        maxScore === undefined
      )
        return "rgba(143, 178, 248, 0.5)";
      const t = (score - minScore) / (maxScore - minScore);
      const minRgb = [255, 255, 255];
      const maxRgb = [0, 75, 224];
      const lerp = (a: number, b: number) => Math.round(a + (b - a) * t);
      const r = lerp(minRgb[0], maxRgb[0]);
      const g = lerp(minRgb[1], maxRgb[1]);
      const b = lerp(minRgb[2], maxRgb[2]);
      const a = lerp(0.5, 0.9);
      return `rgba(${r},${g},${b},${a})`;
    },
    [minScore, maxScore],
  );

  const geoJsonStyle = useCallback(
    (feature?: Feature) => {
      const id = String(feature?.properties?.id ?? "");
      const score = scoreID[id];
      const fillColor =
        score !== undefined ? scoreColormap(score) : "rgb(143, 178, 248, 0.5)";
      return {
        color:
          selectedFeature?.type === "site" &&
          selectedFeature.id === feature?.properties?.id
            ? "orange"
            : fillColor,
        weight:
          selectedFeature?.type === "site" &&
          selectedFeature.id === feature?.properties?.id
            ? 4
            : 2,
        fillOpacity: 0.8,
      };
    },
    [selectedFeature, scoreColormap, scoreID],
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
      {selectedFeature == null && (
        <FitVisible siteGeojson={sitesGeojson} vcPoints={vcPoints} />
      )}
      <ZoomToSelection
        selectedFeature={selectedFeature}
        sitesGeojson={sitesGeojson}
        vcsGeojson={vcsGeojson}
      />

      {sitesGeojson && (
        <GeoJSON
          key={`sites:${visibleSiteIDs?.join(",") ?? "all"}${filteredUnitcodes && filteredUnitcodes.length ? `:uc=${filteredUnitcodes.join(",")}` : ""}`}
          data={sitesGeojson}
          style={geoJsonStyle}
          onEachFeature={onEachFeature}
        />
      )}
      {vcsGeojson &&
        vcsGeojson.features
          ?.filter(
            (feature: Feature<Point, GeoJsonProperties>) =>
              !filteredUnitcodes ||
              filteredUnitcodes.length === 0 ||
              filteredUnitcodes.includes(feature.properties?.unitcode),
          )
          .map((feature: Feature<Point, GeoJsonProperties>) => {
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
          })}
    </MapContainer>
  );
}
