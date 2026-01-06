/**
 * FilteredMap.tsx
 *
 * React component for filtering and features on an interactive map, also houses ranking table.
 * - Enables filtering site visibility by park/monument.
 * - Displays a multi-select dropdown for park selection.
 * - Renders a table of ranked sites.
 * - Renders a dynamic map with filtered features.
 *
 * Props:
 * - sitesVisible: Callback to notify parent of currently visible sites.
 * - selectedFeature: Currently selected feature.
 * - setSelectedFeature: Callback to update selected feature.
 * - scoredSites: Array of site information objects with scores.
 * - visibleSiteIds: Array of currently visible sites.
 */
"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import RankingTable from "./RankingTable";
import { FeatureSelection, SiteInfoRow } from "../types";
const DynamicMap = dynamic(() => import("./DefaultMap"), { ssr: false });

type Park = { unitcode: string; parkname: string };

/**
 * FilteredMap component for filtering the default map.
 * @param {Object} props
 * @param {(ids: string[]) => void} [props.sitesVisible] - Callback with visible sites.
 * @param {FeatureSelection|null} props.selectedFeature - Currently selected feature.
 * @param {(feature: FeatureSelection|null) => void} props.setSelectedFeature - Callback to update selected feature.
 * @param {Array<SiteInfoRow & {score: number}>} props.scoredSites - Array of site info objects with score prop.
 * @param {string[]} props.visibleSiteIds - Array of currently visible sites.
 * @returns {JSX.Element}
 */
export default function FilteredMap({
  sitesVisible,
  selectedFeature,
  setSelectedFeature,
  scoredSites,
  visibleSiteIds,
}: {
  sitesVisible?: (ids: string[]) => void;
  selectedFeature: FeatureSelection | null;
  setSelectedFeature: (feature: FeatureSelection | null) => void;
  scoredSites: (SiteInfoRow & { score: number })[];
  visibleSiteIds: string[];
}) {
  const [parks, setParks] = useState<Park[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [mapUnitcodes, setMapUnitcodes] = useState<string[]>([]);

  const scoreID = useMemo(() => {
    const map: Record<string, number> = {};
    scoredSites.forEach((site) => {
      map[site.id] = site.score;
    });
    return map;
  }, [scoredSites]);

  useEffect(() => {
    fetch("/api/map/unitcodes_names")
      .then((r) => r.json())
      .then(setParks);
  }, []);

  useEffect(() => {
    setMapUnitcodes(selected);
  }, [selected]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedOptions = Array.from(e.target.selectedOptions).map(
        (opt) => opt.value,
      );
      setSelected(selectedOptions);
    },
    [],
  );
  const handleClear = () => setSelected([]);

  const unitcodesKey = mapUnitcodes.join(",");

  return (
    <div style={{ display: "flex", gap: 12 }}>
      <div style={{ width: 330 }}>
        <label className="multi-select-header">
          Filter Site Visibility by Park/Monument:
        </label>
        <select
          multiple
          value={selected}
          onChange={handleChange}
          className="multi-select"
        >
          {[...parks]
            .sort((a, b) => a.parkname.localeCompare(b.parkname))
            .map((p) => (
              <option key={p.unitcode} value={p.unitcode}>
                {p.parkname}
              </option>
            ))}
        </select>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 8,
          }}
        >
          <span style={{ fontSize: 12, color: "rgb(154, 167, 193, 0.8)" }}>
            Hold Ctrl (Windows) or Cmd (Mac) to choose multiple locations of
            interest. Use button to clear.
          </span>
          <button
            type="button"
            onClick={handleClear}
            style={{
              fontSize: 12,
              padding: "2px 8px",
              background: "rgb(215, 218, 223)",
              border: "1px solid rgb(143, 178, 248)",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Clear Filters
          </button>
        </div>

        <RankingTable
          scoredSites={scoredSites}
          selectedFeature={selectedFeature}
          setSelectedFeature={setSelectedFeature}
          visibleSiteIds={visibleSiteIds}
        />
      </div>

      <div
        style={{ flex: 1, height: 600, borderRadius: 16, overflow: "hidden" }}
      >
        {<DynamicMap
          key={unitcodesKey}
          unitcodes={mapUnitcodes}
          scoreID={scoreID}
          sitesVisible={sitesVisible}
          selectedFeature={selectedFeature}
          setSelectedFeature={setSelectedFeature}
        />}
      </div>
    </div>
  );
}
